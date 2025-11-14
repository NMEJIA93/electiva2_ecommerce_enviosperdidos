import { Request, Response } from "express";
import { saveCategory, findCategories, findCategoryById, deleteCategory} from "../../domain/services/categories-services";
import { buildCategoriesRequest, CategoriesRequest } from "../dtos/categories";
import { MongoCategoriesRepository } from "../../infraestructure/repositories/mongo-categories";
import { CategoriesModel } from "../../infraestructure/database/categories-mongo";

const categoryRepo = new MongoCategoriesRepository();

export const createCategory = async (request: Request, response: Response) => {
    try {
        const newCategory = buildCategoriesRequest(request.body);
        const result = await saveCategory(categoryRepo, newCategory);
        response.status(201).json({
            ok: true,
            message: 'Category created successfully',
            category: result
        });
    }
    catch (error) {
        return response.status(500).json({
            ok: false,
            message: 'Internal server error',
            error: (error as Error).message
        });
    }
}
export const getCategories = async (request: Request, response: Response) => {
    try {
        const categories = await categoryRepo.findAll();
        response.status(200).json({ ok: true, categories });
    } catch (error) {
        return response.status(500).json({
            ok: false,
            message: 'Internal server error',
            error: (error as Error).message
        });
    }
}
export const getCategoryById = async (request: Request, response: Response) => {
    try {
        const categoryId: string = request.params.id;
        const category = await categoryRepo.findById(categoryId);
        if (!category) {
            return response.status(404).json({
                ok: false,
                message: 'Category not found'
            });
        }
        response.status(200).json({
            ok: true,
            category
        });
    } catch (error) {
        return response.status(500).json({
            ok: false,
            message: 'Internal server error',
            error: (error as Error).message
        });
    }
}

export const updateCategory = async (request: Request, response: Response) => {
    try {
        const categoryId: string = request.params.id;
        const updateData: CategoriesRequest = buildCategoriesRequest(request.body);
        const existingCategory = await categoryRepo.findById(categoryId);
        if (!existingCategory) {
            return response.status(404).json({
                ok: false,
                message: 'Category not found'
            });
        }
        existingCategory.name = updateData.name;
        const updatedCategory = await categoryRepo.update(existingCategory);
        response.status(200).json({
            ok: true,
            message: 'Category updated successfully',
            category: updatedCategory
        });
    } catch (error) {
        return response.status(500).json({
            ok: false,
            message: 'Internal server error',
            error: (error as Error).message
        });
    }
}

export const deleteCategoryById = async (request: Request, response: Response) => {
    try {
        const categoryId: string = request.params.id;
        const existingCategory = await categoryRepo.findById(categoryId);
        if (!existingCategory) {
            return response.status(404).json({
                ok: false,
                message: 'Category not found'
            });
        }
        await categoryRepo.delete(categoryId);
        response.status(200).json({
            ok: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        return response.status(500).json({
            ok: false,
            message: 'Internal server error',
            error: (error as Error).message
        });
    }
}
