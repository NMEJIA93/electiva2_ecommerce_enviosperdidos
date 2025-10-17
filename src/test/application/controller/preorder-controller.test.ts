import { createRequest, createResponse } from 'node-mocks-http';
import { createdCheckoutOrder, confirmPreorder } from '../../../application/controllers/preorder-controller';

jest.mock('../../../domain/services/preorder-services', () => ({
    savePreOrder: jest.fn(),
    confirmPreOrder: jest.fn()
}));

jest.mock('../../../infraestructure/repositories/mongo-preorden', () => ({
    MongoPreorderRepository: jest.fn().mockImplementation(() => ({}))
}));

jest.mock('../../../infraestructure/repositories/mongo-inventory', () => ({
    MongoInventoryRepository: jest.fn().mockImplementation(() => ({}))
}));

jest.mock('../../../infraestructure/repositories/mongo-order', () => ({
    MongoOrderRepository: jest.fn().mockImplementation(() => ({}))
}));

jest.mock('../../../infraestructure/services/nodemailer-email', () => ({
    NodemailerEmailService: jest.fn().mockImplementation(() => ({
        sendOrderConfirmationEmail: jest.fn(() => Promise.resolve(true))
    }))
}));

jest.mock('../../../application/dtos/order-dtos', () => ({
    buildOrderResponse: jest.fn((order) => order)
}));

jest.mock('../../../application/dtos/preorder-dtos', () => ({
    buildPreOrder: jest.fn((data) => data)
}));

describe('Preorder Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createdCheckoutOrder', () => {
        it('should create preorder successfully', async () => {
            const { savePreOrder } = require('../../../domain/services/preorder-services');
            const mockPreorder = { _id: '123', userId: 'user1', status: 'PENDING' };
            savePreOrder.mockResolvedValue(mockPreorder);

            const request = createRequest({
                params: { userId: 'user1' },
                body: {
                    products: [{ productId: 'prod1', quantity: 2, price: 50 }],
                    shippingAddress: {
                        country: 'Colombia',
                        state: 'Antioquia',
                        city: 'Medellin',
                        neighborhood: 'Poblado',
                        address: 'Calle 123',
                        postalCode: '050001'
                    },
                    paymentMethod: 'credit_card'
                }
            });
            const response = createResponse();

            await createdCheckoutOrder(request, response);

            expect(response.statusCode).toBe(201);
            const data = response._getJSONData();
            expect(data.ok).toBe(true);
            expect(data.order).toEqual(mockPreorder);
        });

        it('should return 500 on service error', async () => {
            const { savePreOrder } = require('../../../domain/services/preorder-services');
            savePreOrder.mockRejectedValue(new Error('Service error'));

            const request = createRequest({
                params: { userId: 'user1' },
                body: { products: [] }
            });
            const response = createResponse();

            await createdCheckoutOrder(request, response);

            expect(response.statusCode).toBe(500);
        });
    });

    describe('confirmPreorder', () => {
        it('should confirm preorder successfully', async () => {
            const { confirmPreOrder } = require('../../../domain/services/preorder-services');
            const mockResult = {
                preorder: { _id: 'pre1', status: 'CONFIRMED' },
                order: { _id: 'ord1', orderNumber: 'ORD-001' }
            };
            confirmPreOrder.mockResolvedValue(mockResult);

            const request = createRequest({
                params: { preorderId: 'pre1' },
                body: { emailNotification: 'test@example.com' }
            });
            const response = createResponse();

            await confirmPreorder(request, response);

            expect(response.statusCode).toBe(200);
            const data = response._getJSONData();
            expect(data.ok).toBe(true);
            expect(data.preorder).toEqual(mockResult.preorder);
        });

        it('should return 400 when preorderId is missing', async () => {
            const request = createRequest({
                params: {},
                body: { emailNotification: 'test@example.com' }
            });
            const response = createResponse();

            await confirmPreorder(request, response);

            expect(response.statusCode).toBe(400);
        });

        it('should return 404 when preorder not found', async () => {
            const { confirmPreOrder } = require('../../../domain/services/preorder-services');
            confirmPreOrder.mockRejectedValue(new Error('Preorder not found'));

            const request = createRequest({
                params: { preorderId: 'nonexistent' },
                body: { emailNotification: 'test@example.com' }
            });
            const response = createResponse();

            await confirmPreorder(request, response);

            expect(response.statusCode).toBe(404);
        });

        it('should return 400 when cannot confirm preorder', async () => {
            const { confirmPreOrder } = require('../../../domain/services/preorder-services');
            confirmPreOrder.mockRejectedValue(new Error('Cannot confirm preorder'));

            const request = createRequest({
                params: { preorderId: 'pre1' },
                body: { emailNotification: 'test@example.com' }
            });
            const response = createResponse();

            await confirmPreorder(request, response);

            expect(response.statusCode).toBe(400);
        });

        it('should return 400 when insufficient stock', async () => {
            const { confirmPreOrder } = require('../../../domain/services/preorder-services');
            confirmPreOrder.mockRejectedValue(new Error('Insufficient stock'));

            const request = createRequest({
                params: { preorderId: 'pre1' },
                body: { emailNotification: 'test@example.com' }
            });
            const response = createResponse();

            await confirmPreorder(request, response);

            expect(response.statusCode).toBe(400);
        });

        it('should return 500 on unexpected error', async () => {
            const { confirmPreOrder } = require('../../../domain/services/preorder-services');
            confirmPreOrder.mockRejectedValue(new Error('Unexpected error'));

            const request = createRequest({
                params: { preorderId: 'pre1' },
                body: { emailNotification: 'test@example.com' }
            });
            const response = createResponse();

            await confirmPreorder(request, response);

            expect(response.statusCode).toBe(500);
            const data = response._getJSONData();
            expect(data.ok).toBe(false);
            expect(data.message).toBe('Internal server error');
        });

        it('should skip email when no email provided', async () => {
            const { confirmPreOrder } = require('../../../domain/services/preorder-services');
            const mockResult = {
                preorder: { _id: 'pre1', status: 'CONFIRMED' },
                order: { _id: 'ord1', orderNumber: 'ORD-001' }
            };
            confirmPreOrder.mockResolvedValue(mockResult);

            const request = createRequest({
                params: { preorderId: 'pre1' },
                body: {}
            });
            const response = createResponse();

            await confirmPreorder(request, response);

            expect(response.statusCode).toBe(200);
            const data = response._getJSONData();
            expect(data.emailSent).toBe(false);
        });
    });
});