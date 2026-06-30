import { createContext, useContext, useEffect, useReducer } from "react";
import { UserModel } from "../Models/UserModel";
import { appConfig } from "../Utils/AppConfig";
import axiosInstance from "../Utils/AxiosInstance";

interface AuthState {
    user: UserModel | null;
    token: string | null;
    isLoggedIn: boolean;
    currency: string;
}

type AuthAction =
    | { type: "LOGIN"; payload: { user: UserModel; token: string; currency?: string } }
    | { type: "LOGOUT" }
    | { type: "SET_CURRENCY"; payload: string };

function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case "LOGIN":
            localStorage.setItem("token", action.payload.token);
            return {
                user: action.payload.user,
                token: action.payload.token,
                isLoggedIn: true,
                currency: action.payload.currency || "$"
            };
        case "LOGOUT":
            localStorage.removeItem("token");
            return { user: null, token: null, isLoggedIn: false, currency: "$" };
        case "SET_CURRENCY":
            return { ...state, currency: action.payload };
        default:
            return state;
    }
}

function getInitialState(): AuthState {
    const token = localStorage.getItem("token");
    return {
        user: null,
        token: token,
        isLoggedIn: !!token,
        currency: "$"
    };
}

const AuthContext = createContext<{
    state: AuthState;
    dispatch: React.Dispatch<AuthAction>;
}>({ state: getInitialState(), dispatch: () => null });

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, getInitialState());

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token && !state.user) {
            Promise.all([
                axiosInstance.get(appConfig.usersIdUrl),
                axiosInstance.get(appConfig.householdUrl)
            ])
                .then(([userResponse, householdResponse]) => {
                    dispatch({
                        type: "LOGIN",
                        payload: {
                            user: userResponse.data,
                            token,
                            currency: householdResponse.data.currency || "$"
                        }
                    });
                })
                .catch(() => {
                    localStorage.removeItem("token");
                    dispatch({ type: "LOGOUT" });
                });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}