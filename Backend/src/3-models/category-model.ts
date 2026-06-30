import Joi from "joi";
import { ValidationError } from "./client-errors";

export class CategoryModel {
    public id: number;
    public categoryName: string;

    public constructor(category: CategoryModel) {
        this.id = category.id;
        this.categoryName = category.categoryName;
    }

    // validation:
    private static schema = Joi.object({
        id: Joi.number().optional().integer().positive(),
        categoryName: Joi.string().required().min(2).max(50)
    });

    public validate(): void {
        const result = CategoryModel.schema.validate(this);
        if (result.error) {
            throw new ValidationError(result.error.message);
        }
    }
}
