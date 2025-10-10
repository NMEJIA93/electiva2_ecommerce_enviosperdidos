import { IPreorder } from "../../domain/models/interfaces/IPreorder";

export enum PreOrderStatus {
    PENDING = 'PENDING',
    EXPIRED = 'EXPIRED',
    CANCELLED = 'CANCELLED',
    CONFIRMED = 'CONFIRMED',
}

export interface PreOrderProductDTO {
    productId: string;
    name: string;
    description?: string;
    quantity: number;
    price: number;
    categoryId: string;
    categoryName?: string;
}

export interface PreOrderShippingAddressDTO {
    country: string;
    state: string;
    city: string;
    neighborhood: string;
    address: string;
    postalCode: string;
}

export interface PreOrderRequestDTO {
    userId: string;
    products: PreOrderProductDTO[];
    shippingAddress: PreOrderShippingAddressDTO;
    paymentMethod: string;
}

export interface PreOrderResponseDTO {
    id?: string;
    userId: string;
    products: PreOrderProductDTO[];
    shippingAddress: PreOrderShippingAddressDTO;
    paymentMethod: string;
    shippingCost: number;
    total: number;
    status: PreOrderStatus;
    createdAt: Date;
    updatedAt: Date;
}

export function buildPreOrder(dto: PreOrderRequestDTO): IPreorder {
    return {
        userId: dto.userId,
        products: dto.products,
        shippingAddress: dto.shippingAddress,
        paymentMethod: dto.paymentMethod,
        shippingCost: 0,
        total: 0,
        status: PreOrderStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
