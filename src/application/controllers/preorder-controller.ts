import { Request, Response } from 'express';
import { buildPreOrder, PreOrderRequestDTO, PreOrderResponseDTO } from '../dtos/preorder-dtos';
import { savePreOrder, confirmPreOrder } from '../../domain/services/preorder-services';
import { MongoPreorderRepository } from '../../infraestructure/repositories/mongo-preorden';
import { MongoInventoryRepository } from '../../infraestructure/repositories/mongo-inventory';
import { MongoOrderRepository } from '../../infraestructure/repositories/mongo-order';
import { buildOrderResponse } from '../dtos/order-dtos';
import { EmailService } from '../../domain/services/email-services';

const preorderRepo = new MongoPreorderRepository();
const inventoryRepo = new MongoInventoryRepository();
const orderRepo = new MongoOrderRepository();

export const createdCheckoutOrder = async (request: Request, response: Response) => {
    try {
        const { userId } = request.params;
        const preOrderRequest: PreOrderRequestDTO = request.body;


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
        const { emailNotification } = request.body

        if (!preorderId) {
            return response.status(400).json({
                ok: false,
                message: 'Preorder ID is required'
            });
        }


        const result = await confirmPreOrder(preorderRepo, preorderId, orderRepo, inventoryRepo);



        const userEmail = request.body.emailNotification || request.user?.email;
        let emailSent = false;
        const emailService = new EmailService();
        if (emailNotification && userEmail) {
            emailSent = await emailService.sendOrderConfirmationEmail(result.order, userEmail);
        }

        response.status(200).json({
            ok: true,
            message: 'Preorder confirmed and order created successfully',
            preorder: result.preorder,
            order: buildOrderResponse(result.order)
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

        if (errorMessage.includes('Insufficient stock')) {
            return response.status(400).json({
                ok: false,
                message: 'Insufficient stock for order creation',
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