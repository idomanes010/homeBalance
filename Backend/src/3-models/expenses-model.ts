import Joi from "joi";
import { ValidationError } from "./client-errors";

export class ExpensesModel {
    public id: number;
    public householdId: number;
    public title: string;
    public amount: number;
    public categoryId: number;
    public expenseDate: Date;
    public note: string;
    public createdAt: Date;
    public createdBy: number;


    public constructor(expenses: ExpensesModel) {
        this.id = expenses.id;
        this.householdId = expenses.householdId;
        this.title = expenses.title;
        this.amount = expenses.amount;
        this.categoryId = expenses.categoryId;
        this.expenseDate = expenses.expenseDate;
        this.note = expenses.note;
        this.createdAt = expenses.createdAt;
        this.createdBy = expenses.createdBy;
    }

    // validation:
    private static schema = Joi.object({
        id: Joi.number().optional().positive().integer(),
        householdId: Joi.number().optional().positive().integer(),
        title: Joi.string().required().min(2).max(30),
        amount: Joi.number().positive().required(),
        categoryId: Joi.number().optional().positive().integer(),
        expenseDate: Joi.date().required(),
        note: Joi.string().optional().max(50).allow("").allow(null),
        createdAt: Joi.date().optional(),
        createdBy: Joi.number().optional().positive().integer()
    });

    public validate(): void {
        const result = ExpensesModel.schema.validate(this);
        if (result.error) {
            throw new ValidationError(result.error.message);
        }
    }
}