import { MonthlyBudgetModel } from "../3-models/monthly-budget-model";
import { dal } from "../2-utils/dal";

class MonthlyBudgetRepository {

    public async setMonthlyBudget(monthlyBudget: MonthlyBudgetModel): Promise<MonthlyBudgetModel> {
        const sql = `
        INSERT INTO monthly_budget(household_id, budget_month, budget_amount)
        VALUES($1, $2, $3)
        ON CONFLICT (household_id, budget_month)
        DO UPDATE SET budget_amount = $3
        RETURNING id, 
          household_id AS "householdId", 
          budget_month AS "budgetMonth", 
          budget_amount::float AS "budgetAmount"
        `;
        const values = [
            monthlyBudget.householdId,
            monthlyBudget.budgetMonth,
            monthlyBudget.budgetAmount
        ];
        const result = await dal.execute(sql, values);
        return result.rows[0]
    }

    public async getMonthlyBudget(householdId: number, budgetMonth: string): Promise<MonthlyBudgetModel> {
        const sql = `
        SELECT
            b.id,
            b.household_id AS "householdId",
            b.budget_month AS "budgetMonth",
            b.budget_amount AS "budgetAmount"
        FROM monthly_budget b
        WHERE b.household_id = $1
        AND b.budget_month = $2
        `;
        const result = await dal.execute(sql, [householdId, budgetMonth]);
        return result.rows[0]
    }

    public async getAllMonthlyBudgets(householdId: number): Promise<MonthlyBudgetModel[]> {
        const sql = `
        SELECT
            b.id,
            b.household_id AS "householdId",
            b.budget_month AS "budgetMonth",
            b.budget_amount AS "budgetAmount"
        FROM monthly_budget b
        WHERE b.household_id = $1
        ORDER BY b.budget_month
        `;
        const result = await dal.execute(sql, [householdId]);
        return result.rows
    }

    public async deleteMonthlyBudget(householdId: number, monthlyBudgetId: number): Promise<void> {
        const sql = `
            DELETE FROM monthly_budget
            WHERE id = $1
            AND household_id = $2
        `;
        await dal.execute(sql, [monthlyBudgetId, householdId]);
    }

    public async exists(monthlyBudgetId: number, householdId: number): Promise<boolean> {
        const sql = `SELECT id FROM monthly_budget WHERE id = $1 AND household_id = $2`;
        const result = await dal.execute(sql, [monthlyBudgetId, householdId]);
        return result.rows.length > 0;
    }
}

export const monthlyBudgetRepository = new MonthlyBudgetRepository();