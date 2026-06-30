import { useEffect, useRef, useState } from "react";
import "./BudgetPage.css";
import { MonthlyBudgetModel } from "../../../Models/MonthlyBudgetModel";
import { useForm } from "react-hook-form";
import { budgetService } from "../../../Services/BudgetService";
import { expenseService } from "../../../Services/ExpenseService";
import { notify } from "../../../Utils/Notify";
import { useCurrency } from "../../../Utils/UserCurrency";
import { Spinner } from "../../SharedArea/Spinner/Spinner";

export function BudgetPage() {
    const [budgets, setBudgets] = useState<MonthlyBudgetModel[]>([]);
    const [monthlySpending, setMonthlySpending] = useState<{ [month: string]: number }>({});
    const [selectedMonthDisplay, setSelectedMonthDisplay] = useState<string>("");
    const { register, handleSubmit, reset } = useForm<MonthlyBudgetModel>();
    const [loading, setLoading] = useState(true);
    const monthInputRef = useRef<HTMLInputElement>(null);
    const { format } = useCurrency();


    useEffect(() => {
        async function fetchData() {
            try {
                const budgetData = await budgetService.getAllBudgets();
                setBudgets(budgetData);

                const spending: { [month: string]: number } = {};
                for (const budget of budgetData) {
                    if (budget.budgetMonth) {
                        const [year, m] = budget.budgetMonth.split("-").map(Number);
                        const from = `${budget.budgetMonth}-01`;
                        const lastDay = new Date(year, m, 0).getDate();
                        const to = `${budget.budgetMonth}-${String(lastDay).padStart(2, "0")}`;
                        const expenses = await expenseService.getFilteredExpenses(undefined, from, to);
                        spending[budget.budgetMonth] = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
                    }
                }
                setMonthlySpending(spending);
            }
            catch (err: any) {
                notify.error(err);
            }
            finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    async function send(budget: MonthlyBudgetModel) {
        try {
            await budgetService.setBudget(budget);
            const data = await budgetService.getAllBudgets();
            setBudgets(data);
            reset();
            notify.success("Budget saved!");
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    async function handleDelete(id: number) {
        try {
            const confirmed = window.confirm("Are you sure?");
            if (!confirmed) return;
            await budgetService.deleteBudget(id);
            setBudgets(prev => prev.filter(b => b.id !== id));
            notify.success("Budget deleted!");
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    const { ref: registerRef, ...rest } = register("budgetMonth");

    return (
        <div className="BudgetPage">
            <div className="budget-header">
                <h2>Monthly Budget</h2>
                <p className="budget-subtitle">Set and manage your household's monthly spending limits</p>
            </div>

            {/* Tips cards */}
            <div className="budget-tips">
                <div className="budget-tip">
                    <span className="tip-icon">💡</span>
                    <div>
                        <div className="tip-title">50/30/20 Rule</div>
                        <div className="tip-desc">50% needs, 30% wants, 20% savings</div>
                    </div>
                </div>
                <div className="budget-tip">
                    <span className="tip-icon">📊</span>
                    <div>
                        <div className="tip-title">Track Weekly</div>
                        <div className="tip-desc">Review expenses every week to stay on track</div>
                    </div>
                </div>
                <div className="budget-tip">
                    <span className="tip-icon">🎯</span>
                    <div>
                        <div className="tip-title">Set Realistic Goals</div>
                        <div className="tip-desc">Start with your last month's spending as a baseline</div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit(send)}>
                <p style={{ fontSize: '13px', color: 'var(--text-light)', marginBottom: '20px' }}>
                    Set a monthly spending limit to help your household stay on track.
                </p>

                <div className="form-group">
                    <label>Month:</label>
                    <div className="month-picker-trigger" onClick={() => monthInputRef.current?.showPicker()}>
                        <span>📅 {selectedMonthDisplay || "Select month"}</span>
                        <input
                            {...rest}
                            ref={(e) => {
                                registerRef(e);
                                monthInputRef.current = e;
                            }}
                            type="month"
                            onChange={(e) => {
                                rest.onChange(e);
                                setSelectedMonthDisplay(e.target.value);
                            }}
                            style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Monthly Budget Amount:</label>
                    <input type="number" {...register("budgetAmount")} required placeholder="e.g. 3000" />
                </div>
                <button type="submit">Save Budget</button>
            </form>

            {loading && <Spinner />}
            {!loading && budgets.length === 0 && <p className="empty-state">No budgets set yet. Add your first one above!</p>}

            {budgets.map(budget => {
                const spent = monthlySpending[budget.budgetMonth!] || 0;
                const total = Number(budget.budgetAmount);
                const percent = Math.min((spent / total) * 100, 100);
                const isOver = spent > total;

                return (
                    <div key={budget.id} className="budget-row">
                        <div className="budget-row-top">
                            <span className="budget-month">{budget.budgetMonth}</span>
                            <span className={`budget-amount ${isOver ? "over" : ""}`}>
                                {format(spent)} / {format(total)}
                            </span>
                            <button className="budget-delete" onClick={() => handleDelete(budget.id!)}>Delete</button>
                        </div>
                        <div className="budget-progress-bar">
                            <div
                                className={`budget-progress-fill ${isOver ? "over" : ""}`}
                                style={{ width: `${percent}%` }}
                            />
                        </div>
                        <div className="budget-progress-labels">
                            <span>{percent.toFixed(0)}% used</span>
                            <span>{format(total - spent)} remaining</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}