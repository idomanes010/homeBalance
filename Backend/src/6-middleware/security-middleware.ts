import { NextFunction, Request, Response } from "express";
import { cyber } from "../2-utils/cyber";
import striptags from "striptags";
import { UnauthorizedError } from "../3-models/client-errors";
import jwt from "jsonwebtoken";

class SecurityMiddleware {

    // VERIFY TOKEN
    public verifyToken = (req: Request, res: Response, next: NextFunction): void => {
        const token = cyber.extractToken(req);
        if (!token) return next(new UnauthorizedError("you are not logged in"));
        try {
            const payload = cyber.verifyToken(token);
            req.user = payload as { userId: number; householdId: number };
            next();
        }
        catch (err: any) {
            if (err instanceof jwt.TokenExpiredError) {
                return next(new UnauthorizedError("token expired"));
            }
            next(new UnauthorizedError("invalid token"));
        }
    };

    // VERIFY ME (same user)
    public verifyMe = (request: Request, response: Response, next: NextFunction): void => {
        const user = (request as any).user;
        const routeId = +request.params.id;
        if (!user || user.id !== routeId) {
            return next(new UnauthorizedError("you are not authorized"));
        }
        next();
    };

    // PREVENT XSS
    public preventXss(request: Request, response: Response, next: NextFunction): void {
        for (const prop in request.body) {
            const value = request.body[prop];
            if (typeof value === "string") {
                request.body[prop] = striptags(value);
            }
        }
        next();
    }
}

export const securityMiddleware = new SecurityMiddleware();