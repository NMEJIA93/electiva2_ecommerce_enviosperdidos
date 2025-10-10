import { Request, Response } from 'express';

import { saveProduct, findProducts, findProductById, updateProductById, deleteProductById} from '../../domain/services/product-services';
import { buildProductRequest, ProductRequest } from '../dtos/product-dtos';
import { MongoProductRepository } from '../../infraestructure/repositories/mongo-products';
import { IProduct } from '../../domain/models/interfaces/IProduct';


const productRepo = new MongoProductRepository();

export const createProduct = async (request : Request, response : Response) => {
    try {
        const newProduct = buildProductRequest(request.body);
        const result = await saveProduct(productRepo, newProduct);
        response.status(201).json({
            ok: true,
            message: 'Product created successfully',
            product: result
        });
    } catch (error) {
        return response.status(500).json({
            ok: false,
            message: 'Internal server error',
            error: (error as Error).message
        });
    }
}


export const getProducts = async (request: Request, response: Response) => {
    try {
        const products = await findProducts(productRepo);
        response.status(200).json({ ok: true, products });
    } catch (error) {
        return response.status(500).json({
            ok: false,
            message: 'Internal server error',
            error: (error as Error).message
        });
    }
}

export const getProductById = async (request: Request, response: Response) => {
    try {
        const product = await findProductById(productRepo, request.params.id);
        response.status(200).json({ ok: true, product });
    } catch (error) {
        return response.status(500).json({
            ok: false,
            message: 'Internal server error',
            error: (error as Error).message
        });
    }
}

export const updateProduct = async (request: Request, response: Response) => {
    try {
        const productId = request.params.id;
        const productUpdates: Partial<IProduct> = { ...request.body };
        
        const updatedProduct = await updateProductById(productRepo, productId, productUpdates);

        response.status(200).json({
            ok: true,
            message: 'Product updated successfully',
            product: updatedProduct
        });
    } catch (error) {
        return response.status(500).json({
            ok: false,
            message: 'Internal server error',
            error: (error as Error).message
        });
    }
}

export const deleteProduct = async (request: Request, response: Response) => {
    try {
        const productId = request.params.id;
        await deleteProductById(productRepo, productId);
        response.status(200).json({
            ok: true,
            message: 'Product deleted successfully'
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


