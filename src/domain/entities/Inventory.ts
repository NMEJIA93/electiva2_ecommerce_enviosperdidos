import { IInventory } from "../models/interfaces/IInventory";

export class Inventory implements IInventory {
    id?: string;
    productId: string;
    price: number;
    stock: number;
    reservedStock: number;
    reservations: [];
    action?: number;

    constructor(inventory: IInventory & { id?: string }) {
        this.id = inventory.id || '';
        this.productId = inventory.productId;
        this.price = inventory.price;
        this.stock = inventory.stock || 0;
        this.reservations = inventory.reservations || [];
        this.reservedStock = inventory.reservedStock || 0;
        this.action = inventory.action
    }   
}