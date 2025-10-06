import { Request, Response } from 'express';
import { buildPreOrder } from '../dtos/preorder-dtos';

export const createdCheckoutOrder = async (request: Request, response: Response) => {
    try {

        const newOrder = buildPreOrder(request.body);

        // Aquí iría la lógica para guardar la preorden en la base de datos
        // const savedOrder = await savePreOrderToDB(newOrder);


        response.status(200).json({
            ok: true,
            order: newOrder
        });
    } catch (error) {
    }
}