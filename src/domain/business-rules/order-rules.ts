import { IOrderRepository } from "../repositories/IOrder-repository";
import { IInventoryRepository } from "../repositories/IInventory-repository";
import { IOrderProduct, OrderStatus } from "../models/interfaces/IOrder";
import { Order } from "../entities/Order";

export const generateOrderNumber = async (orderRepo: IOrderRepository): Promise<string> => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
    const prefix = `ORD-${dateStr}-`;


    const generateSuffix = (): string => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 5; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    let orderNumber: string;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    do {
        orderNumber = prefix + generateSuffix();
        const existingOrder = await orderRepo.findByOrderNumber(orderNumber);
        isUnique = !existingOrder;
        attempts++;

        if (attempts >= maxAttempts) {
            throw new Error('Unable to generate unique order number after maximum attempts');
        }
    } while (!isUnique);

    return orderNumber;
};

export async function validateOrderStock(products: IOrderProduct[], inventoryRepo: IInventoryRepository) {
    for (const product of products) {
        const inventory = await inventoryRepo.getInventoryByProductId(product.productId);
        if (product.quantity > inventory.stock) {
            throw new Error(`No hay suficiente stock para el producto ${product.name}`);
        }
    }
}


export const deductInventoryStock = async (
    products: IOrderProduct[],
    inventoryRepo: IInventoryRepository
): Promise<void> => {
    for (const product of products) {
        const inventory = await inventoryRepo.getInventoryByProductId(product.productId);

        if (!inventory) {
            throw new Error(`Product ${product.productId} not found in inventory`);
        }

        const updatedInventory = {
            ...inventory,
            stock: inventory.stock - product.quantity,
            reservedStock: Math.max(inventory.reservedStock - product.quantity, 0)
        };

        await inventoryRepo.update(product.productId, updatedInventory);
    }
};

export const validateOrderData = (orderData: any): void => {
    if (!orderData.preorderId) {
        throw new Error('Preorder ID is required');
    }

    if (!orderData.userId) {
        throw new Error('User ID is required');
    }

    if (!orderData.products || orderData.products.length === 0) {
        throw new Error('Order must contain at least one product');
    }

    if (!orderData.shippingAddress) {
        throw new Error('Shipping address is required');
    }

    if (!orderData.paymentMethod) {
        throw new Error('Payment method is required');
    }

    if (orderData.total <= 0) {
        throw new Error('Order total must be greater than zero');
    }
};


export const cancelOrder = async (orderRepo: IOrderRepository, orderId: string, userId?: string): Promise<Order> => {

    const order = await orderRepo.findById(orderId);
    
    if (!order) {
        throw new Error('Order not found');
    }

    if (order.status !== OrderStatus.PENDING) {
        throw new Error(`Cannot cancel order with status: ${order.status}. Only PENDING orders can be cancelled.`);
    }

    if (userId && order.userId !== userId) {
        throw new Error('User ID does not match the order owner');
    }

    const now = new Date();
    const orderCreatedAt = new Date(order.createdAt);
    const hoursSinceCreation = (now.getTime() - orderCreatedAt.getTime()) / (1000 * 60 * 60);
    
    const orderUpdatedAt = new Date(order.updatedAt);
    const hoursSinceUpdate = (now.getTime() - orderUpdatedAt.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceUpdate > 48) {
         throw new Error('Order cannot be cancelled because it has been updated more than 48 hours ago');
    } else if (!userId) {
        throw new Error('User ID is required to cancel the order');
    }

    const cancelledOrder = new Order({
        ...order,
        status: OrderStatus.CANCELLED,
        updatedAt: new Date()
    });

    const result = await orderRepo.update(orderId, cancelledOrder);
    
    if (!result) {
        throw new Error('Failed to cancel order');
    }

    return result;
};

export const restoreInventoryStock = async (
    products: IOrderProduct[],
    inventoryRepo: IInventoryRepository
): Promise<void> => {
    for (const product of products) {
        const inventory = await inventoryRepo.getInventoryByProductId(product.productId);

        if (!inventory) {
            throw new Error(`Product ${product.productId} not found in inventory`);
        }

        const updatedInventory = {
            ...inventory,
            stock: inventory.stock + product.quantity,
            reservedStock: Math.max(inventory.reservedStock - product.quantity, 0)
        };

        await inventoryRepo.update(product.productId, updatedInventory);
    }
};