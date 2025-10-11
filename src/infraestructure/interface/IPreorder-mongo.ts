// src/infraestructure/interface/IPreorder-mongo.ts
import { Document } from 'mongoose';
import { PreOrderStatus } from '../../application/dtos/preorder-dtos';

export interface IPreorderProductDocument {
    productId: string;
    name: string;
    description?: string;
    quantity: number;
    price: number;
    categoryId: string;
    categoryName?: string;
}

export interface IShippingAddressDocument {
    country: string;
    state: string;
    city: string;
    neighborhood: string;
    address: string;
    postalCode: string;
}

export interface IPreorderDocument extends Document {
    userId: string;
    products: IPreorderProductDocument[];
    shippingAddress: IShippingAddressDocument;
    paymentMethod: string;
    shippingCost: number;
    total: number;
    status: PreOrderStatus;
    createdAt: Date;
    updatedAt: Date;
}