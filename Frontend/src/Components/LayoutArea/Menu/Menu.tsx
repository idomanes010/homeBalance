import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Receipt, PlusCircle, Wallet, Home } from "lucide-react";
import { useAuth } from "../../../Context/AuthContext";
import { notify } from "../../../Utils/Notify";
import "./Menu.css";

export function Menu() {
    const { state } = useAuth();
    const navigate = useNavigate();

    function handleProtectedClick(e: React.MouseEvent) {
        if (!state.isLoggedIn) {
            e.preventDefault();
            notify.error("Please login first to access your household.");
            navigate("/login");
        }
    }

    return (
        <aside className="Menu">
            <nav>
                {!state.isLoggedIn && (
                    <NavLink to="/landingPage" data-tooltip="Home">
                        <Home size={20} />
                        <span>Home</span>
                    </NavLink>
                )}

                <NavLink to="/dashboard" onClick={handleProtectedClick} data-tooltip="Dashboard">
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink to="/expenses" onClick={handleProtectedClick} end data-tooltip="Expenses">
                    <Receipt size={20} />
                    <span>Expenses</span>
                </NavLink>

                <NavLink to="/expenses/new" onClick={handleProtectedClick} data-tooltip="Add Expense">
                    <PlusCircle size={20} />
                    <span>Add Expenses</span>
                </NavLink>

                <NavLink to="/budget" onClick={handleProtectedClick} data-tooltip="Budget">
                    <Wallet size={20} />
                    <span>Budget</span>
                </NavLink>

                <NavLink to="/household" onClick={handleProtectedClick} data-tooltip="Household">
                    <Home size={20} />
                    <span>Household</span>
                </NavLink>
            </nav>
        </aside>
    );
}