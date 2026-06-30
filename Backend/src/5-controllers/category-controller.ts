import express, { NextFunction, Request, Response, Router } from "express";
import { categoryService } from "../4-services/category-service";
import { StatusCode } from "../3-models/enums";

class CategoryController {
    public router: Router = express.Router();

    public constructor() {
        this.router.get("/api/categories", this.getAllCategories);
    }

    private getAllCategories = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const category = await categoryService.getAllCategories();
            response.status(StatusCode.OK).json(category);
        } catch (err: any) { next(err); }
    }
}

export const categoryController = new CategoryController();