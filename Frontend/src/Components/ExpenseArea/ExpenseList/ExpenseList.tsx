import { useEffect, useRef, useState } from "react";
import { ExpensesModel } from "../../../Models/ExpensesModel";
import "./ExpenseList.css";
import { useNavigate } from "react-router-dom";
import { expenseService } from "../../../Services/ExpenseService";
import { ExpenseCard } from "../ExpenseCard/ExpenseCard";
import { notify } from "../../../Utils/Notify";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { UserModel } from "../../../Models/UserModel";
import { householdService } from "../../../Services/HouseholdService";
import { useCurrency } from "../../../Utils/UserCurrency";
import { Spinner } from "../../SharedArea/Spinner/Spinner";

const COLORS = [
    "#352dcc", "#952c9c", "#db2777",
    "#0dfc01", "#005f23", "#015c72",
    "#6b008f", "#eeff00",
    "#a97402", "#ff0000"
];

function getCurrentMonth(): string {
    return new Date().toISOString().slice(0, 7);
}

export function ExpenseList() {
    const [expenses, setExpenses] = useState<ExpensesModel[]>([]);
    const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
    const [selectedMember, setSelectedMember] = useState<number | null>(null);
    const [members, setMembers] = useState<UserModel[]>([]);
    const [loading, setLoading] = useState(true);
    const monthInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const { format, currency } = useCurrency();

    useEffect(() => {
        async function fetchData() {
            try {
                const [expenseData, householdData] = await Promise.all([
                    expenseService.getAllExpenses(),
                    householdService.getHousehold()
                ]);
                setExpenses(expenseData);
                setMembers(householdData.members as UserModel[] || []);
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



    async function handleDelete(id: number) {
        try {
            const confirmed = window.confirm("Are you sure you want to delete this expense?");
            if (!confirmed) return;
            await expenseService.deleteExpense(id);
            setExpenses(prev => prev.filter(e => e.id !== id));
            notify.success("Expense deleted!");
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    // Filter by selected month:
    const filteredExpenses = expenses
        .filter(e => e.expenseDate ? String(e.expenseDate).slice(0, 7) === selectedMonth : false)
        .filter(e => selectedMember ? e.createdBy === selectedMember : true)

    // Group by category for bar chart:
    const categoryData = filteredExpenses.reduce((acc: { name: string; value: number }[], expense) => {
        const existing = acc.find(item => item.name === expense.categoryName);
        if (existing) {
            existing.value += Number(expense.amount || 0);
        } else {
            acc.push({ name: expense.categoryName || "Other", value: Number(expense.amount || 0) });
        }
        return acc;
    }, []);

    function exportToCSV() {
        if (filteredExpenses.length === 0) {
            notify.error("No expenses to export");
            return;
        }

        const headers = ["Date", "Title", "Category", "Amount", "Added By"];
        const rows = filteredExpenses.map(e => [
            e.expenseDate ? new Date(e.expenseDate).toLocaleDateString() : "",
            e.title || "",
            e.categoryName || "",
            format(e.amount ?? 0),
            e.createdByName || ""
        ]);

        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(","))
            .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `expenses-${selectedMonth}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="ExpenseList">
            <div className="list-header">
                <h2>Expenses</h2>
                <div className="list-header-right">
                    <div className="month-picker-trigger" onClick={() => monthInputRef.current?.showPicker()}>
                        <span>📅 {selectedMonth}</span>
                        <input
                            ref={monthInputRef}
                            type="month"
                            value={selectedMonth}
                            onChange={e => setSelectedMonth(e.target.value)}
                            style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
                    </div>

                    <select
                        className="member-filter"
                        value={selectedMember ?? ""}
                        onChange={e => setSelectedMember(e.target.value ? Number(e.target.value) : null)}>
                        <option value="">👥 All Members</option>
                        {members.map(member => (
                            <option key={(member as any).userId} value={(member as any).userId}>
                                👤 {member.firstName} {member.lastName}
                            </option>
                        ))}
                    </select>

                    <button className="export-btn" onClick={exportToCSV}>
                        ⬇ <span className="export-text">Export CSV</span>
                    </button>

                    <button onClick={() => navigate("/expenses/new")}>+ Add Expense</button>
                </div>
            </div>

            {loading ? (<Spinner />) : (<>
                {categoryData.length > 0 && (
                    <div className="expense-chart">
                        <h3>Spending by Category — {selectedMonth}</h3>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={categoryData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                                <YAxis
                                    tick={{ fontSize: 12, fill: "#6b7280" }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(v) => `${currency}${v}`} />
                                <Tooltip
                                    formatter={(value: any) => [format(value), "Spent"]}
                                    cursor={{ fill: "rgba(79,70,229,0.06)" }} />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
                                    {categoryData.map((_, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {filteredExpenses.map(expense => (
                    <ExpenseCard key={expense.id} expense={expense} onDelete={handleDelete} />
                ))}

                {filteredExpenses.length === 0 && (
                    <p className="empty">No expenses found for the selected filters.</p>
                )}</>
            )}
        </div>
    );
}