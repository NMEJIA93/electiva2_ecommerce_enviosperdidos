import mongoose, { Schema } from "mongoose";
import { IPreorder } from "../../domain/models/interfaces/IPreorder";

const PreorderSchema = new Schema<IPreorder>({
    userId: { type: String, required: true },
    products: [{
        productId: { type: String, required: true },
        name: { type: String, required: true },
        description: { type: String },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        categoryId: { type: String, required: true },
        categoryName: { type: String }
    }],
    shippingAddress: {
        country: { type: String, required: true },
        state: { type: String, required: true },
        city: { type: String, required: true },
        neighborhood: { type: String, required: true },
        address: { type: String, required: true },
        postalCode: { type: String, required: true }
    },
    paymentMethod: { type: String, required: true },
    shippingCost: { type: Number, required: true },
    total: { type: Number, required: true },
    status: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const PreorderModel = mongoose.model<IPreorder>('Preorder', PreorderSchema);