import { IPreorder,IPreorderProduct } from "../models/interfaces/IPreorder";

export class Preorder implements IPreorder {
    _id?: string;
    userId: string;
    products: IPreorderProduct[];
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
    status: IPreorder['status'];
    createdAt: Date;
    updatedAt: Date;
    constructor(preorder: IPreorder & { id?: string }) {
        this._id = preorder._id;
        this.userId = preorder.userId;
        this.products = preorder.products;
        this.shippingAddress = preorder.shippingAddress;
        this.paymentMethod = preorder.paymentMethod;
        this.shippingCost = preorder.shippingCost;
        this.total = preorder.total;
        this.status = preorder.status;
        this.createdAt = preorder.createdAt;
        this.updatedAt = preorder.updatedAt;
    }
}
