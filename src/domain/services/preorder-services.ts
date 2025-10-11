import { IPreorder } from "../models/interfaces/IPreorder";
import { Preorder } from "../entities/Preorder";
import { IPreorderRepository } from "../repositories/IPreorder-repository";
import { validateStock, validateshippingAddress,isFreeShipping } from "../business-rules/preorder-rules";
import { PreOrderStatus } from '../../application/dtos/preorder-dtos';
import { IInventoryRepository } from "../repositories/IInventory-repository";

export const savePreOrder = async (preorderRepo: IPreorderRepository, preorderData: IPreorder, inventoryRepo: IInventoryRepository): Promise<Preorder> => {

    try {
        // 1. Verificación final de stock
        await validateStock(preorderData.products, inventoryRepo);

        // 2. Validación de dirección de envío
        validateshippingAddress(preorderData.shippingAddress);

        // 3. Calcular total de productos
        const totalProducts = preorderData.products.reduce(
            (sum, p) => sum + p.price * p.quantity,
            0
        );

        // 4. Cálculo automático de costos de envío y envío gratis
        let shippingCost = 0;
        if (!isFreeShipping(totalProducts)) {
            shippingCost = 10000; // Aquí puedes mejorar la lógica según distancia/peso
        }

        // 5. Construir la preorden con estado PENDING
        const preorder = new Preorder({
            ...preorderData,
            shippingCost,
            total: totalProducts + shippingCost,
            status: PreOrderStatus.PENDING,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // 6. Persistir la preorden
        const result = await preorderRepo.save(preorder);
        return result;
    } catch (error) {
        throw new Error(`[ERROR TO SERVICE] - Error saving preorder: ${error}`);
    }
}

export const confirmPreOrder = async (preorderRepo: IPreorderRepository, preorderId: string): Promise<Preorder> => {
    try {
        // 1. Find the preorder by ID
        const existingPreorder = await preorderRepo.findById(preorderId);
        
        if (!existingPreorder) {
            throw new Error('Preorder not found');
        }

        // 2. Validate that the preorder can be confirmed (only PENDING status can be confirmed)
        if (existingPreorder.status !== PreOrderStatus.PENDING) {
            throw new Error(`Cannot confirm preorder with status: ${existingPreorder.status}. Only PENDING preorders can be confirmed.`);
        }

        // 3. Update the preorder status to CONFIRMED
        const updatedPreorder = new Preorder({
            ...existingPreorder,
            status: PreOrderStatus.CONFIRMED,
            updatedAt: new Date()
        });

        // 4. Save the updated preorder
        const result = await preorderRepo.update(preorderId, updatedPreorder);
        
        if (!result) {
            throw new Error('Failed to update preorder');
        }

        return result;
    } catch (error) {
        throw new Error(`[ERROR TO SERVICE] - Error confirming preorder: ${error}`);
    }
}