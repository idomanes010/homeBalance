import Joi from "joi";
import { ValidationError } from "./client-errors";

export class HouseholdModel {
    public id: number;
    public householdName: string;
    public currency: string;
    // public createdAt: Date;


    public constructor(household: HouseholdModel) {
        this.id = household.id;
        this.householdName = household.householdName;
        this.currency = household.currency;
    }

    // validation:
    private static schema = Joi.object({
        id: Joi.number().optional().positive().integer(),
        householdName: Joi.string().optional().min(2).max(50)
    });

    public validate(): void {
        const result = HouseholdModel.schema.validate(this);
        if (result.error) {
            throw new ValidationError(result.error.message);
        }
    }
}