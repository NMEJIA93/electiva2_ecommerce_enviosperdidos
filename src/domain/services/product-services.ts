import { IProductRepository } from "../repositories/IProduct-repository";
import { Product } from "../entities/Product";
import { IProduct } from "../models/interfaces/IProduct";


export const saveProduct = async (productRepo: IProductRepository, productData: IProduct): Promise<Product> => {
    try {
        const product = new Product(productData);
        return await productRepo.save(product);
    } catch (error) {
        throw new Error(`[ERROR TO SERVICE] Error saving product: ${error}`);
    }
};

export const findProducts = async (productRepo: IProductRepository): Promise<Product[]> => {
    try {
        return await productRepo.findAll();
    } catch (error) {
        throw new Error(`Error retrieving products: ${error}`);
    }
};

export const findProductById = async (productRepo: IProductRepository, id: string): Promise<Product> => {
    try {
        return await productRepo.findById(id);
    } catch (error) {
        throw new Error(`Error retrieving product by ID: ${error}`);
    }
};

export const updateProductById = async (
    productRepo: IProductRepository,
    productId: string,
    productData: Partial<IProduct>
): Promise<Product> => {
    try {
        return await productRepo.update(productId, productData);
    } catch (error) {
        throw new Error(`Error updating product: ${error}`);
    }
};

export const deleteProductById = async (
    productRepo: IProductRepository,
    productId: string
): Promise<void> => {
    try {
        return await productRepo.delete(productId);
    } catch (error) {
        throw new Error(`Error deleting product: ${error}`);
    }
};
