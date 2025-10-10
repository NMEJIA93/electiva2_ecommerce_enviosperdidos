import { Request, Response } from "express";
import { IInventoryRepository } from "../../domain/repositories/IInventory-repository";
import { MongoInventoryRepository } from "../../infraestructure/repositories/mongo-inventory";
import { Inventory } from "../../domain/entities/Inventory";
import { buildInventoryRequest, InventoryRequest } from "../dtos/inventory-dtos";

const inventoryRepo: IInventoryRepository = new MongoInventoryRepository();

export const updateInventory = async (request: Request, response: Response) => {
    try {
        const productId = request.params.id;
        const inventoryUpdates: Partial<Inventory> = { ...request.body };
        const updatedInventory = await inventoryRepo.updateInventory(productId, inventoryUpdates);
        response.status(200).json({
            ok: true,
            message: 'Inventory updated successfully',
            inventory: updatedInventory
        });
    }
    catch (error) {
        return response.status(500).json({
            ok: false,
            message: 'Internal server error',
            error: (error as Error).message
        });
    }
}

export const updateReservedStock = async (request: Request, response: Response) => {
    try {
        const productId = request.params.id;
        const inventoryRequest: InventoryRequest = buildInventoryRequest(request.body);
        const updatedInventory = await inventoryRepo.updateReservedStock(productId, inventoryRequest);
        response.status(200).json({
            ok: true,
            message: 'Reserved stock updated successfully',
            inventory: updatedInventory
        });
    }
    catch (error) {
        return response.status(500).json({
            ok: false,
            message: 'Internal server error',
            error: (error as Error).message
        });
    }
}