import { IOrder } from "../models/interfaces/IOrder";
import { Order } from "../entities/Order";
import { IOrderRepository } from "../repositories/IOrder-repository";
import { IInventoryRepository } from "../repositories/IInventory-repository";
import { OrderStatus } from "../models/interfaces/IOrder";
import {
    generateOrderNumber,
    validateOrderStock,
    deductInventoryStock,
    validateOrderData
} from "../business-rules/order-rules";


export const createOrderFromPreorder = async (orderRepo: IOrderRepository, inventoryRepo: IInventoryRepository, orderData: IOrder): Promise<Order> => {
    try {

        validateOrderData(orderData);

        const existingOrder = await orderRepo.findByPreorderId(orderData.preorderId);
        if (existingOrder) {
            throw new Error(`Order already exists for preorder ${orderData.preorderId}`);
        }

        await validateOrderStock(orderData.products, inventoryRepo);

        const orderNumber = await generateOrderNumber(orderRepo);

        const order = new Order({
            ...orderData,
            orderNumber,
            status: OrderStatus.PENDING,
            createdAt: new Date(),
            updatedAt: new Date(),
            emailSent: false
        });

        const savedOrder = await orderRepo.save(order);

        await deductInventoryStock(orderData.products, inventoryRepo);

        /*
        const emailService = new EmailService();
        await emailService.sendOrderConfirmationEmail(savedOrder, userEmail);
        */

        return savedOrder;
    } catch (error) {
        throw new Error(`[ERROR TO SERVICE] - Error creating order: ${error}`);
    }
};


export const confirmOrder = async (orderRepo: IOrderRepository, orderId: string): Promise<Order> => {
    try {

        const existingOrder = await orderRepo.findById(orderId);

        if (!existingOrder) {
            throw new Error('Order not found');
        }

        if (existingOrder.status !== OrderStatus.PENDING) {
            throw new Error(`Cannot confirm order with status: ${existingOrder.status}. Only PENDING orders can be confirmed.`);
        }


        const updatedOrder = new Order({
            ...existingOrder,
            status: OrderStatus.CONFIRMED,
            confirmedAt: new Date(),
            updatedAt: new Date()
        });

        // 4. Save the updated order
        const result = await orderRepo.update(orderId, updatedOrder);

        if (!result) {
            throw new Error('Failed to update order');
        }

        return result;
    } catch (error) {
        throw new Error(`[ERROR TO SERVICE] - Error confirming order: ${error}`);
    }
};

export const getOrderById = async (orderRepo: IOrderRepository, orderId: string): Promise<Order | null> => {
    try {
        return await orderRepo.findById(orderId);
    } catch (error) {
        throw new Error(`[ERROR TO SERVICE] - Error getting order: ${error}`);
    }
};

export const getOrderByNumber = async (orderRepo: IOrderRepository, orderNumber: string): Promise<Order | null> => {
    try {
        return await orderRepo.findByOrderNumber(orderNumber);
    } catch (error) {
        throw new Error(`[ERROR TO SERVICE] - Error getting order by number: ${error}`);
    }
};

export const getUserOrders = async (orderRepo: IOrderRepository, userId: string): Promise<Order[]> => {
    try {
        return await orderRepo.findByUserId(userId);
    } catch (error) {
        throw new Error(`[ERROR TO SERVICE] - Error getting user orders: ${error}`);
    }
};
