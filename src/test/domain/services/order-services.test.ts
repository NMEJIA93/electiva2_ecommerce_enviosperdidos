import {
    createOrderFromPreorder,
    confirmOrder,
    getOrderById,
    getOrderByNumber,
    getUserOrders
} from '../../../domain/services/order-services';
import { IOrderRepository } from '../../../domain/repositories/IOrder-repository';
import { IInventoryRepository } from '../../../domain/repositories/IInventory-repository';
import { Order } from '../../../domain/entities/Order';
import { OrderStatus } from '../../../domain/models/interfaces/IOrder';

jest.mock('../../../domain/business-rules/order-rules', () => ({
    generateOrderNumber: jest.fn(() => Promise.resolve('ORD-001')),
    validateOrderStock: jest.fn(() => Promise.resolve()),
    deductInventoryStock: jest.fn(() => Promise.resolve()),
    validateOrderData: jest.fn(() => true)
}));

describe('Order Services', () => {
    let mockOrderRepo: jest.Mocked<IOrderRepository>;
    let mockInventoryRepo: jest.Mocked<IInventoryRepository>;

    beforeEach(() => {
        jest.clearAllMocks();
        
        mockOrderRepo = {
            save: jest.fn(),
            findById: jest.fn(),
            findByOrderNumber: jest.fn(),
            findByUserId: jest.fn(),
            findByPreorderId: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findAll: jest.fn()
        } as any;

        mockInventoryRepo = {
            findByProductId: jest.fn(),
            updateStock: jest.fn(),
            save: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        } as any;
    });

    const mockOrderData = {
        orderNumber: 'ORD-001',
        preorderId: 'pre-123',
        userId: 'user-456',
        products: [
            { 
                productId: 'prod-1', 
                name: 'Product 1',
                quantity: 2, 
                price: 50,
                categoryId: 'cat-1',
                categoryName: 'Electronics'
            },
            { 
                productId: 'prod-2', 
                name: 'Product 2',
                quantity: 1, 
                price: 100,
                categoryId: 'cat-2',
                categoryName: 'Clothing'
            }
        ],
        shippingAddress: {
            country: 'Colombia',
            state: 'Antioquia',
            city: 'Medellin',
            neighborhood: 'Poblado',
            address: 'Calle 123',
            postalCode: '050001'
        },
        paymentMethod: 'credit_card',
        shippingCost: 10000,
        total: 200000,
        status: OrderStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
        emailSent: false
    };

    describe('createOrderFromPreorder', () => {
        it('should create order successfully', async () => {
            mockOrderRepo.findByPreorderId.mockResolvedValue(null);
            const mockSavedOrder = new Order(mockOrderData);
            mockOrderRepo.save.mockResolvedValue(mockSavedOrder);

            const result = await createOrderFromPreorder(mockOrderRepo, mockInventoryRepo, mockOrderData as any);

            expect(result).toEqual(mockSavedOrder);
            expect(mockOrderRepo.findByPreorderId).toHaveBeenCalledWith('pre-123');
            expect(mockOrderRepo.save).toHaveBeenCalled();
        });

        it('should throw error when order already exists for preorder', async () => {
            const existingOrder = new Order(mockOrderData);
            mockOrderRepo.findByPreorderId.mockResolvedValue(existingOrder);

            await expect(createOrderFromPreorder(mockOrderRepo, mockInventoryRepo, mockOrderData as any))
                .rejects.toThrow('Order already exists for preorder pre-123');
        });

        it('should throw error when stock validation fails', async () => {
            mockOrderRepo.findByPreorderId.mockResolvedValue(null);
            const { validateOrderStock } = require('../../../domain/business-rules/order-rules');
            validateOrderStock.mockRejectedValue(new Error('Insufficient stock'));

            await expect(createOrderFromPreorder(mockOrderRepo, mockInventoryRepo, mockOrderData as any))
                .rejects.toThrow('[ERROR TO SERVICE] - Error creating order');
        });

        it('should throw error when save fails', async () => {
            mockOrderRepo.findByPreorderId.mockResolvedValue(null);
            mockOrderRepo.save.mockRejectedValue(new Error('Database error'));

            await expect(createOrderFromPreorder(mockOrderRepo, mockInventoryRepo, mockOrderData as any))
                .rejects.toThrow('[ERROR TO SERVICE] - Error creating order');
        });
    });

    describe('confirmOrder', () => {
        const mockPendingOrder = new Order({
            ...mockOrderData,
            _id: 'order-123'
        });

        it('should confirm order successfully', async () => {
            mockOrderRepo.findById.mockResolvedValue(mockPendingOrder);
            const mockConfirmedOrder = new Order({
                ...mockOrderData,
                status: OrderStatus.CONFIRMED,
                confirmedAt: new Date()
            });
            mockOrderRepo.update.mockResolvedValue(mockConfirmedOrder);

            const result = await confirmOrder(mockOrderRepo, 'order-123');

            expect(result).toEqual(mockConfirmedOrder);
            expect(mockOrderRepo.findById).toHaveBeenCalledWith('order-123');
            expect(mockOrderRepo.update).toHaveBeenCalled();
        });

        it('should throw error when order not found', async () => {
            mockOrderRepo.findById.mockResolvedValue(null);

            await expect(confirmOrder(mockOrderRepo, 'nonexistent'))
                .rejects.toThrow('Order not found');
        });

        it('should throw error when order is not pending', async () => {
            const confirmedOrder = new Order({
                ...mockOrderData,
                status: OrderStatus.CONFIRMED
            });
            mockOrderRepo.findById.mockResolvedValue(confirmedOrder);

            await expect(confirmOrder(mockOrderRepo, 'order-123'))
                .rejects.toThrow('Cannot confirm order with status: CONFIRMED');
        });

        it('should throw error when update fails', async () => {
            mockOrderRepo.findById.mockResolvedValue(mockPendingOrder);
            mockOrderRepo.update.mockResolvedValue(null);

            await expect(confirmOrder(mockOrderRepo, 'order-123'))
                .rejects.toThrow('Failed to update order');
        });
    });

    describe('getOrderById', () => {
        it('should return order when found', async () => {
            const mockOrder = new Order(mockOrderData);
            mockOrderRepo.findById.mockResolvedValue(mockOrder);

            const result = await getOrderById(mockOrderRepo, 'order-123');

            expect(result).toEqual(mockOrder);
            expect(mockOrderRepo.findById).toHaveBeenCalledWith('order-123');
        });

        it('should return null when order not found', async () => {
            mockOrderRepo.findById.mockResolvedValue(null);

            const result = await getOrderById(mockOrderRepo, 'nonexistent');

            expect(result).toBeNull();
        });

        it('should throw error when repository fails', async () => {
            mockOrderRepo.findById.mockRejectedValue(new Error('Database error'));

            await expect(getOrderById(mockOrderRepo, 'order-123'))
                .rejects.toThrow('[ERROR TO SERVICE] - Error getting order');
        });
    });

    describe('getOrderByNumber', () => {
        it('should return order when found by number', async () => {
            const mockOrder = new Order(mockOrderData);
            mockOrderRepo.findByOrderNumber.mockResolvedValue(mockOrder);

            const result = await getOrderByNumber(mockOrderRepo, 'ORD-001');

            expect(result).toEqual(mockOrder);
            expect(mockOrderRepo.findByOrderNumber).toHaveBeenCalledWith('ORD-001');
        });

        it('should return null when order not found', async () => {
            mockOrderRepo.findByOrderNumber.mockResolvedValue(null);

            const result = await getOrderByNumber(mockOrderRepo, 'ORD-999');

            expect(result).toBeNull();
        });
    });

    describe('getUserOrders', () => {
        it('should return user orders', async () => {
            const mockOrders = [
                new Order(mockOrderData),
                new Order({ ...mockOrderData, orderNumber: 'ORD-002' })
            ];
            mockOrderRepo.findByUserId.mockResolvedValue(mockOrders);

            const result = await getUserOrders(mockOrderRepo, 'user-456');

            expect(result).toEqual(mockOrders);
            expect(mockOrderRepo.findByUserId).toHaveBeenCalledWith('user-456');
        });

        it('should return empty array when no orders found', async () => {
            mockOrderRepo.findByUserId.mockResolvedValue([]);

            const result = await getUserOrders(mockOrderRepo, 'user-999');

            expect(result).toEqual([]);
        });

        it('should throw error when repository fails', async () => {
            mockOrderRepo.findByUserId.mockRejectedValue(new Error('Database error'));

            await expect(getUserOrders(mockOrderRepo, 'user-456'))
                .rejects.toThrow('[ERROR TO SERVICE] - Error getting user orders');
        });
    });
});