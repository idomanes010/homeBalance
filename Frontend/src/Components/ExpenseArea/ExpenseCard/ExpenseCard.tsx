import { NavLink } from "react-router-dom";
import { ExpensesModel } from "../../../Models/ExpensesModel";
import "./ExpenseCard.css";
import { useAuth } from "../../../Context/AuthContext";
import { useCurrency } from "../../../Utils/UserCurrency";

interface Props {
    expense: ExpensesModel;
    onDelete: (id: number) => void;
}

export function ExpenseCard({ expense, onDelete }: Props) {
    const { state } = useAuth();
    const { format } = useCurrency();

    return (
        <div className="ExpenseCard">
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
            </div>
            <div className="actions">
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