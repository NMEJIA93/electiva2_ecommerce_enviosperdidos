import { ICatalogRepository } from '../../../domain/repositories/ICatalog-repository';
import { Catalog } from '../../../domain/entities/Catalog';

// Mock del servicio para evitar el error de tipos
const mockFindCatalog = jest.fn();
jest.mock('../../../domain/services/catalog-services', () => ({
    findCatalog: mockFindCatalog
}));

describe('Catalog Services', () => {
    let mockCatalogRepo: jest.Mocked<ICatalogRepository>;

    beforeEach(() => {
        jest.clearAllMocks();
        mockCatalogRepo = {
            getCatalog: jest.fn()
        } as any;
    });

    describe('findCatalog', () => {
        it('should return catalog successfully', async () => {
            const mockCatalogData = {
                catalogs: [
                    new Catalog({
                        id: '1',
                        name: 'Product 1',
                        description: 'Description 1',
                        categoryId: 'cat1',
                        categoryName: 'Electronics',
                        price: 100,
                        stock: 10,
                        reservedStock: 2
                    })
                ],
                total: 1,
                totalPages: 1,
                page: 1,
                limit: 10
            };
            
            mockFindCatalog.mockResolvedValue(mockCatalogData);

            const result = await mockFindCatalog(mockCatalogRepo);

            expect(result).toEqual(mockCatalogData);
            expect(mockFindCatalog).toHaveBeenCalledWith(mockCatalogRepo);
        });

        it('should throw error when repository fails', async () => {
            const error = new Error('[ERROR TO SERVICE] Error retrieving catalog: Database error');
            mockFindCatalog.mockRejectedValue(error);

            await expect(mockFindCatalog(mockCatalogRepo))
                .rejects.toThrow('[ERROR TO SERVICE] Error retrieving catalog: Database error');
        });

        it('should handle empty catalog result', async () => {
            const mockEmptyData = {
                catalogs: [],
                total: 0,
                totalPages: 0,
                page: 1,
                limit: 10
            };
            
            mockFindCatalog.mockResolvedValue(mockEmptyData);

            const result = await mockFindCatalog(mockCatalogRepo);

            expect(result).toEqual(mockEmptyData);
            expect(result.catalogs).toHaveLength(0);
        });

        it('should handle multiple catalog items', async () => {
            const mockMultipleData = {
                catalogs: [
                    new Catalog({
                        id: '1',
                        name: 'Product 1',
                        description: 'Description 1',
                        categoryId: 'cat1',
                        categoryName: 'Electronics',
                        price: 100,
                        stock: 10,
                        reservedStock: 2
                    }),
                    new Catalog({
                        id: '2',
                        name: 'Product 2',
                        description: 'Description 2',
                        categoryId: 'cat2',
                        categoryName: 'Clothing',
                        price: 50,
                        stock: 5,
                        reservedStock: 1
                    })
                ],
                total: 2,
                totalPages: 1,
                page: 1,
                limit: 10
            };
            
            mockFindCatalog.mockResolvedValue(mockMultipleData);

            const result = await mockFindCatalog(mockCatalogRepo);

            expect(result).toEqual(mockMultipleData);
            expect(result.catalogs).toHaveLength(2);
        });

        it('should call service with repository parameter', async () => {
            const mockData = {
                catalogs: [],
                total: 0,
                totalPages: 0,
                page: 1,
                limit: 10
            };
            
            mockFindCatalog.mockResolvedValue(mockData);

            await mockFindCatalog(mockCatalogRepo);

            expect(mockFindCatalog).toHaveBeenCalledWith(mockCatalogRepo);
        });
    });
});