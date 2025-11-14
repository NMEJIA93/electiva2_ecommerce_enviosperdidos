import { IInventoryRepository } from '../../../domain/repositories/IInventory-repository';
import { Inventory } from '../../../domain/entities/Inventory';

describe('IInventoryRepository', () => {
  let mockRepository: IInventoryRepository;

  beforeEach(() => {
    mockRepository = {
      update: jest.fn(),
      updateReservedStock: jest.fn(),
      getInventoryById: jest.fn(),
      getInventoryByProductId: jest.fn()
    };
  });

  describe('update', () => {
    it('should update inventory and return updated inventory', async () => {
      const inventory = new Inventory({
        id: '1',
        productId: 'prod1',
        price: 100,
        stock: 50,
        reservedStock: 5,
        reservations: []
      });
      
      (mockRepository.update as jest.Mock).mockResolvedValue(inventory);

      const result = await mockRepository.update('1', { stock: 50 });

      expect(result).toEqual(inventory);
      expect(mockRepository.update).toHaveBeenCalledWith('1', { stock: 50 });
    });
  });

  describe('updateReservedStock', () => {
    it('should update reserved stock and return inventory', async () => {
      const inventory = new Inventory({
        productId: 'prod1',
        price: 100,
        stock: 50,
        reservedStock: 10,
        reservations: []
      });
      
      (mockRepository.updateReservedStock as jest.Mock).mockResolvedValue(inventory);

      const result = await mockRepository.updateReservedStock('1', { reservedStock: 10 });

      expect(result).toEqual(inventory);
      expect(mockRepository.updateReservedStock).toHaveBeenCalledWith('1', { reservedStock: 10 });
    });
  });

  describe('getInventoryById', () => {
    it('should return inventory by id', async () => {
      const inventory = new Inventory({
        id: '1',
        productId: 'prod1',
        price: 100,
        stock: 50,
        reservedStock: 0,
        reservations: []
      });
      
      (mockRepository.getInventoryById as jest.Mock).mockResolvedValue(inventory);

      const result = await mockRepository.getInventoryById('1');

      expect(result).toEqual(inventory);
      expect(mockRepository.getInventoryById).toHaveBeenCalledWith('1');
    });
  });

  describe('getInventoryByProductId', () => {
    it('should return inventory by product id', async () => {
      const inventory = new Inventory({
        productId: 'prod1',
        price: 100,
        stock: 50,
        reservedStock: 0,
        reservations: []
      });
      
      (mockRepository.getInventoryByProductId as jest.Mock).mockResolvedValue(inventory);

      const result = await mockRepository.getInventoryByProductId('prod1');

      expect(result).toEqual(inventory);
      expect(mockRepository.getInventoryByProductId).toHaveBeenCalledWith('prod1');
    });
  });
});