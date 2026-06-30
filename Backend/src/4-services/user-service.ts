import { cyber } from "../2-utils/cyber";
import { dal } from "../2-utils/dal";
import { NotFoundError, ValidationError } from "../3-models/client-errors";
import { CredentialsModel } from "../3-models/credentials-mode";
import { UserModel } from "../3-models/user-model ";
import { householdRepository } from "../7-repository/household.repository";
import { userRepository } from "../7-repository/user.repository";

class UserService {

    private async verifyEmail(email: string): Promise<void> {
        const exists = await userRepository.checkEmail(email);
        if (exists) throw new ValidationError("Email already in use");
    }

    // Change return type
    public async register(user: UserModel): Promise<{ token: string; inviteCode: string | null }> {
        user.validate();
        await this.verifyEmail(user.email);
        user.passwordHash = cyber.hash(user.passwordHash);
        return await dal.transaction(async (client) => {

            if (user.inviteCode) {
                // JOIN FLOW:
                const householdId = await householdRepository.findByInviteCode(user.inviteCode);
                if (!householdId) throw new ValidationError("Invalid invite code");

                user.householdId = householdId;
                user.id = await userRepository.createUser(client, user);
                return { token: cyber.generateToken(user), inviteCode: null };
            }
            else {
                // CREATE FLOW:
                const { id: householdId, inviteCode } = await householdRepository.createHousehold(
                    client,
                    `${user.firstName}'s household`
                );

                user.householdId = householdId;
                user.id = await userRepository.createUser(client, user);
                return { token: cyber.generateToken(user), inviteCode };
            }
        });
    }

    public async login(credentials: CredentialsModel): Promise<string> {

        // Validation:
        credentials.validate();

        // Hash password:
        credentials.password = cyber.hash(credentials.password);

        // Find user:
        const sql = `
            SELECT * FROM users 
            WHERE email = $1 
            AND password_hash = $2
        `;
        const result = await dal.execute(sql, [credentials.email, credentials.password]);
        const user = result.rows[0] as UserModel;
        if (!user) throw new ValidationError("Incorrect email or password");

        // Generate and return token:
        return cyber.generateToken(user);
    }

    public async getUserById(userId: number): Promise<UserModel> {
    const user = await userRepository.getUserById(userId);
    if (!user) throw new NotFoundError("User not found");
    return user;
}
}

export const userService = new UserService();










































// import { OkPacketParams } from "mysql2";
// import { dal } from "../2-utils/dal";
// import { cyber } from "../2-utils/cyber";
// import { appConfig } from "../2-utils/app-config";
// import axios from "axios";
// import { ResourceNotFoundError, UnauthorizedError, ValidationError } from "../3-models/client-errors";
// import { UserModel } from "../3-models/user-model ";
// import { Role } from "../3-models/enums ";
// import { CredentialsModel } from "../3-models/credentials-mode";

// class UserService {

//     // private async verifyCaptchaToken(captchaToken: string): Promise<void> {

//     //     // Create parameters to send to google:
//     //     const params = new URLSearchParams();
//     //     params.append("secret", appConfig.recaptchaSecretKey); // Secret key.
//     //     params.append("response", captchaToken); // The frontend captcha token (response from google)

//     //     // Ask google if user is a human or a bot:
//     //     const response = await axios.post(appConfig.recaptchaUrl, params);

//     //     // Get success:
//     //     const success = response.data.success; // true --> user is a human.

//     //     // If not a human:
//     //     if (!success) throw new ValidationError("You failed the ReCAPTCHA test.");
//     // }

//     private async verifyFreeEmail(email: string): Promise<void> {
//         const sql = "select * from users where email = ?";
//         const values = [email];
//         const users = await dal.execute(sql, values) as UserModel[];
//         if (users.length > 0) throw new ValidationError(`Email ${email} already taken.`);
//     }

//     public async register(user: UserModel): Promise<string> {

//         // Validation:
//         user.validate();
//         // this.verifyCaptchaToken(user.captchaToken);
//         // await this.verifyFreeEmail(user.email);

//         // Create sql:
//         user.password = cyber.hash(user.password);
//         user.roleId = Role.User;
//         const sql = "insert into users(firstName, lastName, email, password, roleId) values(?, ?, ?, ?, ?)";
//         const values = [user.firstName, user.lastName, user.email, user.password, user.roleId];

//         // Execute:
//         const info: OkPacketParams = await dal.execute(sql, values) as OkPacketParams;
//         user.id = info.insertId!;

//         // Generate token:
//         const token = cyber.generateToken(user);
//         return token;
//     }

//     // Login:
//     public async login(credentials: CredentialsModel): Promise<string> {

//         // Validate:
//         credentials.validate();

//         // Create sql:
//         credentials.password = cyber.hash(credentials.password);
//         const sql = "select * from users where email = ? and password = ?"; // Prepared Statement
//         const values = [credentials.email, credentials.password];

//         // Execute:
//         const users = await dal.execute(sql, values) as UserModel[];

//         // Extract user:
//         const user = users[0];

//         // If no such user:
//         if (!user) throw new UnauthorizedError("Incorrect email or password.");

//         // Generate token:
//         const token = cyber.generateToken(user);

//         // Return token:
//         return token;
//     }

//     public async getOneUser(id: number): Promise<UserModel> {

//         // Create sql:
//         const sql = "select * from users where id = ?";
//         const values = [id];

//         // Execute:
//         const users = await dal.execute(sql, values) as UserModel[];

//         // Extract user:
//         const user = users[0];

//         // If no such user:
//         if (!user) throw new ResourceNotFoundError(id);

//         // Remove password:
//         delete (user as any).password;

//         // Return user:
//         return user;
//     }

//     // get all users (admin use)
//     public async getAllUsers(): Promise<UserModel[]> {
//         const sql = "SELECT * FROM users";
//         const users = await dal.execute(sql) as UserModel[];

//         // remove passwords
//         users.forEach(u => delete (u as any).password);
//         return users;
//     }
// }

// export const userService = new UserService();

