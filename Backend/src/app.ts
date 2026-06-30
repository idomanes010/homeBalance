import cors from "cors";
import express from "express";
import { appConfig } from "./2-utils/app-config";
import { errorsMiddleware } from "./6-middleware/errors-middleware";
import { dal } from "./2-utils/dal";
import { userController } from "./5-controllers/user-controller";
import { householdController } from "./5-controllers/household-controller";
import { expenseController } from "./5-controllers/expense-controller";
import { categoryController } from "./5-controllers/category-controller";
import { monthlyBudgetController } from "./5-controllers/monthly-budget-controller";

class App {

    public async start(): Promise<void> {
        try {

            // for checking if postgres is working:
            await dal.execute("SELECT NOW()");
            console.log("Database connected!!!!!");

            const server = express();
            server.use(cors());
            server.use(express.json());
            server.use(userController.router);
            server.use(householdController.router);
            server.use(expenseController.router);
            server.use(categoryController.router);
            server.use(monthlyBudgetController.router);
            server.use(errorsMiddleware.routeNotFound);
            server.use(errorsMiddleware.catchAll);
            server.listen(appConfig.port, () => console.log("Listening on http://localhost:" + appConfig.port));
        }
        catch (err: any) {
            console.error(err);
        }
    }
}

const app = new App();
app.start();
