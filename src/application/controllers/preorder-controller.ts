import { Request, Response } from 'express';
import { buildPreOrder, PreOrderRequestDTO } from '../dtos/preorder-dtos';
import { savePreOrder } from '../../domain/services/preorder-services';
import { MongoPreorderRepository } from '../../infraestructure/repositories/mongo-preorden';
import { MongoInventoryRepository } from '../../infraestructure/repositories/mongo-inventory';

const preorderRepo = new MongoPreorderRepository();
const inventoryRepo = new MongoInventoryRepository();

export const createdCheckoutOrder = async (request: Request, response: Response) => {
    try {
        const preOrderRequest: PreOrderRequestDTO = request.body;
        const newPreOrder = buildPreOrder(preOrderRequest);

        const result = await savePreOrder(preorderRepo, newPreOrder, inventoryRepo);

        response.status(201).json({
            ok: true,
            order: result
        });
    } catch (error) {
        response.status(500).json({
            ok: false,
            message: 'Internal server error',
            error: (error as Error).message
        });
    }
}