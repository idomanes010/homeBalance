import { PoolClient } from "pg";
import { dal } from "../2-utils/dal";
import { UserModel } from "../3-models/user-model ";

class UserRepository {

    public async checkEmail(email: string): Promise<boolean> {
        const sql = `SELECT id FROM users WHERE email = $1`;
        const result = await dal.execute(sql, [email]);
        return result.rows.length > 0;
    }

    public async createUser(client: PoolClient, user: UserModel): Promise<number> {
        const sql = `
            INSERT INTO users(first_name, last_name, email, password_hash, household_id)
            VALUES($1, $2, $3, $4, $5)
            RETURNING id
        `;
        const values = [
            user.firstName,
            user.lastName,
            user.email,
            user.passwordHash,
            user.householdId
        ];
        const result = await client.query(sql, values);
        return result.rows[0].id;
    }

    public async updateHousehold(client: PoolClient, userId: number, householdId: number): Promise<void> {
        const sql = `UPDATE users SET household_id = $1 WHERE id = $2`;
        await client.query(sql, [householdId, userId]);
    }

    public async getUserById(userId: number): Promise<UserModel> {
    const sql = `
        SELECT 
            id,
            first_name AS "firstName",
            last_name AS "lastName",
            email,
            household_id AS "householdId"
        FROM users
        WHERE id = $1
    `;
    const result = await dal.execute(sql, [userId]);
    return result.rows[0];
}
}

export const userRepository = new UserRepository();