import { NotFoundError, ValidationError } from "../3-models/client-errors";
import { MonthlyBudgetModel } from "../3-models/monthly-budget-model";
import { monthlyBudgetRepository } from "../7-repository/monthly.budget.repository";

class MonthlyBudgetService {

    public async setMonthlyBudget(monthlyBudget: MonthlyBudgetModel): Promise<MonthlyBudgetModel> {
        monthlyBudget.validate();
        return await monthlyBudgetRepository.setMonthlyBudget(monthlyBudget);
    }

    public async getMonthlyBudget(householdId: number, budgetMonth: string): Promise<MonthlyBudgetModel> {
        return await monthlyBudgetRepository.getMonthlyBudget(householdId, budgetMonth);
    }

    public async getAllMonthlyBudgets(householdId: number): Promise<MonthlyBudgetModel[]> {
        return await monthlyBudgetRepository.getAllMonthlyBudgets(householdId);
    }

    public async deleteMonthlyBudget(householdId: number, monthlyBudgetId: number): Promise<void> {

        // check if there is budget:
        const exists = await monthlyBudgetRepository.exists(monthlyBudgetId, householdId);
        if (!exists) throw new NotFoundError("Budget not found");

        await monthlyBudgetRepository.deleteMonthlyBudget(householdId, monthlyBudgetId);
    }
}


export const monthlyBudgetService = new MonthlyBudgetService();