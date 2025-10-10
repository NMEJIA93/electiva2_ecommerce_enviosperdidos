import { Inventory } from "../entities/Inventory";

export interface IInventoryRepository {

    updateInventory(id: string, data: Partial<Inventory>): Promise<Inventory>;
    updateReservedStock(id: string, data: Partial<Inventory>): Promise<Inventory>;
    getInventoryByProductId(productId: string): Promise<Inventory>;

}
