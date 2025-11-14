import { createRequest, createResponse } from 'node-mocks-http';

// Mock del repositorio antes de importar el controlador
const mockRepo = {
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
};

jest.mock('../../../infraestructure/repositories/mongo-categories', () => ({
    MongoCategoriesRepository: jest.fn().mockImplementation(() => mockRepo)
}));

jest.mock('../../../domain/services/categories-services', () => ({
    saveCategory: jest.fn(),
    findCategories: jest.fn(),
    findCategoryById: jest.fn(),
    updateCategory: jest.fn(),
    deleteCategory: jest.fn()
}));

// Importar el controlador después de los mocks
import { createCategory, getCategories, getCategoryById, updateCategory, deleteCategoryById } from '../../../application/controllers/categories-controller';

describe('Categories Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createCategory', () => {
        it('should create category successfully', async () => {
            const { saveCategory } = require('../../../domain/services/categories-services');
            const mockCategory = { id: '123', name: 'Electronics' };
            saveCategory.mockResolvedValue(mockCategory);

            const request = createRequest({
                body: { name: 'Electronics' }
            });
            const response = createResponse();

            await createCategory(request, response);

            expect(response.statusCode).toBe(201);
            const data = response._getJSONData();
            expect(data.ok).toBe(true);
            expect(data.message).toBe('Category created successfully');
            expect(data.category).toEqual(mockCategory);
        });

        it('should return 500 on service error', async () => {
            const { saveCategory } = require('../../../domain/services/categories-services');
            saveCategory.mockRejectedValue(new Error('Service error'));

            const request = createRequest({
                body: { name: 'Electronics' }
            });
            const response = createResponse();

            await createCategory(request, response);

            expect(response.statusCode).toBe(500);
            const data = response._getJSONData();
            expect(data.ok).toBe(false);
            expect(data.message).toBe('Internal server error');
        });
    });

    describe('getCategories', () => {
        it('should return all categories', async () => {
            const mockCategories = [{ id: '1', name: 'Electronics' }];
            mockRepo.findAll.mockResolvedValue(mockCategories);

            const request = createRequest();
            const response = createResponse();

            await getCategories(request, response);

            expect(response.statusCode).toBe(200);
            const data = response._getJSONData();
            expect(data.ok).toBe(true);
            expect(data.categories).toEqual(mockCategories);
        });

        it('should return 500 on service error', async () => {
            mockRepo.findAll.mockRejectedValue(new Error('Database error'));

            const request = createRequest();
            const response = createResponse();

            await getCategories(request, response);

            expect(response.statusCode).toBe(500);
            const data = response._getJSONData();
            expect(data.ok).toBe(false);
            expect(data.message).toBe('Internal server error');
        });
    });

    describe('getCategoryById', () => {
        it('should return category by id', async () => {
            const mockCategory = { id: '123', name: 'Electronics' };
            mockRepo.findById.mockResolvedValue(mockCategory);

            const request = createRequest({
                params: { id: '123' }
            });
            const response = createResponse();

            await getCategoryById(request, response);

            expect(response.statusCode).toBe(200);
            const data = response._getJSONData();
            expect(data.ok).toBe(true);
            expect(data.category).toEqual(mockCategory);
        });

        it('should return 404 when category not found', async () => {
            mockRepo.findById.mockResolvedValue(null);

            const request = createRequest({
                params: { id: '999' }
            });
            const response = createResponse();

            await getCategoryById(request, response);

            expect(response.statusCode).toBe(404);
            const data = response._getJSONData();
            expect(data.ok).toBe(false);
            expect(data.message).toBe('Category not found');
        });

        it('should return 500 on service error', async () => {
            mockRepo.findById.mockRejectedValue(new Error('Database error'));

            const request = createRequest({
                params: { id: '123' }
            });
            const response = createResponse();

            await getCategoryById(request, response);

            expect(response.statusCode).toBe(500);
            const data = response._getJSONData();
            expect(data.ok).toBe(false);
            expect(data.message).toBe('Internal server error');
        });
    });

    describe('updateCategory', () => {
        it('should update category successfully', async () => {
            const mockCategory = { id: '123', name: 'Electronics' };
            const updatedCategory = { ...mockCategory, name: 'Updated Electronics' };
            mockRepo.findById.mockResolvedValue(mockCategory);
            mockRepo.update.mockResolvedValue(updatedCategory);

            const request = createRequest({
                params: { id: '123' },
                body: { name: 'Updated Electronics' }
            });
            const response = createResponse();

            await updateCategory(request, response);

            expect(response.statusCode).toBe(200);
            const data = response._getJSONData();
            expect(data.ok).toBe(true);
            expect(data.message).toBe('Category updated successfully');
            expect(data.category).toEqual(updatedCategory);
        });

        it('should return 404 when category not found', async () => {
            mockRepo.findById.mockResolvedValue(null);

            const request = createRequest({
                params: { id: '999' },
                body: { name: 'Updated Electronics' }
            });
            const response = createResponse();

            await updateCategory(request, response);

            expect(response.statusCode).toBe(404);
            const data = response._getJSONData();
            expect(data.ok).toBe(false);
            expect(data.message).toBe('Category not found');
        });

        it('should return 500 on service error', async () => {
            mockRepo.findById.mockRejectedValue(new Error('Database error'));

            const request = createRequest({
                params: { id: '123' },
                body: { name: 'Updated Electronics' }
            });
            const response = createResponse();

            await updateCategory(request, response);

            expect(response.statusCode).toBe(500);
            const data = response._getJSONData();
            expect(data.ok).toBe(false);
            expect(data.message).toBe('Internal server error');
        });
    });

    describe('deleteCategoryById', () => {
        it('should delete category successfully', async () => {
            const mockCategory = { id: '123', name: 'Electronics' };
            mockRepo.findById.mockResolvedValue(mockCategory);
            mockRepo.delete.mockResolvedValue(undefined);

            const request = createRequest({
                params: { id: '123' }
            });
            const response = createResponse();

            await deleteCategoryById(request, response);

            expect(response.statusCode).toBe(200);
            const data = response._getJSONData();
            expect(data.ok).toBe(true);
            expect(data.message).toBe('Category deleted successfully');
        });

        it('should return 404 when category not found', async () => {
            mockRepo.findById.mockResolvedValue(null);

            const request = createRequest({
                params: { id: '999' }
            });
            const response = createResponse();

            await deleteCategoryById(request, response);

            expect(response.statusCode).toBe(404);
            const data = response._getJSONData();
            expect(data.ok).toBe(false);
            expect(data.message).toBe('Category not found');
        });

        it('should return 500 on service error', async () => {
            mockRepo.findById.mockRejectedValue(new Error('Database error'));

            const request = createRequest({
                params: { id: '123' }
            });
            const response = createResponse();

            await deleteCategoryById(request, response);

            expect(response.statusCode).toBe(500);
            const data = response._getJSONData();
            expect(data.ok).toBe(false);
            expect(data.message).toBe('Internal server error');
        });
    });
});