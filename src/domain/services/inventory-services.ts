import { IInventoryRepository } from "../repositories/IInventory-repository";
import { Inventory } from "../entities/Inventory";
import { IInventory } from "../models/interfaces/IInventory";

export const updateInventoryById = async  (inventoryRepo: IInventoryRepository, invetoryData: IInventory, productId: string) : Promise <Inventory> =>{
    try{
        return await inventoryRepo.update (productId, invetoryData)
    } catch (error){
        throw new Error (`Error updating inventory product: ${error}` );
    }
}

export const updateReservedStock = async (inventoryRepo: IInventoryRepository, inventoryData: IInventory, productId: string): Promise <Inventory> =>{
    return await inventoryRepo.updateReservedStock(productId,inventoryData)
}

export const findInventoryById = async (inventoryRepo: IInventoryRepository, productId: string): Promise <Inventory> => {
    try{
        return await inventoryRepo.getInventoryById(productId);
    }catch(error){
        throw new Error (`Error retrieving product by ID: ${error}`);
    }
}

