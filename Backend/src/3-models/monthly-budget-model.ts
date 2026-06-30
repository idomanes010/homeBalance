import Joi from "joi";
import { ValidationError } from "./client-errors";

export class MonthlyBudgetModel {
    public id: number;
    public householdId: number;
    public budgetMonth: string;
    public budgetAmount: number;


    public constructor(monthlyBudget: MonthlyBudgetModel) {
        this.id = monthlyBudget.id;
        this.householdId = monthlyBudget.householdId;
        this.budgetMonth = monthlyBudget.budgetMonth;
        this.budgetAmount = monthlyBudget.budgetAmount;
    }

    // validation:
    private static schema = Joi.object({
        id: Joi.number().optional().positive().integer(),
        householdId: Joi.number().optional().positive().integer(),
        budgetMonth: Joi.string().pattern(/^\d{4}-\d{2}$/).required(),
        budgetAmount: Joi.number().required().positive(),
    });

    public validate(): void {
        const result = MonthlyBudgetModel.schema.validate(this);
        if (result.error) {
            throw new ValidationError(result.error.message);
        }
    }
}