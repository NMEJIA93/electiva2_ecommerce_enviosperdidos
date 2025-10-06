import { Request, Response, NextFunction } from 'express';

export const usePreOrderValidation = (req: Request, res: Response, next: NextFunction) => {
    const { products, shippingAddress, paymentMethod, shippingCost, total } = req.body;


    if (!products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ ok: false, message: 'Products are required and must be a non-empty array.' });
    }

    if (!shippingAddress || typeof shippingAddress !== 'object') {
        return res.status(400).json({ ok: false, message: 'Valid shipping address is required.' });
    }

    if (!paymentMethod || typeof paymentMethod !== 'string') {
        return res.status(400).json({ ok: false, message: 'Valid payment method is required.' });
    }


    next();
}