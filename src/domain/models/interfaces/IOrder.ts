export enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
    REFUNDED = 'REFUNDED'
}

export interface IOrderProduct {
    productId: string;
    name: string;
    description?: string;
    quantity: number;
    price: number;
    categoryId: string;
    categoryName?: string;
}

export interface IOrderShippingAddress {
    country: string;
    state: string;
    city: string;
    neighborhood: string;
    address: string;
    postalCode: string;
}

export interface IOrder {
    _id?: string;
    orderNumber: string; 
    preorderId: string; 
    userId: string;
    products: IOrderProduct[];
    shippingAddress: IOrderShippingAddress;
    paymentMethod: string;
    shippingCost: number;
    total: number;
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
    confirmedAt?: Date;
    emailSent: boolean;
}
