import { Document } from 'mongoose';
import { OrderStatus } from '../../domain/models/interfaces/IOrder';

export interface IOrderProductDocument {
    productId: string;
    name: string;
    description?: string;
    quantity: number;
    price: number;
    categoryId: string;
    categoryName?: string;
}

export interface IOrderShippingAddressDocument {
    country: string;
    state: string;
    city: string;
    neighborhood: string;
    address: string;
    postalCode: string;
}

export interface IOrderMongo extends Document {
    orderNumber: string;
    preorderId: string;
    userId: string;
    products: IOrderProductDocument[];
    shippingAddress: IOrderShippingAddressDocument;
    paymentMethod: string;
    shippingCost: number;
    total: number;
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
    confirmedAt?: Date;
    emailSent: boolean;
}