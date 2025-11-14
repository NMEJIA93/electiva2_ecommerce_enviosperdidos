import { createRequest, createResponse } from 'node-mocks-http';

// Mock del repositorio antes de importar el controlador
const mockRepo = {
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
};

jest.mock('../../../infraestructure/repositories/mongo-provider', () => ({
    MongoProviderReposiitory: jest.fn().mockImplementation(() => mockRepo)
}));

jest.mock('../../../domain/services/provider-services', () => ({
    saveProvider: jest.fn(),
    getAllProviders: jest.fn(),
    getProviderById: jest.fn()
}));

// Importar el controlador después de los mocks
import { createProvider, getProviders, getProviderById, updateProvider, deleteProvider } from '../../../application/controllers/provider-controller';

describe('Provider Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createProvider', () => {
        it('should create provider successfully', async () => {
            const { saveProvider } = require('../../../domain/services/provider-services');
            const mockProvider = { id: '123', name: 'Test Provider' };
            saveProvider.mockResolvedValue(mockProvider);

            const request = createRequest({
                body: { name: 'Test Provider' }
            });
            const response = createResponse();

            await createProvider(request, response);

            expect(response.statusCode).toBe(201);
            const data = response._getJSONData();
            expect(data.ok).toBe(true);
            expect(data.message).toBe('Provider created successfully');
            expect(data.provider).toEqual(mockProvider);
        });

        it('should return 500 on service error', async () => {
            const { saveProvider } = require('../../../domain/services/provider-services');
            saveProvider.mockRejectedValue(new Error('Service error'));

            const request = createRequest({
                body: { name: 'Test Provider' }
            });
            const response = createResponse();

            await createProvider(request, response);

            expect(response.statusCode).toBe(500);
            const data = response._getJSONData();
            expect(data.ok).toBe(false);
            expect(data.message).toBe('Internal server error');
        });
    });

    describe('getProviders', () => {
        it('should return all providers', async () => {
            const mockProviders = [{ id: '1', name: 'Provider 1' }];
            mockRepo.findAll.mockResolvedValue(mockProviders);

            const request = createRequest();
            const response = createResponse();

            await getProviders(request, response);

            expect(response.statusCode).toBe(200);
            const data = response._getJSONData();
            expect(data.ok).toBe(true);
            expect(data.providers).toEqual(mockProviders);
        });

        it('should return 500 on service error', async () => {
            mockRepo.findAll.mockRejectedValue(new Error('Database error'));

            const request = createRequest();
            const response = createResponse();

            await getProviders(request, response);

            expect(response.statusCode).toBe(500);
            const data = response._getJSONData();
            expect(data.ok).toBe(false);
            expect(data.message).toBe('Internal server error');
        });
    });

    describe('getProviderById', () => {
        it('should return provider by id', async () => {
            const mockProvider = { id: '123', name: 'Test Provider' };
            mockRepo.findById.mockResolvedValue(mockProvider);

            const request = createRequest({
                params: { id: '123' }
            });
            const response = createResponse();

            await getProviderById(request, response);

            expect(response.statusCode).toBe(200);
            const data = response._getJSONData();
            expect(data.ok).toBe(true);
            expect(data.provider).toEqual(mockProvider);
        });

        it('should return 404 when provider not found', async () => {
            mockRepo.findById.mockResolvedValue(null);

            const request = createRequest({
                params: { id: '999' }
            });
            const response = createResponse();

            await getProviderById(request, response);

            expect(response.statusCode).toBe(404);
            const data = response._getJSONData();
            expect(data.ok).toBe(false);
            expect(data.message).toBe('Provider not found');
        });

        it('should return 500 on service error', async () => {
            mockRepo.findById.mockRejectedValue(new Error('Database error'));

            const request = createRequest({
                params: { id: '123' }
            });
            const response = createResponse();

            await getProviderById(request, response);

            expect(response.statusCode).toBe(500);
            const data = response._getJSONData();
            expect(data.ok).toBe(false);
            expect(data.message).toBe('Internal server error');
        });
    });

    describe('updateProvider', () => {
        it('should update provider successfully', async () => {
            const mockProvider = { id: '123', name: 'Test Provider' };
            const updatedProvider = { ...mockProvider, name: 'Updated Provider' };
            mockRepo.findById.mockResolvedValue(mockProvider);
            mockRepo.update.mockResolvedValue(updatedProvider);

            const request = createRequest({
                params: { id: '123' },
                body: { name: 'Updated Provider' }
            });
            const response = createResponse();

            await updateProvider(request, response);

            expect(response.statusCode).toBe(200);
            const data = response._getJSONData();
            expect(data.ok).toBe(true);
            expect(data.message).toBe('Provider updated successfully');
            expect(data.provider).toEqual(updatedProvider);
        });

        it('should return 404 when provider not found', async () => {
            mockRepo.findById.mockResolvedValue(null);

            const request = createRequest({
                params: { id: '999' },
                body: { name: 'Updated Provider' }
            });
            const response = createResponse();

            await updateProvider(request, response);

            expect(response.statusCode).toBe(404);
            const data = response._getJSONData();
            expect(data.ok).toBe(false);
            expect(data.message).toBe('Provider not found');
        });

        it('should return 500 on service error', async () => {
            mockRepo.findById.mockRejectedValue(new Error('Database error'));

            const request = createRequest({
                params: { id: '123' },
                body: { name: 'Updated Provider' }
            });
            const response = createResponse();

            await updateProvider(request, response);

            expect(response.statusCode).toBe(500);
            const data = response._getJSONData();
            expect(data.ok).toBe(false);
            expect(data.message).toBe('Internal server error');
        });
    });

    describe('deleteProvider', () => {
        it('should delete provider successfully', async () => {
            const mockProvider = { id: '123', name: 'Test Provider' };
            mockRepo.findById.mockResolvedValue(mockProvider);
            mockRepo.delete.mockResolvedValue(undefined);

            const request = createRequest({
                params: { id: '123' }
            });
            const response = createResponse();

            await deleteProvider(request, response);

            expect(response.statusCode).toBe(200);
            const data = response._getJSONData();
            expect(data.ok).toBe(true);
            expect(data.message).toBe('Provider deleted successfully');
        });

        it('should return 404 when provider not found', async () => {
            mockRepo.findById.mockResolvedValue(null);

            const request = createRequest({
                params: { id: '999' }
            });
            const response = createResponse();

            await deleteProvider(request, response);

            expect(response.statusCode).toBe(404);
            const data = response._getJSONData();
            expect(data.ok).toBe(false);
            expect(data.message).toBe('Provider not found');
        });

        it('should return 500 on service error', async () => {
            mockRepo.findById.mockRejectedValue(new Error('Database error'));

            const request = createRequest({
                params: { id: '123' }
            });
            const response = createResponse();

            await deleteProvider(request, response);

            expect(response.statusCode).toBe(500);
            const data = response._getJSONData();
            expect(data.ok).toBe(false);
            expect(data.message).toBe('Internal server error');
        });
    });
});