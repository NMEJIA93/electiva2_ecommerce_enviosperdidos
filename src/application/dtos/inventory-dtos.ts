import { IInventory } from "../../domain/models/interfaces/IInventory";

export interface InventoryRequest {
    productId: string;
    price: number;
    stock: number;
    reservedStock: number;
    action?: number
}

export function buildInventoryRequest(dto: InventoryRequest): IInventory {
    return {
        id: '',
        productId: dto.productId,
        price: dto.price,
        stock: dto.stock,
        reservedStock: dto.reservedStock,
        action: dto.action
    };
}
