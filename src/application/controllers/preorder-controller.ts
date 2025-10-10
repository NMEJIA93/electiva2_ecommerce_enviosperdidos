import { Request, Response } from 'express';
import { buildPreOrder, PreOrderRequestDTO, PreOrderResponseDTO } from '../dtos/preorder-dtos';

export const createdCheckoutOrder = async (request: Request, response: Response) => {
    try {

        const preOrderRequest: PreOrderRequestDTO = request.body;
        const newPreOrder = buildPreOrder(preOrderRequest);

        // Aquí iría la lógica para guardar la preorden en la base de datos
        // const savedOrder = await savePreOrderToDB(newOrder);


        response.status(200).json({
            ok: true,
            order: newPreOrder
        });
    } catch (error) {
    }
}