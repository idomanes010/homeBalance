export class ExpensesModel {
	public id?: number;
    public householdId?: number;
    public title?: string;
    public amount?: number;
    public categoryName?: string;
    public categoryId?: number;
    public expenseDate?: Date;
    public note?: string;
    public createdAt?: Date;
    public createdBy?: number;
    public createdByName?: string;
}
