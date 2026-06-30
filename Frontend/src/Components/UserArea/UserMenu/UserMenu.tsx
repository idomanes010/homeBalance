import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";
import "./UserMenu.css";
import { authService } from "../../../Services/AuthService";
import { notify } from "../../../Utils/Notify";

export function UserMenu() {
    const { state, dispatch } = useAuth();
    const user = state.user;
    const navigate = useNavigate();

    function logout() {
        authService.logout();
        dispatch({ type: "LOGOUT" });
        notify.success("Logged out successfully");
        navigate("/login");
    }

    return (
        <div className="UserMenu">
            {user && (
                <div className="logged-in">
                    <span>Hello {user.firstName} {user.lastName}</span>
                    <button onClick={logout}>Logout</button>
                </div>
            )}

            {!user && (
                <div className="logged-out">
                    <span>Hello Guest | </span>
                    <NavLink to="/login">Login</NavLink>
                    <span> | </span>
                    <NavLink to="/register">Register</NavLink>
                </div>
            )}
        </div>
    );
}