import { CategoryModel } from "../3-models/category-model";
import { dal } from "../2-utils/dal";

class CategoryRepository {

    public async getAllCategories(): Promise<CategoryModel[]> {
        const sql = `SELECT id, category_name AS "categoryName" FROM categories ORDER BY id`;
        const result = await dal.execute(sql, []);
        return result.rows;
    }
}

export const categoryRepository = new CategoryRepository();

