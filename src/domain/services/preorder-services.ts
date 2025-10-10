import { IPreorder } from "../models/interfaces/IPreorder";
import { Preorder } from "../entities/Preorder";
import { IPreorderRepository } from "../repositories/IPreorder-repository";
import { validateStock } from "../business-rules/preorder-rules";
import { PreOrderStatus } from '../../application/dtos/preorder-dtos';
import { IInventoryRepository } from "../repositories/IInventory-repository";

export const savePreOrder = async (preorderRepo: IPreorderRepository, preorderData: IPreorder, inventoryRepo: IInventoryRepository): Promise<Preorder> => {

    try {
        await validateStock(preorderData.products, inventoryRepo);

        // Calcular total de productos
        const totalProducts = preorderData.products.reduce(
            (sum, p) => sum + p.price * p.quantity,
            0
        );

        // Calcular costo de envío (ejemplo simple)
        let shippingCost = 0;
        if (totalProducts < 50000) {
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

        const result = await preorderRepo.save(preorder)
        return result;
    } catch (error) {
        throw new Error(`[ERROR TO SERVICE] - Error saving preorder: ${error}`);
    }
}
