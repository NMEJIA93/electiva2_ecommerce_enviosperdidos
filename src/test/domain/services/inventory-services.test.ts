import { updateInventoryById, updateReservedStock, findInventoryById } from '../../../domain/services/inventory-services';
import { IInventoryRepository } from '../../../domain/repositories/IInventory-repository';
import { Inventory } from '../../../domain/entities/Inventory';

describe('Inventory Services', () => {
    let mockInventoryRepo: jest.Mocked<IInventoryRepository>;

    beforeEach(() => {
        jest.clearAllMocks();
        mockInventoryRepo = {
            update: jest.fn(),
            updateReservedStock: jest.fn(),
            getInventoryById: jest.fn(),
            getInventoryByProductId: jest.fn()
        } as any;
    });

    const mockInventoryData = {
        productId: 'prod1',
        price: 100,
        stock: 50,
        reservedStock: 5,
        reservations: [] as []
    };

    describe('updateInventoryById', () => {
        it('should update inventory successfully', async () => {
            const mockUpdatedInventory = new Inventory(mockInventoryData);
            mockInventoryRepo.update.mockResolvedValue(mockUpdatedInventory);

            const result = await updateInventoryById(mockInventoryRepo, mockInventoryData, 'prod1');

            expect(result).toEqual(mockUpdatedInventory);
            expect(mockInventoryRepo.update).toHaveBeenCalledWith('prod1', mockInventoryData);
        });

        it('should throw error when update fails', async () => {
            mockInventoryRepo.update.mockRejectedValue(new Error('Database error'));

            await expect(updateInventoryById(mockInventoryRepo, mockInventoryData, 'prod1'))
                .rejects.toThrow('Error updating inventory product');
        });
    });

    describe('updateReservedStock', () => {
        it('should update reserved stock successfully', async () => {
            const mockUpdatedInventory = new Inventory({ ...mockInventoryData, reservedStock: 10 });
            mockInventoryRepo.updateReservedStock.mockResolvedValue(mockUpdatedInventory);

            const result = await updateReservedStock(mockInventoryRepo, { reservedStock: 10 }, 'prod1');

            expect(result).toEqual(mockUpdatedInventory);
            expect(mockInventoryRepo.updateReservedStock).toHaveBeenCalledWith('prod1', { reservedStock: 10 });
        });
    });

    describe('findInventoryById', () => {
        it('should return inventory by id', async () => {
            const mockInventory = new Inventory(mockInventoryData);
            mockInventoryRepo.getInventoryById.mockResolvedValue(mockInventory);

            const result = await findInventoryById(mockInventoryRepo, 'prod1');

            expect(result).toEqual(mockInventory);
            expect(mockInventoryRepo.getInventoryById).toHaveBeenCalledWith('prod1');
        });

        it('should throw error when findById fails', async () => {
            mockInventoryRepo.getInventoryById.mockRejectedValue(new Error('Database error'));

            await expect(findInventoryById(mockInventoryRepo, 'prod1'))
                .rejects.toThrow('Error retrieving product by ID');
        });
    });
});