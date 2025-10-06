import { PreOrderStatus } from "../../../application/dtos/preorder-dtos";

export interface IPreorder {
    _id?: string;
    userId: string;
    products: { productId: string; quantity: number }[];
    shippingAddress: {
        country: string;
        state: string;
        city: string;
        neighborhood: string;
        address: string;
        postalCode: string;
    };
    paymentMethod: string;
    shippingCost: number;
    total: number;
    status: PreOrderStatus;
    createdAt: Date;
    updatedAt: Date;
}