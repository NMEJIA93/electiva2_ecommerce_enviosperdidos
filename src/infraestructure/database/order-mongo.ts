import mongoose, { Schema } from 'mongoose';
import { IOrderMongo } from '../interface/IOrder-mongo';
import { OrderStatus } from '../../domain/models/interfaces/IOrder';

const OrderSchema = new Schema<IOrderMongo>({
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    preorderId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    products: [{
        productId: { type: String, required: true },
        name: { type: String, required: true },
        description: { type: String },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
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
    shippingCost: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: {
        type: String,
        enum: Object.values(OrderStatus),
        default: OrderStatus.PENDING,
        required: true
    },
    confirmedAt: { type: Date },
    emailSent: { type: Boolean, default: false }
}, {
    timestamps: true,
    collection: 'orders'
});

/*
// Definición única de índices
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ preorderId: 1 });
OrderSchema.index({ userId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });
*/

export const OrderModel = mongoose.model<IOrderMongo>('Order', OrderSchema);