import { PreOrderStatus } from "../../../application/dtos/preorder-dtos";



export interface IPreorderProduct {
    productId: string;
    name: string;
    description?: string;
    quantity: number;
    price: number;
    categoryId: string;
    categoryName?: string;
}
export interface  IShippingAddress {
        country: string;
        state: string;
        city: string;
        neighborhood: string;
        address: string;
        postalCode: string;
    }

export interface IPreorder {
    _id?: string;
    userId: string;
    products: IPreorderProduct[]; 
    shippingAddress: IShippingAddress;
    paymentMethod: string;
    shippingCost: number;
    total: number;
    status: PreOrderStatus;
    createdAt: Date;
    updatedAt: Date;
}