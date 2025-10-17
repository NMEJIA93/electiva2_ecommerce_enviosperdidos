import { IProviderRepository } from '../../../domain/repositories/IProvider-repository';
import { Provider } from '../../../domain/entities/Providier';

describe('IProviderRepository', () => {
  let mockRepository: IProviderRepository;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };
  });

  const mockProvider = new Provider({
    id: '1',
    name: 'Test Provider'
  });

  describe('save', () => {
    it('should save and return provider', async () => {
      (mockRepository.save as jest.Mock).mockResolvedValue(mockProvider);

      const result = await mockRepository.save(mockProvider);

      expect(result).toEqual(mockProvider);
      expect(mockRepository.save).toHaveBeenCalledWith(mockProvider);
    });
  });

  describe('findAll', () => {
    it('should return all providers', async () => {
      (mockRepository.findAll as jest.Mock).mockResolvedValue([mockProvider]);

      const result = await mockRepository.findAll();

      expect(result).toEqual([mockProvider]);
      expect(mockRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return provider by id', async () => {
      (mockRepository.findById as jest.Mock).mockResolvedValue(mockProvider);

      const result = await mockRepository.findById('1');

      expect(result).toEqual(mockProvider);
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update and return provider', async () => {
      const updatedProvider = { ...mockProvider, name: 'Updated Provider' };
      (mockRepository.update as jest.Mock).mockResolvedValue(updatedProvider);

      const result = await mockRepository.update(updatedProvider);

      expect(result).toEqual(updatedProvider);
      expect(mockRepository.update).toHaveBeenCalledWith(updatedProvider);
    });
  });

  describe('delete', () => {
    it('should delete provider by id', async () => {
      (mockRepository.delete as jest.Mock).mockResolvedValue(undefined);

      await mockRepository.delete('1');

      expect(mockRepository.delete).toHaveBeenCalledWith('1');
    });
  });
});