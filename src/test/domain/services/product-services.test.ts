import { saveProduct, findProducts, findProductById, updateProductById, deleteProductById } from '../../../domain/services/product-services';
import { IProductRepository } from '../../../domain/repositories/IProduct-repository';
import { Product } from '../../../domain/entities/Product';
import { IProduct } from '../../../domain/models/interfaces/IProduct';

describe('Product Services', () => {
    let mockProductRepo: jest.Mocked<IProductRepository>;

    beforeEach(() => {
        jest.clearAllMocks();
        mockProductRepo = {
            save: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        } as any;
    });

    const mockProductData: IProduct = {
        name: 'Test Product',
        description: 'Test Description',
        cost: 100,
        categoryId: 'cat1',
        providers: ['prov1'],
        images: ['http://example.com/image.jpg'],
        isDiscontinued: false
    };

    describe('saveProduct', () => {
        it('should save product successfully', async () => {
            const mockSavedProduct = new Product(mockProductData);
            mockProductRepo.save.mockResolvedValue(mockSavedProduct);

            const result = await saveProduct(mockProductRepo, mockProductData);

            expect(result).toEqual(mockSavedProduct);
            expect(mockProductRepo.save).toHaveBeenCalledWith(expect.any(Product));
        });

        it('should throw error when save fails', async () => {
            mockProductRepo.save.mockRejectedValue(new Error('Database error'));

            await expect(saveProduct(mockProductRepo, mockProductData))
                .rejects.toThrow('[ERROR TO SERVICE] Error saving product');
        });
    });

    describe('findProducts', () => {
        it('should return all products', async () => {
            const mockProducts = [
                new Product(mockProductData),
                new Product({ ...mockProductData, name: 'Product 2' })
            ];
            mockProductRepo.findAll.mockResolvedValue(mockProducts);

            const result = await findProducts(mockProductRepo);

            expect(result).toEqual(mockProducts);
            expect(mockProductRepo.findAll).toHaveBeenCalled();
        });

        it('should throw error when findAll fails', async () => {
            mockProductRepo.findAll.mockRejectedValue(new Error('Database error'));

            await expect(findProducts(mockProductRepo))
                .rejects.toThrow('Error retrieving products');
        });
    });

    describe('findProductById', () => {
        it('should return product by id', async () => {
            const mockProduct = new Product(mockProductData);
            mockProductRepo.findById.mockResolvedValue(mockProduct);

            const result = await findProductById(mockProductRepo, '123');

            expect(result).toEqual(mockProduct);
            expect(mockProductRepo.findById).toHaveBeenCalledWith('123');
        });

        it('should throw error when findById fails', async () => {
            mockProductRepo.findById.mockRejectedValue(new Error('Database error'));

            await expect(findProductById(mockProductRepo, '123'))
                .rejects.toThrow('Error retrieving product by ID');
        });
    });

    describe('updateProductById', () => {
        it('should update product successfully', async () => {
            const updateData = { name: 'Updated Product' };
            const mockUpdatedProduct = new Product({ ...mockProductData, ...updateData });
            mockProductRepo.update.mockResolvedValue(mockUpdatedProduct);

            const result = await updateProductById(mockProductRepo, '123', updateData);

            expect(result).toEqual(mockUpdatedProduct);
            expect(mockProductRepo.update).toHaveBeenCalledWith('123', updateData);
        });

        it('should throw error when update fails', async () => {
            mockProductRepo.update.mockRejectedValue(new Error('Database error'));

            await expect(updateProductById(mockProductRepo, '123', { name: 'Updated' }))
                .rejects.toThrow('Error updating product');
        });
    });

    describe('deleteProductById', () => {
        it('should delete product successfully', async () => {
            mockProductRepo.delete.mockResolvedValue(undefined);

            await deleteProductById(mockProductRepo, '123');

            expect(mockProductRepo.delete).toHaveBeenCalledWith('123');
        });

        it('should throw error when delete fails', async () => {
            mockProductRepo.delete.mockRejectedValue(new Error('Database error'));

            await expect(deleteProductById(mockProductRepo, '123'))
                .rejects.toThrow('Error deleting product');
        });
    });
});