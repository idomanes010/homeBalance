import { dal } from "../2-utils/dal";
import { NotFoundError, ValidationError } from "../3-models/client-errors";
import { ExpensesModel } from "../3-models/expenses-model";
import { expensesRepository } from "../7-repository/expense.repository";


class ExpenseService {

    public async createExpense(expense: ExpensesModel): Promise<ExpensesModel> {
        expense.validate();
        return await dal.transaction(async (client) => {
            const id = await expensesRepository.createExpense(client, expense);
            expense.id = id;
            return expense;
        });
    }

    public async getExpenseByHousehold(householdId: number): Promise<ExpensesModel[]> {
        return await expensesRepository.getExpenseByHousehold(householdId);
    }

    public async getExpenseByUser(householdId: number, userId: number): Promise<ExpensesModel[]> {
        return await expensesRepository.getExpenseByUser(householdId, userId);
    }

    public async getExpenseById(householdId: number, expenseId: number): Promise<ExpensesModel> {
        const expense = await expensesRepository.getExpenseById(householdId, expenseId);
        if (!expense) throw new NotFoundError("Expense not found");
        return expense
    }

    public async getFilteredExpense(householdId: number, categoryId?: number, from?: string, to?: string): Promise<ExpensesModel[]> {
        return await expensesRepository.getFilteredExpense(householdId, categoryId, from, to);
    }

    public async updateExpense(expense: ExpensesModel): Promise<void> {
        expense.validate();

        // check if there is an expenses
        const existing = await expensesRepository.getExpenseById(expense.householdId!, expense.id!);
        if (existing.createdBy !== expense.createdBy) throw new ValidationError("You can only edit your own expenses");

        await dal.transaction(async (client) => {
            await expensesRepository.updateExpense(client, expense);
        });
    }

    public async deleteExpense(householdId: number, expenseId: number): Promise<void> {

        // check if there is an expenses
        const exists = await expensesRepository.expenseExists(expenseId, householdId);
        if (!exists) throw new NotFoundError("Expense not found");
        await expensesRepository.deleteExpense(householdId, expenseId);
    }
}

export const expenseService = new ExpenseService();