import { Request, Response } from 'express';
import { buildPreOrder, PreOrderRequestDTO, PreOrderResponseDTO } from '../dtos/preorder-dtos';
import { savePreOrder, confirmPreOrder } from '../../domain/services/preorder-services';
import { MongoPreorderRepository } from '../../infraestructure/repositories/mongo-preorden';
import { MongoInventoryRepository } from '../../infraestructure/repositories/mongo-inventory';

const preorderRepo = new MongoPreorderRepository();
const inventoryRepo = new MongoInventoryRepository();

export const createdCheckoutOrder = async (request: Request, response: Response) => {
    try {
        const { userId } = request.params;
        const preOrderRequest: PreOrderRequestDTO = request.body;
        
        // Ensure the userId from params matches the userId in the request body
        const newPreOrder = buildPreOrder({
            ...preOrderRequest,
            userId: userId
        });

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

export const confirmPreorder = async (request: Request, response: Response) => {
    try {
        const { preorderId } = request.params;

        if (!preorderId) {
            return response.status(400).json({
                ok: false,
                message: 'Preorder ID is required'
            });
        }

        const result = await confirmPreOrder(preorderRepo, preorderId);

        response.status(200).json({
            ok: true,
            message: 'Preorder confirmed successfully',
            preorder: result
        });
    } catch (error) {
        const errorMessage = (error as Error).message;
        
        if (errorMessage.includes('not found')) {
            return response.status(404).json({
                ok: false,
                message: 'Preorder not found',
                error: errorMessage
            });
        }
        
        if (errorMessage.includes('Cannot confirm preorder')) {
            return response.status(400).json({
                ok: false,
                message: 'Invalid preorder status for confirmation',
                error: errorMessage
            });
        }

        response.status(500).json({
            ok: false,
            message: 'Internal server error',
            error: errorMessage
        });
    }
}