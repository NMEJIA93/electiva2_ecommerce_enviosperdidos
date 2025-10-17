import { IOrderRepository } from "../repositories/IOrder-repository";
import { IInventoryRepository } from "../repositories/IInventory-repository";
import { IOrderProduct } from "../models/interfaces/IOrder";

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
