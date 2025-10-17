import { generateOrderNumber, validateOrderStock, deductInventoryStock, validateOrderData } from '../../../domain/business-rules/order-rules';
import { IOrderRepository } from '../../../domain/repositories/IOrder-repository';
import { IInventoryRepository } from '../../../domain/repositories/IInventory-repository';
import { IOrderProduct } from '../../../domain/models/interfaces/IOrder';
import { Inventory } from '../../../domain/entities/Inventory';

describe('Order Rules', () => {
  let mockOrderRepo: jest.Mocked<IOrderRepository>;
  let mockInventoryRepo: jest.Mocked<IInventoryRepository>;

  beforeEach(() => {
    mockOrderRepo = {
      findByOrderNumber: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      findByPreorderId: jest.fn(),
      findByUserId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn()
    };

    mockInventoryRepo = {
      getInventoryByProductId: jest.fn(),
      update: jest.fn(),
      updateReservedStock: jest.fn(),
      getInventoryById: jest.fn()
    };
  });

  describe('generateOrderNumber', () => {
    it('should generate unique order number', async () => {
      mockOrderRepo.findByOrderNumber.mockResolvedValue(null);

      const orderNumber = await generateOrderNumber(mockOrderRepo);

      expect(orderNumber).toMatch(/^ORD-\d{8}-[A-Z0-9]{5}$/);
      expect(mockOrderRepo.findByOrderNumber).toHaveBeenCalledWith(orderNumber);
    });

    it('should retry if order number exists', async () => {
      mockOrderRepo.findByOrderNumber
        .mockResolvedValueOnce({ orderNumber: 'existing' } as any)
        .mockResolvedValueOnce(null);

      const orderNumber = await generateOrderNumber(mockOrderRepo);

      expect(orderNumber).toMatch(/^ORD-\d{8}-[A-Z0-9]{5}$/);
      expect(mockOrderRepo.findByOrderNumber).toHaveBeenCalledTimes(2);
    });

    it('should throw error after max attempts', async () => {
      mockOrderRepo.findByOrderNumber.mockResolvedValue({ orderNumber: 'existing' } as any);

      await expect(generateOrderNumber(mockOrderRepo)).rejects.toThrow('Unable to generate unique order number after maximum attempts');
    });
  });

  describe('validateOrderStock', () => {
    const mockProducts: IOrderProduct[] = [
      { productId: '1', name: 'Product 1', quantity: 5, price: 100, categoryId: 'cat1' }
    ];

    it('should pass validation when stock is sufficient', async () => {
      const mockInventory = new Inventory({
        productId: '1',
        stock: 10,
        price: 100,
        reservedStock: 0,
        reservations: []
      });
      mockInventoryRepo.getInventoryByProductId.mockResolvedValue(mockInventory);

      await expect(validateOrderStock(mockProducts, mockInventoryRepo)).resolves.not.toThrow();
    });

    it('should throw error when stock is insufficient', async () => {
      const mockInventory = new Inventory({
        productId: '1',
        stock: 3,
        price: 100,
        reservedStock: 0,
        reservations: []
      });
      mockInventoryRepo.getInventoryByProductId.mockResolvedValue(mockInventory);

      await expect(validateOrderStock(mockProducts, mockInventoryRepo))
        .rejects.toThrow('No hay suficiente stock para el producto Product 1');
    });
  });

  describe('deductInventoryStock', () => {
    const mockProducts: IOrderProduct[] = [
      { productId: '1', name: 'Product 1', quantity: 5, price: 100, categoryId: 'cat1' }
    ];

    it('should deduct stock successfully', async () => {
      const mockInventory = new Inventory({
        productId: '1',
        stock: 10,
        price: 100,
        reservedStock: 5,
        reservations: []
      });

      mockInventoryRepo.getInventoryByProductId.mockResolvedValue(mockInventory);
      mockInventoryRepo.update.mockResolvedValue(mockInventory);

      await deductInventoryStock(mockProducts, mockInventoryRepo);

      expect(mockInventoryRepo.update).toHaveBeenCalledWith('1', expect.objectContaining({
        stock: 5,
        reservedStock: 0
      }));
    });

    it('should throw error if product not found in inventory', async () => {
      mockInventoryRepo.getInventoryByProductId.mockResolvedValue(null);

      await expect(deductInventoryStock(mockProducts, mockInventoryRepo))
        .rejects.toThrow('Product 1 not found in inventory');
    });
  });

  describe('validateOrderData', () => {
    const validOrderData = {
      preorderId: 'pre1',
      userId: 'user1',
      products: [{ productId: '1', name: 'Product 1', quantity: 1, price: 100, categoryId: 'cat1' }],
      shippingAddress: { street: 'Test St' },
      paymentMethod: 'credit_card',
      total: 100
    };

    it('should pass validation for valid order data', () => {
      expect(() => validateOrderData(validOrderData)).not.toThrow();
    });

    it('should throw error if preorderId is missing', () => {
      const invalidData = { ...validOrderData, preorderId: null };
      expect(() => validateOrderData(invalidData)).toThrow('Preorder ID is required');
    });

    it('should throw error if userId is missing', () => {
      const invalidData = { ...validOrderData, userId: null };
      expect(() => validateOrderData(invalidData)).toThrow('User ID is required');
    });

    it('should throw error if products array is empty', () => {
      const invalidData = { ...validOrderData, products: [] };
      expect(() => validateOrderData(invalidData)).toThrow('Order must contain at least one product');
    });

    it('should throw error if shippingAddress is missing', () => {
      const invalidData = { ...validOrderData, shippingAddress: null };
      expect(() => validateOrderData(invalidData)).toThrow('Shipping address is required');
    });

    it('should throw error if paymentMethod is missing', () => {
      const invalidData = { ...validOrderData, paymentMethod: null };
      expect(() => validateOrderData(invalidData)).toThrow('Payment method is required');
    });

    it('should throw error if total is zero or negative', () => {
      const invalidData = { ...validOrderData, total: 0 };
      expect(() => validateOrderData(invalidData)).toThrow('Order total must be greater than zero');
    });
  });
});