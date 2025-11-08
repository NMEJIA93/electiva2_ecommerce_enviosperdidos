import { Request, Response, NextFunction } from 'express';

export const usePreOrderValidation = (req: Request, res: Response, next: NextFunction) => {
    const { products, shippingAddress, paymentMethod } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ ok: false, message: 'Products are required and must be a non-empty array.' });
    }

    for (const product of products) {
        if (!product.productId || typeof product.productId !== 'string') {
            return res.status(400).json({ ok: false, message: 'Each product must have a valid productId.' });
        }
        if (!product.name || typeof product.name !== 'string') {
            return res.status(400).json({ ok: false, message: 'Each product must have a valid name.' });
        }
        if (typeof product.quantity !== 'number' || product.quantity <= 0) {
            return res.status(400).json({ ok: false, message: 'Each product must have a quantity greater than 0.' });
        }
        if (typeof product.price !== 'number' || product.price < 0) {
            return res.status(400).json({ ok: false, message: 'Each product must have a valid price.' });
        }
        if (!product.categoryId || typeof product.categoryId !== 'string') {
            return res.status(400).json({ ok: false, message: 'Each product must have a valid categoryId.' });
        }
    }

    if (!shippingAddress || typeof shippingAddress !== 'object') {
        return res.status(400).json({ ok: false, message: 'Valid shipping address is required.' });
    }
    const requiredAddressFields = ['country', 'state', 'city', 'neighborhood', 'address', 'postalCode'];
    for (const field of requiredAddressFields) {
        if (!shippingAddress[field] || typeof shippingAddress[field] !== 'string') {
            return res.status(400).json({ ok: false, message: `Shipping address field '${field}' is required and must be a string.` });
        }
    }

    if (!paymentMethod || typeof paymentMethod !== 'string') {
        return res.status(400).json({ ok: false, message: 'Valid payment method is required.' });
    }

    next();
}