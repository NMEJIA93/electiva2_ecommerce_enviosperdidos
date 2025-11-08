import { Request, Response } from 'express';
import { buildPreOrder, PreOrderRequestDTO, PreOrderResponseDTO } from '../dtos/preorder-dtos';
import { savePreOrder, confirmPreOrder } from '../../domain/services/preorder-services';
import { MongoPreorderRepository } from '../../infraestructure/repositories/mongo-preorden';
import { MongoInventoryRepository } from '../../infraestructure/repositories/mongo-inventory';
import { MongoOrderRepository } from '../../infraestructure/repositories/mongo-order';
import { buildOrderResponse } from '../dtos/order-dtos';
import { NodemailerEmailService } from '../../infraestructure/services/nodemailer-email';

const preorderRepo = new MongoPreorderRepository();
const inventoryRepo = new MongoInventoryRepository();
const orderRepo = new MongoOrderRepository();
const emailService = new NodemailerEmailService();

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
        const { emailNotification } = request.body;

        if (!preorderId) {
            return response.status(400).json({
                ok: false,
                message: 'Preorder ID is required'
            });
        }

        const result = await confirmPreOrder(preorderRepo, preorderId, orderRepo, inventoryRepo);

        // Email sending logic
        let emailSent = false;
        let emailError = null;
        
        // Get email from request body or user context
        const userEmail = emailNotification || request.user?.email;
        
        if (userEmail) {
            console.log(`[PREORDER CONTROLLER] - Attempting to send email to: ${userEmail}`);
            try {
                emailSent = await emailService.sendOrderConfirmationEmail(result.order, userEmail);
                console.log(`[PREORDER CONTROLLER] - Email sent status: ${emailSent}`);
            } catch (error) {
                console.error(`[PREORDER CONTROLLER] - Error sending email: ${error}`);
                emailError = (error as Error).message;
            }
        } else {
            console.log('[PREORDER CONTROLLER] - No email provided, skipping email notification');
        }

        response.status(200).json({
            ok: true,
            message: 'Preorder confirmed and order created successfully',
            preorder: result.preorder,
            order: buildOrderResponse(result.order),
            emailSent,
            emailError: emailError || undefined
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