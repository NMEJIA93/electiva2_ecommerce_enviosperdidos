import { IPreorderProduct } from "../models/interfaces/IPreorder";
import { IInventoryRepository } from "../repositories/IInventory-repository";

export async function validateStock(products: IPreorderProduct[], inventoryRepo: IInventoryRepository) {
    for (const product of products) {
        const inventory = await inventoryRepo.getInventoryByProductId(product.productId);
        if (product.quantity > inventory.stock) {
            throw new Error(`No hay suficiente stock para el producto ${product.name}`);
        }
    }
}

//No se permite checkout con productos sin stock

//Validación de dirección de envío completa y válida

//Cálculo automático de costos de envío según distancia/peso

//Orden mínima de $50,000 COP para envío gratuito