import { HouseholdModel } from "../Models/HouseholdModel";
import { appConfig } from "../Utils/AppConfig";
import axiosInstance from "../Utils/AxiosInstance";

class HouseholdService {
    public async getHousehold(): Promise<HouseholdModel> {
        const response = await axiosInstance.get(appConfig.householdUrl);
        return response.data;
    }

    public async updateCurrency(currency: string): Promise<void> {
        await axiosInstance.put(appConfig.householdCurrencyUrl, { currency });
    }
}

export const householdService = new HouseholdService();
