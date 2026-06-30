import axiosInstance from "../Utils/AxiosInstance";
import { UserModel } from "../Models/UserModel";
import { CredentialsModel } from "../Models/CredentialsModel";
import { appConfig } from "../Utils/AppConfig";

class AuthService {

    public async register(user: UserModel): Promise<{ token: string; user: UserModel; inviteCode: string | null }> {
        const response = await axiosInstance.post(appConfig.registerUrl, user);
        const { token, inviteCode } = response.data;

        // Save token first so the next request is authenticated:
        localStorage.setItem("token", token);

        // Fetch full user profile:
        const userResponse = await axiosInstance.get(appConfig.usersIdUrl);
        const fullUser: UserModel = userResponse.data;

        return { token, user: fullUser, inviteCode };
    }

    public async login(credentials: CredentialsModel): Promise<{ token: string; user: UserModel; currency: string }> {
        const response = await axiosInstance.post(appConfig.loginUrl, credentials);
        const token = response.data;
        localStorage.setItem("token", token);

        const [userResponse, householdResponse] = await Promise.all([
            axiosInstance.get(appConfig.usersIdUrl),
            axiosInstance.get(appConfig.householdUrl)
        ]);

        return {
            token,
            user: userResponse.data,
            currency: householdResponse.data.currency || "$"
        };
    }

    public logout(): void {
        localStorage.removeItem("token");
    }
}

export const authService = new AuthService();