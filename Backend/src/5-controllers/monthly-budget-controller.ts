import express, { Request, Response, NextFunction, Router } from "express";
import { authMiddleware } from "../6-middleware/auth-middleware";
import { MonthlyBudgetModel } from "../3-models/monthly-budget-model";
import { monthlyBudgetService } from "../4-services/monthly-budget-service";
import { StatusCode } from "../3-models/enums";

class MonthlyBudgetController {
    public router: Router = express.Router();

    public constructor() {
        this.router.post("/api/monthlyBudget", authMiddleware.authenticate, this.setMonthlyBudget);
        this.router.get("/api/monthlyBudget/:budgetMonth", authMiddleware.authenticate, this.getMonthlyBudget);
        this.router.get("/api/monthlyBudget", authMiddleware.authenticate, this.getAllMonthlyBudgets);
        this.router.delete("/api/monthlyBudget/:monthlyBudgetId", authMiddleware.authenticate, this.deleteMonthlyBudget);
    }

    private setMonthlyBudget = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const householdId = request.user!.householdId;
            const monthlyBudget = new MonthlyBudgetModel(request.body);
            monthlyBudget.householdId = householdId;
            const dbMonthlyBudget = await monthlyBudgetService.setMonthlyBudget(monthlyBudget);
            response.status(StatusCode.Created).json(dbMonthlyBudget)
        }
        catch (err: any) { next(err) }
    }

    private getMonthlyBudget = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const householdId = request.user!.householdId;
            const budgetMonth = request.params.budgetMonth;
            const dbMonthlyBudget = await monthlyBudgetService.getMonthlyBudget(householdId, budgetMonth);
            response.status(StatusCode.OK).json(dbMonthlyBudget)
        }
        catch (err: any) { next(err) }
    }

    private getAllMonthlyBudgets = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const householdId = request.user!.householdId;
            const dbMonthlyBudget = await monthlyBudgetService.getAllMonthlyBudgets(householdId);
            response.status(StatusCode.OK).json(dbMonthlyBudget)
        }
        catch (err: any) { next(err) }
    }

    private deleteMonthlyBudget = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const householdId = request.user!.householdId;
            const monthlyBudgetId = +request.params.monthlyBudgetId;
            const dbMonthlyBudget = await monthlyBudgetService.deleteMonthlyBudget(householdId, monthlyBudgetId);
            response.status(StatusCode.NoContent).send()
        }
        catch (err: any) { next(err) }
    }

}

export const monthlyBudgetController = new MonthlyBudgetController();