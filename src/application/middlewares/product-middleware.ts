import { Request, Response, NextFunction } from 'express';

export function validateProduct(request: Request, response: Response, next: NextFunction) {
    const { name, description, cost, stock, categoryId, images } = request.body;

    // name (opcional en update)
    if (name !== undefined) {
        if (typeof name !== 'string' || name.length < 3 || name.length > 50) {
            return response.status(422).json({
                ok: false,
                error: 'The product name must be a string between 3 and 50 characters'
            });
        }
    }

    // description
    if (description !== undefined) {
        if (typeof description !== 'string' || description.length < 10 || description.length > 500) {
            return response.status(422).json({
                ok: false,
                error: 'The product description must be a string between 10 and 500 characters'
            });
        }
    }

    // cost
    if (cost !== undefined) {
        if (typeof cost !== 'number' || cost < 0) {
            return response.status(422).json({
                ok: false,
                error: 'The product cost must be a positive number'
            });
        }
    }

    // stock
    if (stock !== undefined) {
        if (typeof stock !== 'number' || stock < 0) {
            return response.status(422).json({
                ok: false,
                error: 'The product stock must be a non-negative number'
            });
        }
    }

    // categoryId
    if (categoryId !== undefined) {
        if (typeof categoryId !== 'string' || categoryId.trim().length === 0) {
            return response.status(422).json({
                ok: false,
                error: 'The product categoryId must be a non-empty string'
            });
        }
    }

    // images
    if (images !== undefined) {
        if (!Array.isArray(images) || images.length === 0 || !images.every(img => typeof img === 'string')) {
            return response.status(422).json({
                ok: false,
                error: 'The product images must be a non-empty array of strings'
            });
        }
    }

    next();
}
