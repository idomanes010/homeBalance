import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CategoryModel } from "../../../Models/CategoryModel";
import { ExpensesModel } from "../../../Models/ExpensesModel";
import "./AddExpense.css";
import { useNavigate } from "react-router-dom";
import { categoryService } from "../../../Services/CategoryService";
import { notify } from "../../../Utils/Notify";
import { expenseService } from "../../../Services/ExpenseService";

export function AddExpense() {
    const [categories, setCategories] = useState<CategoryModel[]>([]);
    const { register, handleSubmit, watch } = useForm<ExpensesModel>();
    const dateInputRef = useRef<HTMLInputElement>(null);
    const { ref: registerDateRef, ...dateRest } = register("expenseDate");
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const watchCategoryId = watch("categoryId");
    const navigate = useNavigate();
    const selectedCategory = categories.find(c => c.id === +(watchCategoryId ?? 0));

    useEffect(() => {
        async function fetchCategories() {
            try {
                const data = await categoryService.getAllCategories();
                setCategories(data);
            }
            catch (err: any) {
                notify.error(err);
            }
        }
        fetchCategories();
    }, [])


    async function send(expense: ExpensesModel) {
        if (isSubmitting) return;
        try {
            setIsSubmitting(true);
            await expenseService.createExpense(expense);
            notify.success("Expense added!");
            navigate("/expenses")

        }
        catch (err: any) {
            notify.error(err);
            setIsSubmitting(false);
        }
    }

    return (
        <div className="AddExpense">
            <div className="form-page-header">
                <h2>Add Expense</h2>
                <p>Track a new expense for your household</p>
            </div>
            <form onSubmit={handleSubmit(send)}>
                <h2>Add Expense</h2>

                <div className="form-group">
                    <label>Title</label>
                    <input type="text" {...register("title")} required placeholder="e.g. Grocery run" />
                </div>

                <div className="form-group">
                    <label>Amount</label>
                    <input type="number" {...register("amount")} required placeholder="0.00" step="0.01" />
                </div>

                <div className="form-group">
                    <label>Category</label>
                    <select {...register("categoryId")} defaultValue="">
                        <option value="" disabled>Select a category...</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.categoryName}</option>
                        ))}
                    </select>
                    {selectedCategory?.categoryName?.toLowerCase() === "other" && (
                        <p className="hint">💡 Adding a note helps you remember what this was for.</p>
                    )}
                </div>

                <div className="form-group">
                    <label>Expense Date</label>
                    <div className="date-picker-trigger" onClick={() => dateInputRef.current?.showPicker()}>
                        <span>📅 {selectedDate || "Select date"}</span>
                        <input
                            {...dateRest}
                            ref={(e) => {
                                registerDateRef(e);
                                dateInputRef.current = e;
                            }}
                            type="date"
                            onChange={(e) => {
                                dateRest.onChange(e);
                                setSelectedDate(e.target.value);
                            }}
                            style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Notes (optional)</label>
                    <textarea placeholder="Enter notes..." {...register("note")} />
                </div>

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : "Add Expense"}
                </button>
            </form>
        </div>
    );
}
