import { ICategoriesRepository } from '../../../domain/repositories/ICategories-repository';
import { Categories } from '../../../domain/entities/Categories';

describe('ICategoriesRepository', () => {
  let mockRepository: ICategoriesRepository;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };
  });

  describe('save', () => {
    it('should save and return a category', async () => {
      const category = new Categories({ id: '1', name: 'Electronics' });
      (mockRepository.save as jest.Mock).mockResolvedValue(category);

      const result = await mockRepository.save(category);

      expect(result).toEqual(category);
      expect(mockRepository.save).toHaveBeenCalledWith(category);
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const categories = [new Categories({ id: '1', name: 'Electronics' })];
      (mockRepository.findAll as jest.Mock).mockResolvedValue(categories);

      const result = await mockRepository.findAll();

      expect(result).toEqual(categories);
    });
  });

  describe('findById', () => {
    it('should return category by id', async () => {
      const category = new Categories({ id: '1', name: 'Electronics' });
      (mockRepository.findById as jest.Mock).mockResolvedValue(category);

      const result = await mockRepository.findById('1');

      expect(result).toEqual(category);
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update and return category', async () => {
      const category = new Categories({ id: '1', name: 'Updated Electronics' });
      (mockRepository.update as jest.Mock).mockResolvedValue(category);

      const result = await mockRepository.update(category);

      expect(result).toEqual(category);
      expect(mockRepository.update).toHaveBeenCalledWith(category);
    });
  });

  describe('delete', () => {
    it('should delete category by id', async () => {
      (mockRepository.delete as jest.Mock).mockResolvedValue(undefined);

      await mockRepository.delete('1');

      expect(mockRepository.delete).toHaveBeenCalledWith('1');
    });
  });
});