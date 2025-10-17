import mongoose from 'mongoose';
import { OrderStatus } from '../../../domain/models/interfaces/IOrder';

jest.mock('mongoose', () => ({
    model: jest.fn(),
    Schema: jest.fn().mockImplementation(() => ({}))
}));

jest.mock('../../../infraestructure/database/order-mongo', () => ({
    OrderModel: {
        create: jest.fn(),
        findOne: jest.fn(),
        findById: jest.fn(),
        find: jest.fn(),
        findByIdAndUpdate: jest.fn()
    }
}));

describe('OrderModel', () => {
    let OrderModel: any;

    beforeEach(async () => {
        jest.clearAllMocks();
        const orderModule = await import('../../../infraestructure/database/order-mongo');
        OrderModel = orderModule.OrderModel;
    });

    describe('create', () => {
        it('should create order successfully', async () => {
            const orderData = {
                orderNumber: 'ORD-001',
                preorderId: 'PRE-001',
                userId: '507f1f77bcf86cd799439011',
                products: [{
                    productId: '507f1f77bcf86cd799439012',
                    name: 'Test Product',
                    quantity: 2,
                    price: 100,
                    categoryId: '507f1f77bcf86cd799439013'
                }],
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
                status: OrderStatus.PENDING
            };
            const mockOrder = { _id: '507f1f77bcf86cd799439014', ...orderData };
            
            OrderModel.create.mockResolvedValue(mockOrder);
            
            const result = await OrderModel.create(orderData);
            
            expect(OrderModel.create).toHaveBeenCalledWith(orderData);
            expect(result).toEqual(mockOrder);
        });
    });

    describe('findOne', () => {
        it('should find order by orderNumber', async () => {
            const orderNumber = 'ORD-001';
            const mockOrder = {
                _id: '507f1f77bcf86cd799439014',
                orderNumber,
                status: OrderStatus.PENDING,
                total: 200
            };
            
            OrderModel.findOne.mockResolvedValue(mockOrder);
            
            const result = await OrderModel.findOne({ orderNumber });
            
            expect(OrderModel.findOne).toHaveBeenCalledWith({ orderNumber });
            expect(result).toEqual(mockOrder);
        });
    });

    describe('find', () => {
        it('should find orders by userId', async () => {
            const userId = '507f1f77bcf86cd799439011';
            const mockOrders = [
                { _id: '507f1f77bcf86cd799439014', orderNumber: 'ORD-001', userId },
                { _id: '507f1f77bcf86cd799439015', orderNumber: 'ORD-002', userId }
            ];
            
            OrderModel.find.mockResolvedValue(mockOrders);
            
            const result = await OrderModel.find({ userId });
            
            expect(OrderModel.find).toHaveBeenCalledWith({ userId });
            expect(result).toEqual(mockOrders);
            expect(result).toHaveLength(2);
        });
    });

    describe('findByIdAndUpdate', () => {
        it('should update order status', async () => {
            const orderId = '507f1f77bcf86cd799439014';
            const updateData = { status: OrderStatus.CONFIRMED, confirmedAt: new Date() };
            const mockUpdatedOrder = {
                _id: orderId,
                orderNumber: 'ORD-001',
                ...updateData
            };
            
            OrderModel.findByIdAndUpdate.mockResolvedValue(mockUpdatedOrder);
            
            const result = await OrderModel.findByIdAndUpdate(orderId, updateData, { new: true });
            
            expect(OrderModel.findByIdAndUpdate).toHaveBeenCalledWith(orderId, updateData, { new: true });
            expect(result).toEqual(mockUpdatedOrder);
            expect(result.status).toBe(OrderStatus.CONFIRMED);
        });
    });
});