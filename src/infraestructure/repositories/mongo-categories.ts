import { ICategoriesRepository } from "../../domain/repositories/ICategories-repository";
import { Categories } from "../../domain/entities/Categories";
import { CategoriesModel } from "../database/categories-mongo";
import { ICategories } from "../../domain/models/interfaces/ICategories";
import { Product } from "../../domain/entities/Product";
import { ProductModel } from "../database/Product-mongo";

export class MongoCategoriesRepository implements ICategoriesRepository {
    async save(category: Categories): Promise<Categories> {
        const created = await CategoriesModel.create(category);
        const plainCategory = created.toObject();
        if (plainCategory._id && typeof plainCategory._id !== 'string') {
            plainCategory._id = plainCategory._id.toString();
        }
        return new Categories({
            id: plainCategory._id ? plainCategory._id.toString() : '',
            name: plainCategory.name
        });
    }   
    async findAll(): Promise<Categories[]> {
        const categories = await CategoriesModel.find().exec();
        return categories.map(c => {
            const plainCategory = c.toObject();
            return new Categories({
                id: plainCategory._id ? plainCategory._id.toString() : '',
                name: plainCategory.name
            });
        }
        );
    }
    async findById(id: string): Promise<Categories> {
        const category = await CategoriesModel.findById(id).exec();
        if (!category) {
            throw new Error('Category not found');
        }
        const plainCategory = category.toObject();
        return new Categories({
            id: plainCategory._id ? plainCategory._id.toString() : '',
            name: plainCategory.name
        });
    } 
    async update(category: Categories): Promise<Categories> {
        const updated = await CategoriesModel.findByIdAndUpdate(category.id, category, { new: true }).exec();
        if (!updated) {
            throw new Error('Category not found for update');
        }
        const plainCategory = updated.toObject();
        return new Categories({
            id: plainCategory._id ? plainCategory._id.toString() : '',
            name: plainCategory.name
        });
    }
    async delete(id: string): Promise<void> {
        const categoryInProducts = await ProductModel.exists({ categoryId: id });
        if (categoryInProducts) {
            throw new Error('Cannot delete category that is associated with existing products');
        }
        const result = await CategoriesModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new Error('Category not found for deletion');
        }
        return;
    }  
}