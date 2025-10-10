export interface IInventory {
    id?: string;
    productId: string;
    price: number;
    stock: number;
    reservedStock: number;
    action?: number;
}

