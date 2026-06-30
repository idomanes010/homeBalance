import { CategoryModel } from "../3-models/category-model";
import { categoryRepository } from "../7-repository/category.repository";

class CategoryService {

    public async getAllCategories(): Promise<CategoryModel[]> {
        return await categoryRepository.getAllCategories();
    }
}

export const categoryService = new CategoryService();