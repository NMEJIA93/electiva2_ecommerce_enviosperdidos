import { IPreorder } from "../models/interfaces/IPreorder";
import { Preorder } from "../entities/Preorder";
import { IPreorderRepository } from "../repositories/IPreorder-repository";
import { validateStock, validateshippingAddress, isFreeShipping } from "../business-rules/preorder-rules";
import { PreOrderStatus } from '../../application/dtos/preorder-dtos';
import { IInventoryRepository } from "../repositories/IInventory-repository";
import { IOrderRepository } from "../repositories/IOrder-repository";
import { createOrderFromPreorder } from "./order-services";
import { Order } from "../entities/Order";

export const savePreOrder = async (preorderRepo: IPreorderRepository, preorderData: IPreorder, inventoryRepo: IInventoryRepository): Promise<Preorder> => {

    try {

        await validateStock(preorderData.products, inventoryRepo);

        validateshippingAddress(preorderData.shippingAddress);

        const totalProducts = preorderData.products.reduce(
            (sum, p) => sum + p.price * p.quantity,
            0
        );

        let shippingCost = 0;
        if (!isFreeShipping(totalProducts)) {
            shippingCost = 10000; 
        }

        const preorder = new Preorder({
            ...preorderData,
            shippingCost,
            total: totalProducts + shippingCost,
            status: PreOrderStatus.PENDING,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const result = await preorderRepo.save(preorder);
        return result;
    } catch (error) {
        throw new Error(`[ERROR TO SERVICE] - Error saving preorder: ${error}`);
    }
}

export const confirmPreOrder = async (
    preorderRepo: IPreorderRepository,
    preorderId: string,
    orderRepo: IOrderRepository,
    inventoryRepo: IInventoryRepository
): Promise<{ preorder: Preorder; order: Order }> => {
    try {

        const existingPreorder = await preorderRepo.findById(preorderId);

        if (!existingPreorder) {
            throw new Error('Preorder not found');
        }

        if (existingPreorder.status !== PreOrderStatus.PENDING) {
            throw new Error(`Cannot confirm preorder with status: ${existingPreorder.status}. Only PENDING preorders can be confirmed.`);
        }

        await validateStock(existingPreorder.products, inventoryRepo);

        // Create order data
        const orderData = {
            preorderId: existingPreorder._id!,
            userId: existingPreorder.userId,
            products: existingPreorder.products,
            shippingAddress: existingPreorder.shippingAddress,
            paymentMethod: existingPreorder.paymentMethod,
            shippingCost: existingPreorder.shippingCost,
            total: existingPreorder.total,
            orderNumber: '',
            status: 'PENDING' as any,
            createdAt: new Date(),
            updatedAt: new Date(),
            emailSent: true
        };

        const createdOrder = await createOrderFromPreorder(orderRepo, inventoryRepo, orderData);

        // Only update preorder status AFTER order is successfully created
        const updatedPreorder = new Preorder({
            ...existingPreorder,
            status: PreOrderStatus.CONFIRMED,
            updatedAt: new Date()
        });

        const confirmedPreorder = await preorderRepo.update(preorderId, updatedPreorder);

        if (!confirmedPreorder) {
            throw new Error('Failed to update preorder');
        }

        return {
            preorder: confirmedPreorder,
            order: createdOrder
        };
    } catch (error) {
        throw new Error(`[ERROR TO SERVICE] - Error confirming preorder: ${error}`);
    }
}