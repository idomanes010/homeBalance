export class UserModel {
	public id?: number;
    public email?: string;
    public passwordHash?: string;
    public firstName?: string;
    public lastName?: string;
    public householdId?: number;
    public inviteCode?: string | null;
}
