import { ICatalogRepository } from '../../../domain/repositories/ICatalog-repository';
import { Catalog } from '../../../domain/entities/Catalog';

describe('ICatalogRepository', () => {
  let mockRepository: ICatalogRepository;

  beforeEach(() => {
    mockRepository = {
      getCatalog: jest.fn()
    };
  });

  describe('getCatalog', () => {
    it('should return paginated catalog data', async () => {
      const mockCatalog = new Catalog({
        id: '1',
        name: 'Test Product',
        description: 'Test Description',
        categoryId: 'cat1',
        categoryName: 'Test Category',
        price: 100,
        stock: 10,
        reservedStock: 0
      });

      const expectedResult = {
        catalogs: [mockCatalog],
        total: 1,
        totalPages: 1,
        page: 1,
        limit: 10
      };

      (mockRepository.getCatalog as jest.Mock).mockResolvedValue(expectedResult);

      const result = await mockRepository.getCatalog(1, 10);

      expect(result).toEqual(expectedResult);
      expect(mockRepository.getCatalog).toHaveBeenCalledWith(1, 10);
    });

    it('should work without pagination parameters', async () => {
      const expectedResult = {
        catalogs: [],
        total: 0,
        totalPages: 0,
        page: 1,
        limit: 10
      };

      (mockRepository.getCatalog as jest.Mock).mockResolvedValue(expectedResult);

      const result = await mockRepository.getCatalog();

      expect(result).toEqual(expectedResult);
      expect(mockRepository.getCatalog).toHaveBeenCalledWith();
    });
  });
});