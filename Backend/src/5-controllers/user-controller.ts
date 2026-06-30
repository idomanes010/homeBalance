import express, { NextFunction, Request, Response, Router } from "express";
import { UserModel } from "../3-models/user-model ";
import { securityMiddleware } from "../6-middleware/security-middleware";
import { StatusCode } from "../3-models/enums";
import { CredentialsModel } from "../3-models/credentials-mode";
import { userService } from "../4-services/user-service";
import { authMiddleware } from "../6-middleware/auth-middleware";

class UserController {
    public router: Router = express.Router();

    public constructor() {
        this.router.post("/api/users/register", securityMiddleware.preventXss, this.register);
        this.router.post("/api/users/login", securityMiddleware.preventXss, this.login);
        this.router.get("/api/users/me", authMiddleware.authenticate, this.getUserById);
    }

    private register = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const user = new UserModel(request.body);
            const token = await userService.register(user);
            response.status(StatusCode.Created).json(token);
        }
        catch (err: any) {
            next(err);
        }
    };

    private login = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const credentials = new CredentialsModel(request.body);
            const token = await userService.login(credentials);
            response.status(StatusCode.OK).json(token);
        }
        catch (err: any) {
            next(err);
        }
    };

    private getUserById = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const userId = request.user!.userId;
            const user = await userService.getUserById(userId);
            response.status(StatusCode.OK).json(user);
        }
        catch (err: any) { next(err); }
    };
}

export const userController = new UserController();

















































// import express, { NextFunction, Request, Response, Router } from "express";
// import { userService } from "../4-services/user-service";
// import { securityMiddleware } from "../6-middleware/security-middleware";
// import { UserModel } from "../3-models/user-model ";
// import { StatusCode } from "../3-models/enums ";
// import { CredentialsModel } from "../3-models/credentials-mode";

// class UserController {

//     // Create router - a part of express only for registering routes:
//     public router: Router = express.Router();

//     // Register routes:
//     public constructor() {
//         this.router.post("/api/register", this.register);
//         this.router.post("/api/login", this.login);
//         this.router.get("/api/users/:id", securityMiddleware.verifyToken, securityMiddleware.verifyMe, this.getOneUser);
//         this.router.get("/api/users", securityMiddleware.verifyToken, securityMiddleware.verifyAdmin, this.getAllUsers);
//     }

//     // Register new user:
//     private async register(request: Request, response: Response) {
//         const user = new UserModel(request.body);
//         const token = await userService.register(user);
//         response.status(StatusCode.Created).json(token);
//     }

//     // Login existing new user:
//     private async login(request: Request, response: Response) {
//         const credentials = new CredentialsModel(request.body);
//         const token = await userService.login(credentials);
//         response.json(token);
//     }

//     // Get one user:
//     private async getOneUser(request: Request, response: Response) {
//         const id = +request.params.id;
//         const user = await userService.getOneUser(id);
//         response.json(user);
//     }

//     // GET ALL USERS (admin only)
//     private async getAllUsers(request: Request, response: Response, next: NextFunction) {
//         try {
//             const users = await userService.getAllUsers();
//             response.json(users);
//         }
//         catch (err) {
//             next(err);
//         }
//     }
// }

// export const userController = new UserController();

