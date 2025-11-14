import { IOrderRepository } from '../../../domain/repositories/IOrder-repository';
import { Order } from '../../../domain/entities/Order';
import { OrderStatus } from '../../../domain/models/interfaces/IOrder';

describe('IOrderRepository', () => {
  let mockRepository: IOrderRepository;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByOrderNumber: jest.fn(),
      findByPreorderId: jest.fn(),
      findByUserId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn()
    };
  });

  const mockOrder = new Order({
    _id: '1',
    orderNumber: 'ORD-001',
    preorderId: 'pre1',
    userId: 'user1',
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
    shippingCost: 10,
    total: 100,
    status: OrderStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
    emailSent: false
  });

  describe('save', () => {
    it('should save and return order', async () => {
      (mockRepository.save as jest.Mock).mockResolvedValue(mockOrder);

      const result = await mockRepository.save(mockOrder);

      expect(result).toEqual(mockOrder);
      expect(mockRepository.save).toHaveBeenCalledWith(mockOrder);
    });
  });

  describe('findById', () => {
    it('should return order by id', async () => {
      (mockRepository.findById as jest.Mock).mockResolvedValue(mockOrder);

      const result = await mockRepository.findById('1');

      expect(result).toEqual(mockOrder);
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should return null if order not found', async () => {
      (mockRepository.findById as jest.Mock).mockResolvedValue(null);

      const result = await mockRepository.findById('999');

      expect(result).toBeNull();
    });
  });

  describe('findByOrderNumber', () => {
    it('should return order by order number', async () => {
      (mockRepository.findByOrderNumber as jest.Mock).mockResolvedValue(mockOrder);

      const result = await mockRepository.findByOrderNumber('ORD-001');

      expect(result).toEqual(mockOrder);
      expect(mockRepository.findByOrderNumber).toHaveBeenCalledWith('ORD-001');
    });

    it('should return null if order not found', async () => {
      (mockRepository.findByOrderNumber as jest.Mock).mockResolvedValue(null);

      const result = await mockRepository.findByOrderNumber('ORD-999');

      expect(result).toBeNull();
    });
  });

  describe('findByPreorderId', () => {
    it('should return order by preorder id', async () => {
      (mockRepository.findByPreorderId as jest.Mock).mockResolvedValue(mockOrder);

      const result = await mockRepository.findByPreorderId('pre1');

      expect(result).toEqual(mockOrder);
      expect(mockRepository.findByPreorderId).toHaveBeenCalledWith('pre1');
    });
  });

  describe('findByUserId', () => {
    it('should return orders by user id', async () => {
      (mockRepository.findByUserId as jest.Mock).mockResolvedValue([mockOrder]);

      const result = await mockRepository.findByUserId('user1');

      expect(result).toEqual([mockOrder]);
      expect(mockRepository.findByUserId).toHaveBeenCalledWith('user1');
    });
  });

  describe('update', () => {
    it('should update and return order', async () => {
      (mockRepository.update as jest.Mock).mockResolvedValue(mockOrder);

      const result = await mockRepository.update('1', mockOrder);

      expect(result).toEqual(mockOrder);
      expect(mockRepository.update).toHaveBeenCalledWith('1', mockOrder);
    });
  });

  describe('delete', () => {
    it('should delete order and return true', async () => {
      (mockRepository.delete as jest.Mock).mockResolvedValue(true);

      const result = await mockRepository.delete('1');

      expect(result).toBe(true);
      expect(mockRepository.delete).toHaveBeenCalledWith('1');
    });
  });

  describe('findAll', () => {
    it('should return all orders', async () => {
      (mockRepository.findAll as jest.Mock).mockResolvedValue([mockOrder]);

      const result = await mockRepository.findAll();

      expect(result).toEqual([mockOrder]);
    });
  });
});