import { JSX } from "react";
import "./ProtectedRoute.css";
import { useAuth } from "../../../Context/AuthContext";
import { Navigate } from "react-router-dom";

interface Props {
    children: JSX.Element;
}

export function ProtectedRoute({ children }: Props) {
    const { state } = useAuth();
    if (!state.isLoggedIn) {
        return <Navigate to={"/login"} />;
    }

    return children;

}
