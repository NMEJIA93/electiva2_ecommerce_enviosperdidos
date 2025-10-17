import { IInventory } from "../../domain/models/interfaces/IInventory";
import { Inventory } from "../../domain/entities/Inventory";
import { InventoryModel } from "../database/inventory-mongo";
import { IInventoryRepository } from "../../domain/repositories/IInventory-repository";
import { UserModel } from "../database/user-mongo";

export class MongoInventoryRepository implements IInventoryRepository {
  async update(id: string, data: Partial<Inventory>): Promise<Inventory> {
    const inventory = await InventoryModel.findOne({ productId: id }).exec();
    if (!inventory) {
      throw new Error("Inventory record not found for this product");
    }

    if (data.price !== undefined) inventory.price = data.price;
    if (data.stock !== undefined) inventory.stock = data.stock;
    if (data.reservedStock !== undefined) inventory.reservedStock = data.reservedStock;

    await inventory.save(); 

    return {
      id: inventory._id.toString(),
      productId: inventory.productId.toString(),
      price: inventory.price,
      stock: inventory.stock,
      reservedStock: inventory.reservedStock,
    } as Inventory;
  }

  async updateReservedStock(id: string, data: Partial<Inventory> & { userId?: string }): Promise<Inventory> {
  const { reservedStock, userId } = data as any;
  const action = Number((data as any).action);

  if (!userId) throw new Error("userId is required");

  const userExists = await UserModel.exists({ _id: userId });
  if (!userExists) throw new Error("User not found");

  const inventory = await InventoryModel.findOne({ productId: id }).exec();
  if (!inventory) throw new Error("Inventory record not found for this product");

  if (typeof reservedStock !== "number" || reservedStock <= 0) {
    throw new Error("The reservedStock value must be a positive number");
  }

  if (!inventory.reservations) inventory.reservations = [];

  if (action === 1) {
    if (inventory.reservedStock + reservedStock > inventory.stock) {
      throw new Error("Reserved stock cannot exceed available stock");
    }
    inventory.reservedStock += reservedStock;
    inventory.reservations.push({
      userId,
      quantity: reservedStock,
      createdAt: new Date(),
    });
  } else if (action === 2) {
    const index = inventory.reservations.findIndex(r => r.userId.toString() === userId && r.quantity === reservedStock);
    if (index === -1) throw new Error("No matching reservation found to remove");
    inventory.reservedStock -= reservedStock;
    inventory.reservations.splice(index, 1);
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
    reservations: inventory.reservations.map(r => ({
      userId: r.userId.toString(),
      quantity: r.quantity,
      createdAt: r.createdAt,
    })),
  } as Inventory;
}

  async getInventoryById(productId: string): Promise<Inventory> {
  const inventory = await InventoryModel.findOne({ productId })
    .populate({
      path: "productId",
      select: "name description cost categoryId providers images isDiscontinued createdAt updatedAt",
      populate: [
        { path: "categoryId", select: "name" },
        { path: "providers", select: "name" },
      ],
    })
    .exec();

  if (!inventory) {
    throw new Error("Inventory not found for this product");
  }

  const product: any = inventory.productId;

  return {
    id: inventory._id.toString(),
    productId: product._id.toString(),
    name: product.name,
    description: product.description,
    cost: product.cost,
    category: Array.isArray(product.categoryId)
      ? product.categoryId.map((c: any) => ({
          id: c._id?.toString() || null,
          name: c.name || null,
        }))
      : [
          {
            id: product.categoryId?._id?.toString() || null,
            name: product.categoryId?.name || null,
          },
        ],
    providers: Array.isArray(product.providers)
      ? product.providers.map((p: any) => ({
          id: p._id?.toString() || null,
          name: p.name || null,
        }))
      : [],
    images: Array.isArray(product.images) ? product.images : [],
    isDiscontinued: product.isDiscontinued,
    stock: inventory.stock,
    reservedStock: inventory.reservedStock,
    price: inventory.price,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  } as unknown as Inventory;
}
  async getInventoryByProductId(productId: string): Promise<Inventory> {
        const inventory = await InventoryModel.findOne({ productId }).exec();
        if (!inventory) {
            throw new Error("Inventory record not found for this product");
        }
        return {
            id: inventory._id.toString(),
            productId: inventory.productId.toString(),
            price: inventory.price,
            stock: inventory.stock,
            reservedStock: inventory.reservedStock,
        } as Inventory;
    }
}