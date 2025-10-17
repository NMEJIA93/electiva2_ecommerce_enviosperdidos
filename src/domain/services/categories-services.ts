import {ICategoriesRepository} from "../repositories/ICategories-repository";
import { Categories } from "../entities/Categories";
import { ICategories } from "../models/interfaces/ICategories";

export const saveCategory = async ( categoryRepo: ICategoriesRepository, categoryData: ICategories): Promise<Categories> => {
    try {
        const category = new Categories(categoryData);
        return await categoryRepo.save(category);
    } catch (error) {
        throw new Error(`[ERROR TO SERVICE] - Error saving category: ${error}`);
    }
}

export const findCategories = async (categoryRepo: ICategoriesRepository): Promise<Categories[]> => {
    try {
        return await categoryRepo.findAll();
    } catch (error) {
        throw new Error(`[ERROR TO SERVICE] - Error retrieving categories: ${error}`);
    }   
}

export const findCategoryById = async (categoryRepo: ICategoriesRepository, id: string): Promise<Categories> => {
    try {
        return await categoryRepo.findById(id);
    } catch (error) {
        throw new Error(`[ERROR TO SERVICE] - Error retrieving category by ID: ${error}`);
    }       
}

export const updateCategory = async (categoryRepo: ICategoriesRepository, categoryData: ICategories & { id: string }): Promise<Categories> => {
    try {
        const category = new Categories(categoryData);
        return await categoryRepo.update(category);
    } catch (error) {
        throw new Error(`[ERROR TO SERVICE] - Error updating category: ${error}`);
    }
}
export const deleteCategory = async (categoryRepo: ICategoriesRepository, id: string): Promise<void> => {
    try {
        return await categoryRepo.delete(id);

    } catch (error) {
        throw new Error(`[ERROR TO SERVICE] - Error deleting category: ${error}`);
    }
}