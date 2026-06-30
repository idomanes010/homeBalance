import "./Home.css";
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { ExpensesModel } from "../../../Models/ExpensesModel";
import { MonthlyBudgetModel } from "../../../Models/MonthlyBudgetModel";
import { budgetService } from "../../../Services/BudgetService";
import { expenseService } from "../../../Services/ExpenseService";
import { useAuth } from "../../../Context/AuthContext";
import { useRef } from "react";
import { useCurrency } from "../../../Utils/UserCurrency";
import { Spinner } from "../../SharedArea/Spinner/Spinner";

// Colors for pie chart:
const COLORS = [
    "#6366f1", "#8b5cf6", "#ec4899",
    "#f97316", "#22c55e", "#06b6d4",
    "#eab308", "#ef4444", "#14b8a6", "#a855f7"
];

function getCurrentMonth(): string {
    return new Date().toISOString().slice(0, 7);
}

function getMonthRange(month: string): { from: string; to: string } {
    const [year, m] = month.split("-").map(Number);
    const from = `${month}-01`;
    const lastDay = new Date(year, m, 0).getDate();
    const to = `${month}-${String(lastDay).padStart(2, "0")}`;
    return { from, to };
}

export function Home() {
    const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
    const [expenses, setExpenses] = useState<ExpensesModel[]>([]);
    const [budget, setBudget] = useState<MonthlyBudgetModel | null>(null);
    const [loading, setLoading] = useState(true);
    const [chartReady, setChartReady] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const monthInputRef = useRef<HTMLInputElement>(null);
    const { state } = useAuth();
    const { format } = useCurrency();

    useEffect(() => {
        async function fetchData() {
            if (!state.isLoggedIn) return;
            try {
                setLoading(true);
                const { from, to } = getMonthRange(selectedMonth);

                // fetch expenses for selected month:
                const expenseData = await expenseService.getFilteredExpenses(undefined, from, to);
                setExpenses(expenseData);

                // fetch budget for selected month:
                const budgetData = await budgetService.getBudget(selectedMonth);
                setBudget(budgetData);
            }
            catch (err: any) {
                // budget might not exist for selected month — that's ok
                setBudget(null);
            }
            finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [selectedMonth, state.isLoggedIn]);

    // Calculations:
    const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const budgetAmount = Number(budget?.budgetAmount || 0);
    const remaining = budgetAmount - totalSpent;

    // Group expenses by category for pie chart:
    const categoryData = expenses.reduce((acc: { name: string; value: number }[], expense) => {
        const existing = acc.find(item => item.name === expense.categoryName);
        if (existing) {
            existing.value += Number(expense.amount || 0);
        } else {
            acc.push({ name: expense.categoryName || "Other", value: Number(expense.amount || 0) });
        }
        return acc;
    }, []);

    // reset when data changes:
    useEffect(() => {
        setChartReady(false);
        const timer = setTimeout(() => setChartReady(true), 2000);
        return () => clearTimeout(timer);
    }, [expenses]);

    const categoryExpenses = selectedCategory
        ? expenses.filter(e => e.categoryName === selectedCategory)
        : [];
    return (
        <div className="Dashboard">
            <div className="month-picker">
                <h2>Dashboard</h2>
                <div className="month-picker-trigger" onClick={() => monthInputRef.current?.showPicker()}>
                    <span>📅 {selectedMonth}</span>
                    <input
                        ref={monthInputRef}
                        type="month"
                        value={selectedMonth}
                        onChange={e => setSelectedMonth(e.target.value)}
                        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
                </div>
            </div>

            {loading && <Spinner />}

            {
                !loading && (
                    <>
                        {/* Summary cards — OUTSIDE the chart */}
                        <div className="summary-cards">
                            <div className="card">
                                <h3>Total Spent</h3>
                                <p>{format(totalSpent)}</p>
                                <span className="card-sub">{expenses.length} transactions</span>
                            </div>
                            <div className="card">
                                <h3>Monthly Budget</h3>
                                <p>{budgetAmount ? format(budgetAmount) : "Not set"}</p>
                                <span className="card-sub">this month</span>
                            </div>
                            <div className="card">
                                <h3>Remaining</h3>
                                <p className={remaining < 0 ? "over-budget" : "under-budget"}>
                                    {budgetAmount ? format(remaining) : "N/A"}
                                </p>
                                <span className="card-sub">available</span>
                            </div>
                        </div>

                        {/* Pie chart */}
                        {categoryData.length > 0 ? (
                            <div className="chart-section">
                                <h3>Spending by Category</h3>
                                <div className="chart-wrapper">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={categoryData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={85}
                                                outerRadius={140}
                                                paddingAngle={0.8}
                                                stroke="none"
                                            >
                                                {categoryData.map((_, index) => (
                                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value: any) => format(Number(value))} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="chart-center">
                                        {chartReady && (
                                            <>
                                                <span className="chart-center-label">Total Spent</span>
                                                <span className="chart-center-amount">{format(totalSpent)}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Legend + Side Panel */}
                                <div className="legend-container">
                                    <div className="chart-legend">
                                        {categoryData.map((item, index) => (
                                            <div
                                                key={item.name}
                                                className={`legend-item ${selectedCategory === item.name ? "legend-item--active" : ""}`}
                                                onClick={() => setSelectedCategory(prev => prev === item.name ? null : item.name)}
                                            >
                                                <div className="legend-icon" style={{ background: COLORS[index % COLORS.length] }}>
                                                    {item.name.charAt(0)}
                                                </div>
                                                <span className="legend-name">{item.name}</span>
                                                <span className="legend-value">{format(Number(item.value))}</span>
                                                <span className="legend-arrow">›</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Side panel */}
                                    <div className={`category-panel ${selectedCategory ? "category-panel--open" : ""}`}>
                                        {selectedCategory && (
                                            <>
                                                <div className="panel-header">
                                                    <div
                                                        className="panel-icon"
                                                        style={{
                                                            background: COLORS[categoryData.findIndex(c => c.name === selectedCategory) % COLORS.length]
                                                        }}
                                                    >
                                                        {selectedCategory.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4>{selectedCategory}</h4>
                                                        <span>{format(Number(categoryData.find(c => c.name === selectedCategory)?.value ?? 0))}</span>
                                                    </div>
                                                    <button className="panel-close" onClick={() => setSelectedCategory(null)}>✕</button>
                                                </div>

                                                <div className="panel-expenses">
                                                    {categoryExpenses.map(expense => (
                                                        <div key={expense.id} className="panel-row">
                                                            <span className="panel-title">{expense.title}</span>
                                                            <div className="panel-right">
                                                                <span className="panel-amount">{format(expense.amount ?? 0)}</span>
                                                                <span className="panel-date">
                                                                    {expense.expenseDate ? new Date(expense.expenseDate).toLocaleDateString() : ""}
                                                                </span>
                                                                {expense.createdByName && (
                                                                    <span className="created-by">👤 {expense.createdByName}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p>No spending data for this month.</p>
                        )}
                    </>
                )
            }
        </div >
    );
}
