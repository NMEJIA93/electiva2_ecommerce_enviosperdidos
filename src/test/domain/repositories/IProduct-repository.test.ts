import { IProductRepository } from '../../../domain/repositories/IProduct-repository';
import { Product } from '../../../domain/entities/Product';

describe('IProductRepository', () => {
  let mockRepository: IProductRepository;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };
  });

  const mockProduct = new Product({
    id: '1',
    name: 'Test Product',
    description: 'Test Description',
    cost: 100,
    categoryId: 'cat1',
    images: ['image1.jpg'],
    providers: ['provider1'],
    isDiscontinued: false
  });

  describe('save', () => {
    it('should save and return product', async () => {
      (mockRepository.save as jest.Mock).mockResolvedValue(mockProduct);

      const result = await mockRepository.save(mockProduct);

      expect(result).toEqual(mockProduct);
      expect(mockRepository.save).toHaveBeenCalledWith(mockProduct);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      (mockRepository.findAll as jest.Mock).mockResolvedValue([mockProduct]);

      const result = await mockRepository.findAll();

      expect(result).toEqual([mockProduct]);
      expect(mockRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return product by id', async () => {
      (mockRepository.findById as jest.Mock).mockResolvedValue(mockProduct);

      const result = await mockRepository.findById('1');

      expect(result).toEqual(mockProduct);
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update and return product', async () => {
      const updatedProduct = { ...mockProduct, name: 'Updated Product' };
      (mockRepository.update as jest.Mock).mockResolvedValue(updatedProduct);

      const result = await mockRepository.update('1', { name: 'Updated Product' });

      expect(result).toEqual(updatedProduct);
      expect(mockRepository.update).toHaveBeenCalledWith('1', { name: 'Updated Product' });
    });
  });

  describe('delete', () => {
    it('should delete product by id', async () => {
      (mockRepository.delete as jest.Mock).mockResolvedValue(undefined);

      await mockRepository.delete('1');

      expect(mockRepository.delete).toHaveBeenCalledWith('1');
    });
  });
});