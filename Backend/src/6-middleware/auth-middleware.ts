import { NextFunction, Request, Response } from "express";
import { cyber } from "../2-utils/cyber";
import { UnauthorizedError } from "../3-models/client-errors";
import { dal } from "../2-utils/dal";

class AuthMiddleware {

    public authenticate = async (req: Request, res: Response, next: NextFunction) => {
        const token = cyber.extractToken(req);

        if (!token) return next(new UnauthorizedError("missing token"));
        try {
            const payload = cyber.verifyToken(token);

            // fetch full user context from DB
            const result = await dal.execute(
                `select id, email, household_id
                 from users
                 where id = $1`,
                [payload.userId]
            );

            if (!result.rows.length) return next(new UnauthorizedError("user not found"));
            req.user = {
                userId: result.rows[0].id,
                householdId: result.rows[0].household_id
            } as any;
            next();
        } 
        catch (err) {
            return next(new UnauthorizedError("invalid token"));
        }
    };
}

export const authMiddleware = new AuthMiddleware();