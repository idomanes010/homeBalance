import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { CategoryModel } from "../../../Models/CategoryModel";
import { ExpensesModel } from "../../../Models/ExpensesModel";
import "./EditExpense.css";
import { expenseService } from "../../../Services/ExpenseService";
import { notify } from "../../../Utils/Notify";
import { categoryService } from "../../../Services/CategoryService";

export function EditExpense() {
    const [categories, setCategories] = useState<CategoryModel[]>([]);
    const { register, handleSubmit, watch, setValue } = useForm<ExpensesModel>();
    const watchCategoryId = watch("categoryId");
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dateInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const params = useParams();
    const id = Number(params.id);

    const selectedCategory = categories.find(c => c.id === +(watchCategoryId ?? 0));
    const { ref: registerDateRef, ...dateRest } = register("expenseDate");

    useEffect(() => {
        async function fetchData() {
            try {
                const cats = await categoryService.getAllCategories();
                setCategories(cats);

                const expense = await expenseService.getExpenseById(id);
                setValue("title", expense.title);
                setValue("amount", expense.amount);
                setValue("categoryId", expense.categoryId);
                setValue("note", expense.note);

                const formattedDate = expense.expenseDate
                    ? new Date(expense.expenseDate).toLocaleDateString("en-CA")
                    : "";
                setValue("expenseDate", formattedDate as any);
                setSelectedDate(formattedDate);
            }
            catch (err: any) {
                notify.error(err);
            }
        }
        fetchData();
    }, []);

    async function send(expense: ExpensesModel) {
        if (isSubmitting) return;
        try {
            setIsSubmitting(true);
            expense.id = +params.id!;
            expense.householdId = undefined;
            await expenseService.updateExpense(expense);
            notify.success("Expense updated!");
            navigate("/expenses");
        }
        catch (err: any) {
            notify.error(err);
            setIsSubmitting(false);
        }
    }

    return (
        <div className="EditExpense">
            <div className="edit-page-header">
                <h2>Edit Expense</h2>
                <p>Update the details of your expense</p>
            </div>

            <form onSubmit={handleSubmit(send)}>
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
                    {isSubmitting ? "Updating..." : "Update Expense"}
                </button>
            </form>
        </div>
    );
}