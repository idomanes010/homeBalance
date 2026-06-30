import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from "../../PagesArea/Home/Home";
import { Page404 } from "../../PagesArea/Page404/Page404";
import { Login } from "../../UserArea/Login/Login";
import { Register } from "../../UserArea/Register/Register";
import { Welcome } from "../../UserArea/Welcome/Welcome";
import { ExpenseList } from "../../ExpenseArea/ExpenseList/ExpenseList";
import { AddExpense } from "../../ExpenseArea/AddExpense/AddExpense";
import { EditExpense } from "../../ExpenseArea/EditExpense/EditExpense";
import { Household } from "../../HouseholdArea/Household/Household";
import { BudgetPage } from "../../BudgetArea/BudgetPage/BudgetPage";
import { ProtectedRoute } from "../../SharedArea/ProtectedRoute/ProtectedRoute";
import { LandingPage } from "../../PagesArea/LandingPage/LandingPage";
import { Layout } from "../Layout/Layout";

export function Routing() {
    return (
        <Routes>
            {/* Routes WITHOUT layout — fullscreen */}
            <Route path="/" element={<Navigate to="/landingPage" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/landingPage" element={<LandingPage />} />

            {/* Routes WITH layout — sidebar + header */}
            <Route element={<Layout />}>
                <Route path="/dashboard" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/expenses" element={<ProtectedRoute><ExpenseList /></ProtectedRoute>} />
                <Route path="/expenses/new" element={<ProtectedRoute><AddExpense /></ProtectedRoute>} />
                <Route path="/expenses/edit/:id" element={<ProtectedRoute><EditExpense /></ProtectedRoute>} />
                <Route path="/household" element={<ProtectedRoute><Household /></ProtectedRoute>} />
                <Route path="/budget" element={<ProtectedRoute><BudgetPage /></ProtectedRoute>} />
                <Route path="*" element={<Page404 />} />
            </Route>
        </Routes>
    );
}