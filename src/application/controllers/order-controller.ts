import { Request, Response } from 'express';
import { buildOrderRequest, buildOrderResponse } from '../dtos/order-dtos';
import {
    createOrderFromPreorder,
    confirmOrder,
    getOrderById,
    getOrderByNumber,
    getUserOrders
} from '../../domain/services/order-services';

import { MongoOrderRepository } from '../../infraestructure/repositories/mongo-order';
import { MongoInventoryRepository } from '../../infraestructure/repositories/mongo-inventory';
import { NodemailerEmailService } from '../../infraestructure/services/nodemailer-email';

const orderRepo = new MongoOrderRepository();
const inventoryRepo = new MongoInventoryRepository();
const emailService = new NodemailerEmailService();

export const createOrder = async (request: Request, response: Response) => {
    try {
        const orderRequest = buildOrderRequest(request.body);

        const result = await createOrderFromPreorder(orderRepo, inventoryRepo, orderRequest);

        // Enviar correo al crear la orden
        const userEmail = request.body.emailNotification; 
        let emailSent = false;
        if (userEmail) {
            emailSent = await emailService.sendOrderConfirmationEmail(result, userEmail);
        }


        response.status(201).json({
            ok: true,
            message: 'Order created successfully',
            order: buildOrderResponse(result)
        });

    } catch (error) {
        const errorMessage = (error as Error).message;

        if (errorMessage.includes('already exists')) {
            return response.status(409).json({
                ok: false,
                message: 'Order already exists for this preorder',
                error: errorMessage
            });
        }

        if (errorMessage.includes('Insufficient stock')) {
            return response.status(400).json({
                ok: false,
                message: 'Insufficient stock for order',
                error: errorMessage
            });
        }

        response.status(500).json({
            ok: false,
            message: 'Internal server error',
            error: errorMessage
        });
    }
};


export const confirmOrderController = async (request: Request, response: Response) => {
    try {
        const { orderId } = request.params;
        const { userEmail } = request.body;

        if (!orderId) {
            return response.status(400).json({
                ok: false,
                message: 'Order ID is required'
            });
        }

        if (!userEmail) {
            return response.status(400).json({
                ok: false,
                message: 'User email is required for confirmation'
            });
        }

        const result = await confirmOrder(orderRepo, orderId);

        // Send email notification
        const emailSent = await emailService.sendOrderConfirmationEmail(result, userEmail);

        response.status(200).json({
            ok: true,
            message: 'Order confirmed successfully',
            order: buildOrderResponse(result),
            emailSent
        });
    } catch (error) {
        const errorMessage = (error as Error).message;

        if (errorMessage.includes('not found')) {
            return response.status(404).json({
                ok: false,
                message: 'Order not found',
                error: errorMessage
            });
        }

        if (errorMessage.includes('Cannot confirm order')) {
            return response.status(400).json({
                ok: false,
                message: 'Invalid order status for confirmation',
                error: errorMessage
            });
        }

        response.status(500).json({
            ok: false,
            message: 'Internal server error',
            error: errorMessage
        });
    }
};

/**
 * Gets order by ID
 */
export const getOrderByIdController = async (request: Request, response: Response) => {
    try {
        const { orderId } = request.params;

        const order = await getOrderById(orderRepo, orderId);

        if (!order) {
            return response.status(404).json({
                ok: false,
                message: 'Order not found'
            });
        }

        response.status(200).json({
            ok: true,
            order: buildOrderResponse(order)
        });
    } catch (error) {
        response.status(500).json({
            ok: false,
            message: 'Internal server error',
            error: (error as Error).message
        });
    }
};

/**
 * Gets order by order number
 */
export const getOrderByNumberController = async (request: Request, response: Response) => {
    try {
        const { orderNumber } = request.params;

        const order = await getOrderByNumber(orderRepo, orderNumber);

        if (!order) {
            return response.status(404).json({
                ok: false,
                message: 'Order not found'
            });
        }

        response.status(200).json({
            ok: true,
            order: buildOrderResponse(order)
        });
    } catch (error) {
        response.status(500).json({
            ok: false,
            message: 'Internal server error',
            error: (error as Error).message
        });
    }
};

/**
 * Gets all orders for a user
 */
export const getUserOrdersController = async (request: Request, response: Response) => {
    try {
        const { userId } = request.params;

        const orders = await getUserOrders(orderRepo, userId);

        response.status(200).json({
            ok: true,
            orders: orders.map(order => buildOrderResponse(order))
        });
    } catch (error) {
        response.status(500).json({
            ok: false,
            message: 'Internal server error',
            error: (error as Error).message
        });
    }
};
