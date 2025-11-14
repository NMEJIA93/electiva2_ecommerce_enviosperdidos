import { IPreorderRepository } from '../../../domain/repositories/IPreorder-repository';
import { Preorder } from '../../../domain/entities/Preorder';
import { PreOrderStatus } from '../../../application/dtos/preorder-dtos';

describe('IPreorderRepository', () => {
  let mockRepository: IPreorderRepository;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      update: jest.fn()
    };
  });

  const mockPreorder = new Preorder({
    _id: '1',
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
    status: PreOrderStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  describe('save', () => {
    it('should save and return preorder', async () => {
      (mockRepository.save as jest.Mock).mockResolvedValue(mockPreorder);

      const result = await mockRepository.save(mockPreorder);

      expect(result).toEqual(mockPreorder);
      expect(mockRepository.save).toHaveBeenCalledWith(mockPreorder);
    });
  });

  describe('findById', () => {
    it('should return preorder by id', async () => {
      (mockRepository.findById as jest.Mock).mockResolvedValue(mockPreorder);

      const result = await mockRepository.findById('1');

      expect(result).toEqual(mockPreorder);
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should return null if preorder not found', async () => {
      (mockRepository.findById as jest.Mock).mockResolvedValue(null);

      const result = await mockRepository.findById('999');

      expect(result).toBeNull();
      expect(mockRepository.findById).toHaveBeenCalledWith('999');
    });
  });

  describe('update', () => {
    it('should update and return preorder', async () => {
      (mockRepository.update as jest.Mock).mockResolvedValue(mockPreorder);

      const result = await mockRepository.update('1', mockPreorder);

      expect(result).toEqual(mockPreorder);
      expect(mockRepository.update).toHaveBeenCalledWith('1', mockPreorder);
    });

    it('should return null if preorder not found for update', async () => {
      (mockRepository.update as jest.Mock).mockResolvedValue(null);

      const result = await mockRepository.update('999', mockPreorder);

      expect(result).toBeNull();
      expect(mockRepository.update).toHaveBeenCalledWith('999', mockPreorder);
    });
  });
});