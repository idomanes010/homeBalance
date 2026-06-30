import { UserModel } from "./UserModel";

export class HouseholdModel {
    public householdId?: number;
    public houseName?: string;
    public inviteCode?: string;
    public currency?: string;
    public members?: UserModel[];
}