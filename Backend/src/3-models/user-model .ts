import Joi from "joi";
import { ValidationError } from "./client-errors";

export class UserModel {
    public id: number;
    public email: string;
    public passwordHash: string;
    public firstName: string;
    public lastName: string;
    public householdId: number;
    public inviteCode: string;

    public constructor(user: UserModel) {
        this.id = user.id;
        this.email = user.email;
        this.passwordHash = user.passwordHash;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.householdId = user.householdId;
        this.inviteCode = user.inviteCode;
    }

    // validation:
    private static schema = Joi.object({
        id: Joi.number().optional().positive().integer(),
        email: Joi.string().email().required(),
        passwordHash: Joi.string().required().min(2).max(30),
        firstName: Joi.string().required().min(2).max(30),
        lastName: Joi.string().required().min(2).max(30),
        householdId: Joi.number().optional().positive().integer(),
        inviteCode: Joi.string().optional().length(6).allow("").allow(null)
    });

    public validate(): void {
        const result = UserModel.schema.validate(this);
        if (result.error) {
            throw new ValidationError(result.error.message);
        }
    }
}