import { MonthlyBudgetModel } from "../Models/MonthlyBudgetModel";
import { appConfig } from "../Utils/AppConfig";
import axiosInstance from "../Utils/AxiosInstance";

class BudgetService {
    public async getAllBudgets(): Promise<MonthlyBudgetModel[]> {
        const response = await axiosInstance.get(appConfig.monthlyBudgetUrl);
        return response.data;
    }

    public async getBudget(budgetMonth: string): Promise<MonthlyBudgetModel> {
        const response = await axiosInstance.get(`${appConfig.monthlyBudgetUrl}/${budgetMonth}`);
        return response.data;
    }

    public async setBudget(budget: MonthlyBudgetModel): Promise<void> {
        await axiosInstance.post(appConfig.monthlyBudgetUrl, budget);
    }

    public async deleteBudget(id: number): Promise<void> {
        await axiosInstance.delete(`${appConfig.monthlyBudgetUrl}/${id}`);
    }
}

export const budgetService = new BudgetService();
