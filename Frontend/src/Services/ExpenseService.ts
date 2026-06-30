import { ExpensesModel } from "../Models/ExpensesModel";
import { appConfig } from "../Utils/AppConfig";
import axiosInstance from "../Utils/AxiosInstance";

class ExpenseService {
    public async getAllExpenses(): Promise<ExpensesModel[]> {
        const response = await axiosInstance.get(appConfig.expensesUrl);
        return response.data;
    }

    public async getExpenseById(id: number): Promise<ExpensesModel> {
        const response = await axiosInstance.get(`${appConfig.expensesUrl}/${id}`);
        return response.data;
    }

    public async createExpense(expense: ExpensesModel): Promise<ExpensesModel> {
        const response = await axiosInstance.post(appConfig.expensesUrl, expense);
        return response.data;
    }

    public async updateExpense(expense: ExpensesModel): Promise<void> {
        await axiosInstance.put(`${appConfig.expensesUrl}/${expense.id}`, expense);
    }

    public async deleteExpense(id: number): Promise<void> {
        await axiosInstance.delete(`${appConfig.expensesUrl}/${id}`);
    }

    public async getFilteredExpenses(categoryId?: number, from?: string, to?: string): Promise<ExpensesModel[]> {
        const response = await axiosInstance.get(`${appConfig.expensesUrl}/filter`, {
            params: { categoryId, from, to }
        });
        return response.data;
    }
}

export const expenseService = new ExpenseService();
