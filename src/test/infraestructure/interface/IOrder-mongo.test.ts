import { IOrderMongo, IOrderProductDocument, IOrderShippingAddressDocument } from '../../../infraestructure/interface/IOrder-mongo';
import { OrderStatus } from '../../../domain/models/interfaces/IOrder';

describe('IOrderMongo Interface', () => {
    it('should validate order interface structure', () => {
        const orderData = {
            orderNumber: 'ORD-001',
            preorderId: 'PRE-001',
            userId: '507f1f77bcf86cd799439011',
            products: [],
            shippingAddress: {
                country: 'Colombia',
                state: 'Cundinamarca',
                city: 'Bogotá',
                neighborhood: 'Centro',
                address: 'Calle 123',
                postalCode: '110111'
            },
            paymentMethod: 'credit_card',
            shippingCost: 0,
            total: 200,
            status: OrderStatus.PENDING,
            createdAt: new Date(),
            updatedAt: new Date(),
            emailSent: false
        };

        expect(orderData).toHaveProperty('orderNumber');
        expect(orderData).toHaveProperty('userId');
        expect(orderData).toHaveProperty('products');
        expect(orderData).toHaveProperty('shippingAddress');
        expect(orderData).toHaveProperty('total');
        expect(orderData).toHaveProperty('status');
    });

    it('should validate IOrderProductDocument structure', () => {
        const product: IOrderProductDocument = {
            productId: '507f1f77bcf86cd799439012',
            name: 'Test Product',
            description: 'Product description',
            quantity: 2,
            price: 100,
            categoryId: '507f1f77bcf86cd799439013',
            categoryName: 'Electronics'
        };

        expect(product).toHaveProperty('productId');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('quantity');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('categoryId');
        expect(typeof product.quantity).toBe('number');
        expect(typeof product.price).toBe('number');
    });

    it('should validate IOrderShippingAddressDocument structure', () => {
        const address: IOrderShippingAddressDocument = {
            country: 'Colombia',
            state: 'Cundinamarca',
            city: 'Bogotá',
            neighborhood: 'Chapinero',
            address: 'Carrera 15 #85-20',
            postalCode: '110221'
        };

        expect(address).toHaveProperty('country');
        expect(address).toHaveProperty('state');
        expect(address).toHaveProperty('city');
        expect(address).toHaveProperty('address');
        expect(address).toHaveProperty('postalCode');
        expect(typeof address.country).toBe('string');
        expect(typeof address.postalCode).toBe('string');
    });

    it('should validate order status enum', () => {
        const validStatuses = Object.values(OrderStatus);
        const testStatus = OrderStatus.PENDING;

        expect(validStatuses).toContain(testStatus);
        expect(typeof testStatus).toBe('string');
    });

    it('should validate numeric fields', () => {
        const orderData = {
            shippingCost: 15000,
            total: 215000
        };

        expect(orderData.shippingCost).toBeGreaterThanOrEqual(0);
        expect(orderData.total).toBeGreaterThan(0);
        expect(typeof orderData.shippingCost).toBe('number');
        expect(typeof orderData.total).toBe('number');
    });
});