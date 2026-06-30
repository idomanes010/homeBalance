import { CategoryModel } from "../Models/CategoryModel";
import { appConfig } from "../Utils/AppConfig";
import axiosInstance from "../Utils/AxiosInstance";

class CategoryService {
	public async getAllCategories(): Promise<CategoryModel[]> {
        const response = await axiosInstance.get(appConfig.categoriesUrl);
        return response.data;
    }
}

export const categoryService = new CategoryService();
