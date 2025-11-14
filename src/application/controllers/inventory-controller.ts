import { Request, Response } from "express";
import {updateInventoryById,updateReservedStock,findInventoryById} from '../../domain/services/inventory-services';
import { buildInventoryRequest, InventoryRequest } from "../dtos/inventory-dtos";
import { MongoInventoryRepository } from "../../infraestructure/repositories/mongo-inventory";
import { IInventory } from "../../domain/models/interfaces/IInventory";


const inventoryRepo = new MongoInventoryRepository()

export const updateInventory = async (request: Request, response: Response) => {
  try {
    const productId = request.params.id;
    const inventoryUpdates: Partial<IInventory> = { ...request.body };
    const updatedInventory = await updateInventoryById(inventoryRepo, inventoryUpdates, productId);

    response.status(200).json({
      ok: true,
      message: 'Inventory updated successfully',
      inventory: updatedInventory
    });
  } catch (error) {
    return response.status(500).json({
      ok: false,
      message: 'Internal server error',
      error: (error as Error).message
    });
  }
};


export const updateReserved = async (request: Request, response : Response) =>{
    try{
        const productId = request.params.id;
        const inventoryUpdates : Partial <IInventory> = {...request.body};
        const updateInventory = await updateReservedStock(inventoryRepo, inventoryUpdates, productId)

        response.status(200).json({
            ok: true,
            message: 'inventory update successfully',
            inventory: updateInventory
        })
    } catch (error){
        return response.status(500).json({
            ok: false,
            message: 'internal server error',
            error: (error as Error).message
        })
    }
}

export const getInventoryById = async (request: Request, response: Response) => {
    try{
        const invetory = await findInventoryById(inventoryRepo,request.params.id);
        response.status(200).json ({
            ok: true,
            invetory
        })
    }catch (error){
        return response.status(500).json({
            ok: false,
            message: 'Internal server error',
            error: (error as Error).message
        });
    }
}



