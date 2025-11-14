import { createRequest, createResponse } from 'node-mocks-http';
import { getCatalog } from '../../../application/controllers/catalog-controller';

jest.mock('../../../domain/services/catalog-services', () => ({
    findCatalog: jest.fn()
}));

jest.mock('../../../infraestructure/repositories/mongo-catalog', () => ({
    MongoCatalogRepository: jest.fn().mockImplementation(() => ({}))
}));

describe('Catalog Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getCatalog', () => {
        it('should return catalog successfully', async () => {
            const { findCatalog } = require('../../../domain/services/catalog-services');
            const mockCatalog = [
                { id: '1', name: 'Product 1', price: 100 },
                { id: '2', name: 'Product 2', price: 200 }
            ];
            findCatalog.mockResolvedValue(mockCatalog);

            const request = createRequest();
            const response = createResponse();

            await getCatalog(request, response);

            expect(response.statusCode).toBe(200);
            const data = response._getJSONData();
            expect(data.ok).toBe(true);
            expect(data.catalog).toEqual(mockCatalog);
        });

        it('should return 500 on service error', async () => {
            const { findCatalog } = require('../../../domain/services/catalog-services');
            findCatalog.mockRejectedValue(new Error('Service error'));

            const request = createRequest();
            const response = createResponse();

            await getCatalog(request, response);

            expect(response.statusCode).toBe(500);
        });
    });
});