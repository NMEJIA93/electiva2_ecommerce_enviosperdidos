import mongoose from "mongoose";

export interface IInventoryDocument extends mongoose.Document {
    productId: mongoose.Types.ObjectId;
    price: number;
    stock: number;
    reservedStock: number;
    createdAt: Date;
    updatedAt: Date;
}