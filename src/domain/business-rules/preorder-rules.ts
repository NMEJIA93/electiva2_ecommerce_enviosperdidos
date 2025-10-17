import { IPreorderProduct, IShippingAddress } from "../models/interfaces/IPreorder";
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
export function validateshippingAddress(shippingAddress: IShippingAddress) {
    const requiredFields = ['country', 'state', 'city', 'neighborhood', 'address', 'postalCode'];
    for (const field of requiredFields) {
        if (!shippingAddress[field] || typeof shippingAddress[field] !== 'string' || shippingAddress[field].trim() === '') {
            throw new Error(`El campo '${field}' de la dirección de envío es obligatorio y debe ser un string no vacío.`);
        }
    }
    // Ejemplo de validación adicional: código postal debe tener al menos 5 caracteres
    if (shippingAddress.postalCode.length < 5) {
        throw new Error("El código postal debe tener al menos 5 caracteres.");
    }
}

//Cálculo automático de costos de envío según distancia/peso

//Orden mínima de $50,000 COP para envío gratuito
export function isFreeShipping(totalProducts: number): boolean {
    return totalProducts >= 50000;
}


