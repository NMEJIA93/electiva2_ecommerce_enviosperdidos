import { IPreorderDocument, IPreorderProductDocument, IShippingAddressDocument } from '../../../infraestructure/interface/IPreorder-mongo';
import { PreOrderStatus } from '../../../application/dtos/preorder-dtos';

describe('IPreorderDocument Interface', () => {
    it('should validate preorder interface structure', () => {
        const preorderData = {
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
            status: PreOrderStatus.PENDING,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        expect(preorderData).toHaveProperty('userId');
        expect(preorderData).toHaveProperty('products');
        expect(preorderData).toHaveProperty('shippingAddress');
        expect(preorderData).toHaveProperty('paymentMethod');
        expect(preorderData).toHaveProperty('total');
        expect(preorderData).toHaveProperty('status');
    });

    it('should validate IPreorderProductDocument structure', () => {
        const product: IPreorderProductDocument = {
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

    it('should validate IShippingAddressDocument structure', () => {
        const address: IShippingAddressDocument = {
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
        expect(address).toHaveProperty('neighborhood');
        expect(address).toHaveProperty('address');
        expect(address).toHaveProperty('postalCode');
    });

    it('should validate preorder status enum', () => {
        const validStatuses = Object.values(PreOrderStatus);
        const testStatus = PreOrderStatus.PENDING;

        expect(validStatuses).toContain(testStatus);
        expect(typeof testStatus).toBe('string');
    });

    it('should validate products array', () => {
        const products: IPreorderProductDocument[] = [
            {
                productId: '507f1f77bcf86cd799439012',
                name: 'Product 1',
                quantity: 1,
                price: 50,
                categoryId: '507f1f77bcf86cd799439013'
            },
            {
                productId: '507f1f77bcf86cd799439014',
                name: 'Product 2',
                quantity: 2,
                price: 75,
                categoryId: '507f1f77bcf86cd799439015'
            }
        ];

        expect(Array.isArray(products)).toBe(true);
        expect(products).toHaveLength(2);
        products.forEach(product => {
            expect(product).toHaveProperty('productId');
            expect(product).toHaveProperty('name');
            expect(product).toHaveProperty('quantity');
            expect(product).toHaveProperty('price');
        });
    });
});