import { PoolClient } from "pg";
import { dal } from "../2-utils/dal";
import { ExpensesModel } from "../3-models/expenses-model";

class ExpensesRepository {

    public async createExpense(client: PoolClient, expense: ExpensesModel): Promise<number> {
        const sql = `
            INSERT INTO expenses(household_id, title, amount, category_id, expense_date, note, created_by)
            VALUES($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `;
        const values = [
            expense.householdId,
            expense.title,
            expense.amount,
            expense.categoryId,
            expense.expenseDate,
            expense.note,
            expense.createdBy
        ];
        const result = await client.query(sql, values);
        return result.rows[0].id;
    }

    public async getExpenseByHousehold(householdId: number): Promise<ExpensesModel[]> {
        const sql = `
            SELECT 
                e.id,
                e.household_id AS "householdId",
                e.title,
                e.amount,
                e.category_id AS "categoryId",
                c.category_name AS "categoryName",
                e.expense_date AS "expenseDate",
                e.note,
                e.created_at AS "createdAt",
                e.created_by AS "createdBy",
                u.first_name AS "createdByName"
            FROM expenses e
            LEFT JOIN categories c ON c.id = e.category_id
            LEFT JOIN users u ON u.id = e.created_by
            WHERE e.household_id = $1
            ORDER BY e.expense_date DESC
        `;
        const result = await dal.execute(sql, [householdId]);
        return result.rows;
    }

    public async getExpenseByUser(householdId: number, userId: number): Promise<ExpensesModel[]> {
        const sql = `
            SELECT
                e.id,
                e.household_id AS "householdId",
                e.title,
                e.amount,
                e.category_id AS "categoryId",
                c.category_name AS "categoryName",
                e.expense_date AS "expenseDate",
                e.note,
                e.created_at AS "createdAt",               
                e.created_by AS "createdBy",
                u.first_name AS "createdByName"
            FROM expenses e
            LEFT JOIN categories c ON c.id = e.category_id
            LEFT JOIN users u ON u.id = e.created_by
            WHERE e.household_id = $1
            ORDER BY e.expense_date DESC
        `;
        const result = await dal.execute(sql, [householdId, userId]);
        return result.rows;
    }

    public async getExpenseById(householdId: number, expenseId: number): Promise<ExpensesModel> {
    const sql = `
        SELECT
            e.id,
            e.household_id AS "householdId",
            e.title,
            e.amount,
            e.category_id AS "categoryId",
            c.category_name AS "categoryName",
            e.expense_date AS "expenseDate",
            e.note,
            e.created_at AS "createdAt",
            e.created_by AS "createdBy",
            u.first_name AS "createdByName"
        FROM expenses e
        LEFT JOIN categories c ON c.id = e.category_id
        LEFT JOIN users u ON u.id = e.created_by
        WHERE e.household_id = $1
        AND e.id = $2
    `;
    const result = await dal.execute(sql, [householdId, expenseId]);
    return result.rows[0];
}

    public async getFilteredExpense(householdId: number, categoryId?: number, from?: string, to?: string): Promise<ExpensesModel[]> {
    let sql = `
        SELECT
            e.id,
            e.household_id AS "householdId",
            e.title,
            e.amount,
            e.category_id AS "categoryId",
            c.category_name AS "categoryName",
            e.expense_date AS "expenseDate",
            e.note,
            e.created_at AS "createdAt",
            e.created_by AS "createdBy",
            u.first_name AS "createdByName"
        FROM expenses e
        LEFT JOIN categories c ON c.id = e.category_id
        LEFT JOIN users u ON u.id = e.created_by
        WHERE e.household_id = $1
    `;
    const values: (string | number)[] = [householdId];
    let paramIndex = 2;

    if (categoryId) {
        sql += ` AND e.category_id = $${paramIndex}`;
        values.push(categoryId);
        paramIndex++;
    }
    if (from) {
        sql += ` AND e.expense_date >= $${paramIndex}`;
        values.push(from);
        paramIndex++;
    }
    if (to) {
        sql += ` AND e.expense_date <= $${paramIndex}`;
        values.push(to);
        paramIndex++;
    }

    sql += ` ORDER BY e.expense_date DESC`;
    const result = await dal.execute(sql, values);
    return result.rows;
}

    public async updateExpense(client: PoolClient, expense: ExpensesModel): Promise<void> {
        const sql = `
            UPDATE expenses
            SET title = $1,
                amount = $2,
                category_id = $3,
                expense_date = $4,
                note = $5
            WHERE id = $6
            AND household_id = $7
        `;
        const values = [
            expense.title,
            expense.amount,
            expense.categoryId,
            expense.expenseDate,
            expense.note,
            expense.id,
            expense.householdId
        ];
        await client.query(sql, values);
    }

    public async deleteExpense(householdId: number, expenseId: number): Promise<void> {
        const sql = `
            DELETE FROM expenses
            WHERE id = $1
            AND household_id = $2
        `;
        await dal.execute(sql, [expenseId, householdId]);
    }

    public async expenseExists(expenseId: number, householdId: number): Promise<boolean> {
        const sql = `SELECT id FROM expenses WHERE id = $1 AND household_id = $2`;
        const result = await dal.execute(sql, [expenseId, householdId]);
        return result.rows.length > 0;
    }
}

export const expensesRepository = new ExpensesRepository();