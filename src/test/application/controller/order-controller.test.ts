import { createRequest, createResponse } from 'node-mocks-http';
import {
    createOrder,
    confirmOrderController,
    getOrderByIdController,
    getOrderByNumberController,
    getUserOrdersController
} from '../../../application/controllers/order-controller';

jest.mock('../../../domain/services/order-services', () => ({
    createOrderFromPreorder: jest.fn(),
    confirmOrder: jest.fn(),
    getOrderById: jest.fn(),
    getOrderByNumber: jest.fn(),
    getUserOrders: jest.fn()
}));

jest.mock('../../../infraestructure/repositories/mongo-order', () => ({
    MongoOrderRepository: jest.fn().mockImplementation(() => ({}))
}));

jest.mock('../../../infraestructure/repositories/mongo-inventory', () => ({
    MongoInventoryRepository: jest.fn().mockImplementation(() => ({}))
}));

jest.mock('../../../infraestructure/services/nodemailer-email', () => ({
    NodemailerEmailService: jest.fn().mockImplementation(() => ({
        sendOrderConfirmationEmail: jest.fn(() => Promise.resolve(true))
    }))
}));

describe('Order Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createOrder', () => {
        it('should create order successfully', async () => {
            const { createOrderFromPreorder } = require('../../../domain/services/order-services');
            const mockOrder = {
                _id: '123',
                orderNumber: 'ORD-001',
                userId: 'user1',
                status: 'PENDING'
            };
            createOrderFromPreorder.mockResolvedValue(mockOrder);

            const request = createRequest({
                body: {
                    preorderId: 'pre1',
                    userId: 'user1',
                    products: [{ productId: 'prod1', quantity: 2 }],
                    emailNotification: 'test@example.com'
                }
            });
            const response = createResponse();

            await createOrder(request, response);

            expect(response.statusCode).toBe(201);
            const data = response._getJSONData();
            expect(data.ok).toBe(true);
            expect(data.message).toBe('Order created successfully');
        });

        it('should return 409 when order already exists', async () => {
            const { createOrderFromPreorder } = require('../../../domain/services/order-services');
            createOrderFromPreorder.mockRejectedValue(new Error('Order already exists for this preorder'));

            const request = createRequest({
                body: { preorderId: 'pre1', userId: 'user1' }
            });
            const response = createResponse();

            await createOrder(request, response);

            expect(response.statusCode).toBe(409);
        });

        it('should return 400 on insufficient stock', async () => {
            const { createOrderFromPreorder } = require('../../../domain/services/order-services');
            createOrderFromPreorder.mockRejectedValue(new Error('Insufficient stock for product'));

            const request = createRequest({
                body: { preorderId: 'pre1', userId: 'user1' }
            });
            const response = createResponse();

            await createOrder(request, response);

            expect(response.statusCode).toBe(400);
        });
    });

    describe('confirmOrderController', () => {
        it('should confirm order successfully', async () => {
            const { confirmOrder } = require('../../../domain/services/order-services');
            const mockOrder = {
                _id: '123',
                orderNumber: 'ORD-001',
                status: 'CONFIRMED'
            };
            confirmOrder.mockResolvedValue(mockOrder);

            const request = createRequest({
                params: { orderId: '123' },
                body: { userEmail: 'test@example.com' }
            });
            const response = createResponse();

            await confirmOrderController(request, response);

            expect(response.statusCode).toBe(200);
            const data = response._getJSONData();
            expect(data.ok).toBe(true);
            expect(data.message).toBe('Order confirmed successfully');
        });

        it('should return 400 when orderId is missing', async () => {
            const request = createRequest({
                params: {},
                body: { userEmail: 'test@example.com' }
            });
            const response = createResponse();

            await confirmOrderController(request, response);

            expect(response.statusCode).toBe(400);
        });

        it('should return 400 when userEmail is missing', async () => {
            const request = createRequest({
                params: { orderId: '123' },
                body: {}
            });
            const response = createResponse();

            await confirmOrderController(request, response);

            expect(response.statusCode).toBe(400);
        });

        it('should return 404 when order not found', async () => {
            const { confirmOrder } = require('../../../domain/services/order-services');
            confirmOrder.mockRejectedValue(new Error('Order not found'));

            const request = createRequest({
                params: { orderId: '999' },
                body: { userEmail: 'test@example.com' }
            });
            const response = createResponse();

            await confirmOrderController(request, response);

            expect(response.statusCode).toBe(404);
        });
    });

    describe('getOrderByIdController', () => {
        it('should return order by id', async () => {
            const { getOrderById } = require('../../../domain/services/order-services');
            const mockOrder = { _id: '123', orderNumber: 'ORD-001' };
            getOrderById.mockResolvedValue(mockOrder);

            const request = createRequest({
                params: { orderId: '123' }
            });
            const response = createResponse();

            await getOrderByIdController(request, response);

            expect(response.statusCode).toBe(200);
            const data = response._getJSONData();
            expect(data.ok).toBe(true);
        });

        it('should return 404 when order not found', async () => {
            const { getOrderById } = require('../../../domain/services/order-services');
            getOrderById.mockResolvedValue(null);

            const request = createRequest({
                params: { orderId: '999' }
            });
            const response = createResponse();

            await getOrderByIdController(request, response);

            expect(response.statusCode).toBe(404);
        });
    });

    describe('getOrderByNumberController', () => {
        it('should return order by number', async () => {
            const { getOrderByNumber } = require('../../../domain/services/order-services');
            const mockOrder = { _id: '123', orderNumber: 'ORD-001' };
            getOrderByNumber.mockResolvedValue(mockOrder);

            const request = createRequest({
                params: { orderNumber: 'ORD-001' }
            });
            const response = createResponse();

            await getOrderByNumberController(request, response);

            expect(response.statusCode).toBe(200);
        });
    });

    describe('getUserOrdersController', () => {
        it('should return user orders', async () => {
            const { getUserOrders } = require('../../../domain/services/order-services');
            const mockOrders = [
                { _id: '1', orderNumber: 'ORD-001' },
                { _id: '2', orderNumber: 'ORD-002' }
            ];
            getUserOrders.mockResolvedValue(mockOrders);

            const request = createRequest({
                params: { userId: 'user1' }
            });
            const response = createResponse();

            await getUserOrdersController(request, response);

            expect(response.statusCode).toBe(200);
            const data = response._getJSONData();
            expect(data.orders).toHaveLength(2);
        });
    });
});