import { PoolClient } from "pg";
import { dal } from "../2-utils/dal";

class HouseholdRepository {

    public async createHousehold(client: PoolClient, houseName: string): Promise<{ id: number; inviteCode: string }> {
        const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const sql = `
            INSERT INTO households(house_name, invite_code)
            VALUES($1, $2)
            RETURNING id, invite_code
        `;
        const result = await client.query(sql, [houseName, inviteCode]);
        return {
            id: result.rows[0].id,
            inviteCode: result.rows[0].invite_code
        };
    }

    public async findByInviteCode(inviteCode: string): Promise<number | null> {
        const sql = `SELECT id FROM households WHERE invite_code = $1`;
        const result = await dal.execute(sql, [inviteCode]);
        if (!result.rows.length) return null;
        return result.rows[0].id;
    }

    public async getHouseholdWithMembers(householdId: number) {
        const sql = `
            SELECT 
                h.id AS household_id,
                h.house_name,
                h.invite_code,
                h.currency,
                u.id AS user_id,
                u.first_name,
                u.last_name,
                u.email
            FROM households h
            LEFT JOIN users u ON u.household_id = h.id
            WHERE h.id = $1
        `;
        const result = await dal.execute(sql, [householdId]);
        return result.rows;
    }

    public async updateCurrency(householdId: number, currency: string): Promise<void> {
    const sql = `UPDATE households SET currency = $1 WHERE id = $2`;
    await dal.execute(sql, [currency, householdId]);
}

    public async deleteIfEmpty(client: PoolClient, householdId: number): Promise<void> {
        const sql = `
            DELETE FROM households 
            WHERE id = $1
            AND NOT EXISTS (
                SELECT 1 FROM users WHERE household_id = $1
            )
        `;
        await client.query(sql, [householdId]);
    }
}

export const householdRepository = new HouseholdRepository();