import { IOrder } from "../models/interfaces/IOrder";

export class Order implements IOrder {
    _id?: string;
    orderNumber: string;
    preorderId: string;
    userId: string;
    products: IOrder['products'];
    shippingAddress: IOrder['shippingAddress'];
    paymentMethod: string;
    shippingCost: number;
    total: number;
    status: IOrder['status'];
    createdAt: Date;
    updatedAt: Date;
    confirmedAt?: Date;
    emailSent: boolean;

    constructor(order: IOrder & { id?: string }) {
        this._id = order._id;
        this.orderNumber = order.orderNumber;
        this.preorderId = order.preorderId;
        this.userId = order.userId;
        this.products = order.products;
        this.shippingAddress = order.shippingAddress;
        this.paymentMethod = order.paymentMethod;
        this.shippingCost = order.shippingCost;
        this.total = order.total;
        this.status = order.status;
        this.createdAt = order.createdAt;
        this.updatedAt = order.updatedAt;
        this.confirmedAt = order.confirmedAt;
        this.emailSent = order.emailSent || false;
    }
}
