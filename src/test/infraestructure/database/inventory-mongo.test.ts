import mongoose from 'mongoose';

jest.mock('mongoose', () => ({
    model: jest.fn(),
    Schema: jest.fn().mockImplementation(() => ({}))
}));

jest.mock('../../../infraestructure/database/inventory-mongo', () => ({
    InventoryModel: {
        create: jest.fn(),
        findOne: jest.fn(),
        findById: jest.fn(),
        find: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findOneAndUpdate: jest.fn(),
        save: jest.fn()
    }
}));

describe('InventoryModel', () => {
    let InventoryModel: any;

    beforeEach(async () => {
        jest.clearAllMocks();
        const inventoryModule = await import('../../../infraestructure/database/inventory-mongo');
        InventoryModel = inventoryModule.InventoryModel;
    });

    describe('create', () => {
        it('should create inventory successfully', async () => {
            const inventoryData = {
                productId: '507f1f77bcf86cd799439011',
                price: 100,
                stock: 50,
                reservedStock: 0,
                reservations: []
            };
            const mockInventory = { _id: '507f1f77bcf86cd799439012', ...inventoryData };
            
            InventoryModel.create.mockResolvedValue(mockInventory);
            
            const result = await InventoryModel.create(inventoryData);
            
            expect(InventoryModel.create).toHaveBeenCalledWith(inventoryData);
            expect(result).toEqual(mockInventory);
        });
    });

    describe('findOne', () => {
        it('should find inventory by productId', async () => {
            const productId = '507f1f77bcf86cd799439011';
            const mockInventory = {
                _id: '507f1f77bcf86cd799439012',
                productId,
                price: 100,
                stock: 50,
                reservedStock: 5,
                reservations: []
            };
            
            InventoryModel.findOne.mockResolvedValue(mockInventory);
            
            const result = await InventoryModel.findOne({ productId });
            
            expect(InventoryModel.findOne).toHaveBeenCalledWith({ productId });
            expect(result).toEqual(mockInventory);
        });
    });

    describe('findOneAndUpdate', () => {
        it('should update inventory stock', async () => {
            const productId = '507f1f77bcf86cd799439011';
            const updateData = { stock: 45, reservedStock: 10 };
            const mockUpdatedInventory = {
                _id: '507f1f77bcf86cd799439012',
                productId,
                ...updateData
            };
            
            InventoryModel.findOneAndUpdate.mockResolvedValue(mockUpdatedInventory);
            
            const result = await InventoryModel.findOneAndUpdate(
                { productId },
                updateData,
                { new: true }
            );
            
            expect(InventoryModel.findOneAndUpdate).toHaveBeenCalledWith(
                { productId },
                updateData,
                { new: true }
            );
            expect(result).toEqual(mockUpdatedInventory);
        });
    });

    describe('find with reservations cleanup', () => {
        it('should find inventories with expired reservations', async () => {
            const expiredDate = new Date(Date.now() - 25 * 60 * 60 * 1000);
            const mockInventories = [{
                _id: '507f1f77bcf86cd799439012',
                reservations: [{ createdAt: expiredDate, quantity: 5 }],
                reservedStock: 5,
                save: jest.fn()
            }];
            
            InventoryModel.find.mockResolvedValue(mockInventories);
            
            const result = await InventoryModel.find({
                'reservations.createdAt': { $lt: expect.any(Date) }
            });
            
            expect(InventoryModel.find).toHaveBeenCalled();
            expect(result).toEqual(mockInventories);
        });
    });
});