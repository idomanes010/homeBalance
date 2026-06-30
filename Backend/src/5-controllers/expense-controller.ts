import express, { Request, Response, NextFunction, Router } from "express";
import { expenseService } from "../4-services/expense-service";
import { ExpensesModel } from "../3-models/expenses-model";
import { authMiddleware } from "../6-middleware/auth-middleware";
import { StatusCode } from "../3-models/enums";

class ExpenseController {
    public router: Router = express.Router();

    public constructor() {
        this.router.post("/api/expenses", authMiddleware.authenticate, this.createExpense);
        this.router.get("/api/expenses", authMiddleware.authenticate, this.getExpenseByHousehold);
        this.router.get("/api/expenses/filter", authMiddleware.authenticate, this.getFilteredExpense);
        this.router.get("/api/expenses/user/:userId", authMiddleware.authenticate, this.getExpenseByUser);
        this.router.get("/api/expenses/:expenseId", authMiddleware.authenticate, this.getExpenseById);
        this.router.put("/api/expenses/:id", authMiddleware.authenticate, this.updateExpense);
        this.router.delete("/api/expenses/:id", authMiddleware.authenticate, this.deleteExpense);
    }

    private createExpense = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const householdId = request.user!.householdId;
            const userId = request.user!.userId
            const expense = new ExpensesModel(request.body);
            expense.householdId = householdId;
            expense.createdBy = userId;
            const created = await expenseService.createExpense(expense);
            response.status(StatusCode.Created).json(created);
        }
        catch (err: any) { next(err); }
    };

    private getExpenseByHousehold = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const householdId = request.user!.householdId;
            const expenses = await expenseService.getExpenseByHousehold(householdId);
            response.status(StatusCode.OK).json(expenses);
        }
        catch (err: any) { next(err); }
    };

    private getExpenseByUser = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const householdId = request.user!.householdId;
            const userId = +request.params.userId;
            const expenses = await expenseService.getExpenseByUser(householdId, userId);
            response.status(StatusCode.OK).json(expenses);
        }
        catch (err: any) { next(err); }
    };

    private getExpenseById = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const householdId = request.user!.householdId;
            const expenseId = +request.params.expenseId;
            const expense = await expenseService.getExpenseById(householdId, expenseId);
            response.status(StatusCode.OK).json(expense);
        }
        catch (err: any) { next(err); }
    };

    private getFilteredExpense = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const householdId = request.user!.householdId;
            const categoryId = request.query.categoryId ? +request.query.categoryId : undefined;
            const from = request.query.from as string | undefined;
            const to = request.query.to as string | undefined;
            const expenses = await expenseService.getFilteredExpense(householdId, categoryId, from, to);
            response.status(StatusCode.OK).json(expenses);
        }
        catch (err: any) { next(err); }
    };

    private updateExpense = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const householdId = request.user!.householdId;
            const userId = request.user!.userId;
            const expense = new ExpensesModel(request.body);
            expense.id = +request.params.id;
            expense.householdId = householdId;
            expense.createdBy = userId;
            await expenseService.updateExpense(expense);
            response.status(StatusCode.OK).json(expense);
        }
        catch (err: any) { next(err); }
    };

    private deleteExpense = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const householdId = request.user!.householdId;
            const expenseId = +request.params.id;
            await expenseService.deleteExpense(householdId, expenseId);
            response.status(StatusCode.NoContent).send();
        }
        catch (err: any) { next(err); }
    };
}

export const expenseController = new ExpenseController();