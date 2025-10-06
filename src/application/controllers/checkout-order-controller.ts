import { Request, Response } from 'express';

export const createdCheckoutOrder = async (request: Request, response: Response) => {
    try {
        response.status(200).json({
            ok: true,
            message: 'No tengo ni idea como hacerlo'
        });
    } catch (error) {
    }
}