import { savePreOrder, confirmPreOrder } from '../../../domain/services/preorder-services';
import { IPreorderRepository } from '../../../domain/repositories/IPreorder-repository';
import { IInventoryRepository } from '../../../domain/repositories/IInventory-repository';
import { IOrderRepository } from '../../../domain/repositories/IOrder-repository';
import { Preorder } from '../../../domain/entities/Preorder';
import { Order } from '../../../domain/entities/Order';
import { PreOrderStatus } from '../../../application/dtos/preorder-dtos';

jest.mock('../../../domain/business-rules/preorder-rules', () => ({
    validateStock: jest.fn(() => Promise.resolve()),
    validateshippingAddress: jest.fn(() => true),
    isFreeShipping: jest.fn(() => false)
}));

jest.mock('../../../domain/services/order-services', () => ({
    createOrderFromPreorder: jest.fn()
}));

describe('Preorder Services', () => {
    let mockPreorderRepo: jest.Mocked<IPreorderRepository>;
    let mockInventoryRepo: jest.Mocked<IInventoryRepository>;
    let mockOrderRepo: jest.Mocked<IOrderRepository>;

    beforeEach(() => {
        jest.clearAllMocks();
        
        mockPreorderRepo = {
            save: jest.fn(),
            findById: jest.fn(),
            update: jest.fn()
        } as any;

        mockInventoryRepo = {
            getInventoryByProductId: jest.fn()
        } as any;

        mockOrderRepo = {
            save: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findByOrderNumber: jest.fn(),
            findByUserId: jest.fn(),
            findByPreorderId: jest.fn()
        } as any;
    });

    const mockPreorderData = {
        userId: 'user1',
        products: [
            { productId: 'prod1', name: 'Product 1', quantity: 2, price: 50, categoryId: 'cat1' }
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
        total: 110000,
        status: PreOrderStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    describe('savePreOrder', () => {
        it('should save preorder successfully', async () => {
            const mockSavedPreorder = new Preorder(mockPreorderData);
            mockPreorderRepo.save.mockResolvedValue(mockSavedPreorder);

            const result = await savePreOrder(mockPreorderRepo, mockPreorderData, mockInventoryRepo);

            expect(result).toEqual(mockSavedPreorder);
            expect(mockPreorderRepo.save).toHaveBeenCalledWith(expect.any(Preorder));
        });

        it('should throw error when stock validation fails', async () => {
            const { validateStock } = require('../../../domain/business-rules/preorder-rules');
            validateStock.mockRejectedValue(new Error('Insufficient stock'));

            await expect(savePreOrder(mockPreorderRepo, mockPreorderData, mockInventoryRepo))
                .rejects.toThrow('[ERROR TO SERVICE] - Error saving preorder');
        });

        it('should apply free shipping for orders over 50000', async () => {
            const { isFreeShipping, validateStock } = require('../../../domain/business-rules/preorder-rules');
            validateStock.mockResolvedValue(); // Reset mock to resolve
            isFreeShipping.mockReturnValue(true);

            const highValueOrder = {
                ...mockPreorderData,
                products: [{ productId: 'prod1', name: 'Product 1', quantity: 1, price: 60000, categoryId: 'cat1' }]
            };

            const mockSavedPreorder = new Preorder({ ...highValueOrder, shippingCost: 0 });
            mockPreorderRepo.save.mockResolvedValue(mockSavedPreorder);

            const result = await savePreOrder(mockPreorderRepo, highValueOrder, mockInventoryRepo);

            expect(result.shippingCost).toBe(0);
        });
    });

    describe('confirmPreOrder', () => {
        const mockPendingPreorder = new Preorder({
            ...mockPreorderData,
            _id: 'pre1',
            status: PreOrderStatus.PENDING
        });

        it('should confirm preorder successfully', async () => {
            const { validateStock } = require('../../../domain/business-rules/preorder-rules');
            validateStock.mockResolvedValue(); // Reset mock to resolve
            
            mockPreorderRepo.findById.mockResolvedValue(mockPendingPreorder);
            
            const { createOrderFromPreorder } = require('../../../domain/services/order-services');
            const mockOrder = new Order({
                preorderId: 'pre1',
                userId: 'user1',
                products: mockPreorderData.products,
                shippingAddress: mockPreorderData.shippingAddress,
                paymentMethod: mockPreorderData.paymentMethod,
                shippingCost: mockPreorderData.shippingCost,
                total: mockPreorderData.total,
                orderNumber: 'ORD-001',
                status: 'PENDING' as any,
                createdAt: new Date(),
                updatedAt: new Date(),
                emailSent: true
            });
            createOrderFromPreorder.mockResolvedValue(mockOrder);

            const mockConfirmedPreorder = new Preorder({
                ...mockPendingPreorder,
                status: PreOrderStatus.CONFIRMED
            });
            mockPreorderRepo.update.mockResolvedValue(mockConfirmedPreorder);

            const result = await confirmPreOrder(mockPreorderRepo, 'pre1', mockOrderRepo, mockInventoryRepo);

            expect(result.preorder).toEqual(mockConfirmedPreorder);
            expect(result.order).toEqual(mockOrder);
        });

        it('should throw error when preorder not found', async () => {
            mockPreorderRepo.findById.mockResolvedValue(null);

            await expect(confirmPreOrder(mockPreorderRepo, 'nonexistent', mockOrderRepo, mockInventoryRepo))
                .rejects.toThrow('Preorder not found');
        });

        it('should throw error when preorder is not pending', async () => {
            const confirmedPreorder = new Preorder({
                ...mockPendingPreorder,
                status: PreOrderStatus.CONFIRMED
            });
            mockPreorderRepo.findById.mockResolvedValue(confirmedPreorder);

            await expect(confirmPreOrder(mockPreorderRepo, 'pre1', mockOrderRepo, mockInventoryRepo))
                .rejects.toThrow('Cannot confirm preorder with status: CONFIRMED');
        });
    });
});