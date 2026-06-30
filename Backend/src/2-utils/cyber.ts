import jwt, { SignOptions } from "jsonwebtoken";
import { appConfig } from "./app-config";
import crypto from "crypto";
import { Request } from "express";
import { UserModel } from "../3-models/user-model ";

class Cyber {

    public hash(plainText: string): string {
        const hashText = crypto
            .createHmac("sha512", appConfig.hashSalt)
            .update(plainText)
            .digest("hex");
        return hashText;
    }

    public generateToken(user: UserModel): string {
        const payload = { userId: user.id };
        return jwt.sign(payload, appConfig.jwtSecret as string, { expiresIn: "3h" });
    }

    // extract token
    public extractToken(request: Request): string | null {
        const auth = request.headers.authorization;
        if (!auth?.startsWith("Bearer ")) return null;
        return auth.split(" ")[1];
    }

    // verify token (THROWS if invalid)
    public verifyToken(token: string): { userId: number } {
        return jwt.verify(token, appConfig.jwtSecret as string) as { userId: number };
    }

    // get user id
    public getUserId(token: string): number {
        const payload = jwt.verify(token, appConfig.jwtSecret as string) as { userId: number };
        return payload.userId;
    }
}


export const cyber = new Cyber();





// public generateToken(user: UserModel): string {
//     delete (user as any).password;
//     const payload = {userId: user.id};
//     const options: SignOptions = { expiresIn: "3h" };
//     const token = jwt.sign(payload, appConfig.jwtSecret as string, options);
//     return token;
// }


// // get full user from token (SAFE)
// public getUserFromToken(token: string): UserModel {
//     const payload = jwt.verify(token, appConfig.jwtSecret as string) as { user: UserModel };
//     return payload.user;
// }