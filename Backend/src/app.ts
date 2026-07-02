import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { dal } from "./2-utils/dal";
import { appConfig } from "./2-utils/app-config";
import { userController } from "./5-controllers/user-controller";
import { householdController } from "./5-controllers/household-controller";
import { expenseController } from "./5-controllers/expense-controller";
import { categoryController } from "./5-controllers/category-controller";
import { monthlyBudgetController } from "./5-controllers/monthly-budget-controller";
import { errorsMiddleware } from "./6-middleware/errors-middleware";

// General rate limit — 100 requests per 15 minutes per IP:
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: "Too many requests, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict rate limit for auth routes — 10 attempts per 15 minutes:
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: "Too many login attempts, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

class App {

    public async start(): Promise<void> {
        try {
            await dal.execute("SELECT NOW()");
            console.log("Database connected!!!!!");

            const server = express();

            // Security headers:
            server.use(helmet());

            // General rate limit on all routes:
            server.use(generalLimiter);

            // Stricter limit on auth routes:
            server.use("/api/users/login", authLimiter);
            server.use("/api/users/register", authLimiter);

            // Standard middleware:
            server.use(cors());
            server.use(express.json());

            // Routers:
            server.use(userController.router);
            server.use(householdController.router);
            server.use(expenseController.router);
            server.use(categoryController.router);
            server.use(monthlyBudgetController.router);

            // Error handling — always last:
            server.use(errorsMiddleware.routeNotFound);
            server.use(errorsMiddleware.catchAll);

            server.listen(appConfig.port, () =>
                console.log("Listening on http://localhost:" + appConfig.port)
            );
        }
        catch (err: any) {
            console.error(err);
        }
    }
}

const app = new App();
app.start();