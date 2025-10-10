import mongoose, { Schema } from "mongoose";
import { IInventoryDocument } from "../interface/IInventory-mongo";
import { Inventory } from '../../domain/entities/Inventory';

const InventorySchema = new mongoose.Schema<IInventoryDocument>({
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true, unique: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    reservedStock: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export const InventoryModel = mongoose.model<IInventoryDocument>('Inventory', InventorySchema);