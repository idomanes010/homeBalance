import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";
import { ExpensesModel } from "../../../Models/ExpensesModel";
import { useCurrency } from "../../../Utils/UserCurrency";
import "./ExpenseCard.css";

interface Props {
    expense: ExpensesModel;
    onDelete: (id: number) => void;
}

export function ExpenseCard({ expense, onDelete }: Props) {
    const { state } = useAuth();
    const { format } = useCurrency();
    const [expanded, setExpanded] = useState(false);

    function handleClick() {
        if (window.innerWidth <= 480) {
            setExpanded(prev => !prev);
        }
    }

    return (
        <div
            className={`ExpenseCard ${expanded ? "ExpenseCard--expanded" : ""}`}
            onClick={handleClick}>
            <div className="expense-info">
                <span className="category">{expense.categoryName}</span>
                <span className="title">{expense.title}</span>
                <span className="amount">{format(expense.amount ?? 0)}</span>
                <span className="date">
                    {expense.expenseDate ? new Date(expense.expenseDate).toLocaleDateString() : ""}
                </span>
                {expense.createdByName && (
                    <span className="created-by">👤 {expense.createdByName}</span>
                )}
                {expense.note && (
                    <span className="note-text">📝 {expense.note}</span>
                )}
            </div>

            {/* Expanded details — mobile only */}
            {expanded && (
                <div className="expense-details">
                    <span className="detail-item">
                        📅 {expense.expenseDate ? new Date(expense.expenseDate).toLocaleDateString() : ""}
                    </span>
                    {expense.createdByName && (
                        <span className="detail-item">👤 {expense.createdByName}</span>
                    )}
                    {expense.note && (
                        <span className="detail-item">📝 {expense.note}</span>
                    )}
                </div>
            )}

            <div className="actions" onClick={e => e.stopPropagation()}>
                {state.user?.id === expense.createdBy && (
                    <NavLink to={`/expenses/edit/${expense.id}`}>Edit</NavLink>
                )}
                {state.user?.id === expense.createdBy && (
                    <button onClick={() => onDelete(expense.id!)}>Delete</button>
                )}
            </div>
        </div>
    );
}