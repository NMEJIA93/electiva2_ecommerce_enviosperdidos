import { saveCategory, findCategories, findCategoryById, updateCategory, deleteCategory } from '../../../domain/services/categories-services';
import { ICategoriesRepository } from '../../../domain/repositories/ICategories-repository';
import { Categories } from '../../../domain/entities/Categories';

describe('Categories Services', () => {
    let mockCategoriesRepo: jest.Mocked<ICategoriesRepository>;

    beforeEach(() => {
        jest.clearAllMocks();
        mockCategoriesRepo = {
            save: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        } as any;
    });

    const mockCategoryData = {
        id: '123',
        name: 'Electronics'
    };

    describe('saveCategory', () => {
        it('should save category successfully', async () => {
            const mockSavedCategory = new Categories({ id: '123', name: 'Electronics' });
            mockCategoriesRepo.save.mockResolvedValue(mockSavedCategory);

            const result = await saveCategory(mockCategoriesRepo, mockCategoryData);

            expect(result).toEqual(mockSavedCategory);
            expect(mockCategoriesRepo.save).toHaveBeenCalledWith(expect.any(Categories));
        });

        it('should throw error when save fails', async () => {
            mockCategoriesRepo.save.mockRejectedValue(new Error('Database error'));

            await expect(saveCategory(mockCategoriesRepo, mockCategoryData))
                .rejects.toThrow('[ERROR TO SERVICE] - Error saving category');
        });
    });

    describe('findCategories', () => {
        it('should return all categories', async () => {
            const mockCategories = [
                new Categories({ id: '1', name: 'Electronics' }),
                new Categories({ id: '2', name: 'Clothing' })
            ];
            mockCategoriesRepo.findAll.mockResolvedValue(mockCategories);

            const result = await findCategories(mockCategoriesRepo);

            expect(result).toEqual(mockCategories);
            expect(mockCategoriesRepo.findAll).toHaveBeenCalled();
        });

        it('should throw error when findAll fails', async () => {
            mockCategoriesRepo.findAll.mockRejectedValue(new Error('Database error'));

            await expect(findCategories(mockCategoriesRepo))
                .rejects.toThrow('[ERROR TO SERVICE] - Error retrieving categories');
        });
    });

    describe('findCategoryById', () => {
        it('should return category by id', async () => {
            const mockCategory = new Categories({ id: '123', name: 'Electronics' });
            mockCategoriesRepo.findById.mockResolvedValue(mockCategory);

            const result = await findCategoryById(mockCategoriesRepo, '123');

            expect(result).toEqual(mockCategory);
            expect(mockCategoriesRepo.findById).toHaveBeenCalledWith('123');
        });

        it('should throw error when findById fails', async () => {
            mockCategoriesRepo.findById.mockRejectedValue(new Error('Database error'));

            await expect(findCategoryById(mockCategoriesRepo, '123'))
                .rejects.toThrow('[ERROR TO SERVICE] - Error retrieving category by ID');
        });
    });

    describe('updateCategory', () => {
        it('should update category successfully', async () => {
            const updateData = { id: '123', name: 'Updated Electronics' };
            const mockUpdatedCategory = new Categories(updateData);
            mockCategoriesRepo.update.mockResolvedValue(mockUpdatedCategory);

            const result = await updateCategory(mockCategoriesRepo, updateData);

            expect(result).toEqual(mockUpdatedCategory);
            expect(mockCategoriesRepo.update).toHaveBeenCalledWith(expect.any(Categories));
        });

        it('should throw error when update fails', async () => {
            mockCategoriesRepo.update.mockRejectedValue(new Error('Database error'));

            await expect(updateCategory(mockCategoriesRepo, { id: '123', name: 'Updated' }))
                .rejects.toThrow('[ERROR TO SERVICE] - Error updating category');
        });
    });

    describe('deleteCategory', () => {
        it('should delete category successfully', async () => {
            mockCategoriesRepo.delete.mockResolvedValue(undefined);

            await deleteCategory(mockCategoriesRepo, '123');

            expect(mockCategoriesRepo.delete).toHaveBeenCalledWith('123');
        });

        it('should throw error when delete fails', async () => {
            mockCategoriesRepo.delete.mockRejectedValue(new Error('Database error'));

            await expect(deleteCategory(mockCategoriesRepo, '123'))
                .rejects.toThrow('[ERROR TO SERVICE] - Error deleting category');
        });
    });
});