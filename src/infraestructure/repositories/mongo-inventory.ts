import { IInventory } from "../../domain/models/interfaces/IInventory";
import { Inventory } from "../../domain/entities/Inventory";
import { InventoryModel } from "../database/inventory-mongo";
import { IInventoryRepository } from "../../domain/repositories/IInventory-repository";

export class MongoInventoryRepository implements IInventoryRepository {
  async updateInventory(id: string, data: Partial<Inventory>): Promise<Inventory> {
    const inventory = await InventoryModel.findOne({ productId: id }).exec();
    if (!inventory) {
      throw new Error("Inventory record not found for this product");
    }

    if (data.price !== undefined) inventory.price = data.price;
    if (data.stock !== undefined) inventory.stock = data.stock;

    await inventory.save();

    return {
      id: inventory._id.toString(),
      productId: inventory.productId.toString(),
      price: inventory.price,
      stock: inventory.stock,
      reservedStock: inventory.reservedStock,
    } as Inventory;
  }

  async updateReservedStock(id: string, data: Partial<Inventory>): Promise<Inventory> {
    const { reservedStock } = data as any;
    const action = Number((data as any).action);
    console.log(data)
    const inventory = await InventoryModel.findOne({ productId: id }).exec();
    if (!inventory) {
      throw new Error("Inventory record not found for this product");
    }

    if (typeof reservedStock !== "number" || reservedStock <= 0) {
      throw new Error("The reservedStock value must be a positive number");
    }

    if (action === 1) {
      inventory.reservedStock += reservedStock;
    } else if (action === 2) {
      if (inventory.reservedStock - reservedStock < 0) {
        throw new Error("Reserved stock cannot go below 0");
      }
      inventory.reservedStock -= reservedStock;
    } else {
      throw new Error("Invalid action. Use 1 to add or 2 to subtract reserved stock");
    }

    await inventory.save();

    return {
      id: inventory._id.toString(),
      productId: inventory.productId.toString(),
      price: inventory.price,
      stock: inventory.stock,
      reservedStock: inventory.reservedStock,
    } as Inventory;
  }
}