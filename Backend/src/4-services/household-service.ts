import { NotFoundError } from "../3-models/client-errors";
import { householdRepository } from "../7-repository/household.repository";

class HouseholdService {

    public async getHousehold(householdId: number) {
        const rows = await householdRepository.getHouseholdWithMembers(householdId);
        if (!rows.length) throw new NotFoundError("Household not found");
        // Shape the response:
        return {
            householdId: rows[0].household_id,
            houseName: rows[0].house_name,
            inviteCode: rows[0].invite_code,
            currency: rows[0].currency,
            members: rows.map(row => ({
                userId: row.user_id,
                firstName: row.first_name,
                lastName: row.last_name,
                email: row.email
            }))
        };
    }

    public async updateCurrency(householdId: number, currency: string): Promise<void> {
    await householdRepository.updateCurrency(householdId, currency);
}
}

export const householdService = new HouseholdService();