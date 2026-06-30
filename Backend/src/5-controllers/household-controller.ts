import express, { Request, Response, NextFunction, Router } from "express";
import { StatusCode } from "../3-models/enums";
import { householdService } from "../4-services/household-service";
import { authMiddleware } from "../6-middleware/auth-middleware";


class HouseholdController {
    public router: Router = express.Router();

    public constructor() {
        this.router.get("/api/households/me", authMiddleware.authenticate, this.getHousehold);
        this.router.put("/api/households/currency", authMiddleware.authenticate, this.updateCurrency);
    }

    private getHousehold = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const householdId = (request as any).user.householdId;
            const household = await householdService.getHousehold(householdId);
            response.status(StatusCode.OK).json(household);
        }
        catch (err: any) {
            next(err);
        }
    };

    private updateCurrency = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const householdId = request.user!.householdId;
        const { currency } = request.body;
        await householdService.updateCurrency(householdId, currency);
        response.status(StatusCode.OK).json({ currency });
    }
    catch (err: any) { next(err); }
};
}

export const householdController = new HouseholdController();