

export enum PreOrderStatus {
    PENDING = 'PENDING',
    EXPIRED = 'EXPIRED',
    CANCELLED = 'CANCELLED',
    CONFIRMED = 'CONFIRMED',
}

export interface PreOrderProductDTO {
    productId: string;
    quantity: number;
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