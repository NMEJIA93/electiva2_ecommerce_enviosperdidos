import mongoose, { Schema } from "mongoose";
import { IProductDocument } from "../interface/IProduct-mongo";

const ProductSchema = new mongoose.Schema<IProductDocument>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    cost: { type: Number, required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    providers: [{type: Schema.Types.ObjectId, ref: "Provider"}],
    images: [{ type: String }],
    classification: { type: String, default: 'Vigenete' }
});

export const ProductModel = mongoose.model<IProductDocument>('Product', ProductSchema);