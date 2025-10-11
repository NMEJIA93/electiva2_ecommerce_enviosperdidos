import { IOrder, OrderStatus } from "../../domain/models/interfaces/IOrder";

export interface OrderRequestDTO {
    preorderId: string;
    userId: string;
    products: IOrder['products'];
    shippingAddress: IOrder['shippingAddress'];
    paymentMethod: string;
    shippingCost: number;
    total: number;
}

export interface OrderResponseDTO {
    id?: string;
    orderNumber: string;
    preorderId: string;
    userId: string;
    products: IOrder['products'];
    shippingAddress: IOrder['shippingAddress'];
    paymentMethod: string;
    shippingCost: number;
    total: number;
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
    confirmedAt?: Date;
    emailSent: boolean;
}

export function buildOrderRequest(dto: OrderRequestDTO): IOrder {
    return {
        orderNumber: '', // Will be generated in service
        preorderId: dto.preorderId,
        userId: dto.userId,
        products: dto.products,
        shippingAddress: dto.shippingAddress,
        paymentMethod: dto.paymentMethod,
        shippingCost: dto.shippingCost,
        total: dto.total,
        status: OrderStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
        emailSent: false
    };
}

export function buildOrderResponse(order: any): OrderResponseDTO {
    return {
        id: order._id || order.id,
        orderNumber: order.orderNumber,
        preorderId: order.preorderId,
        userId: order.userId,
        products: order.products,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        shippingCost: order.shippingCost,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        confirmedAt: order.confirmedAt,
        emailSent: order.emailSent
    };
}
