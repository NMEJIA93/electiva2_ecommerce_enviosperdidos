import { createRequest, createResponse } from 'node-mocks-http';
import { updateInventory, updateReserved, getInventoryById } from '../../../application/controllers/inventory-controller';

jest.mock('../../../domain/services/inventory-services', () => ({
    updateInventoryById: jest.fn(),
    updateReservedStock: jest.fn(),
    findInventoryById: jest.fn()
}));

jest.mock('../../../infraestructure/repositories/mongo-inventory', () => ({
    MongoInventoryRepository: jest.fn().mockImplementation(() => ({}))
}));

describe('Inventory Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('updateInventory', () => {
        it('should update inventory successfully', async () => {
            const { updateInventoryById } = require('../../../domain/services/inventory-services');
            const mockInventory = { id: '123', stock: 100, price: 50 };
            updateInventoryById.mockResolvedValue(mockInventory);

            const request = createRequest({
                params: { id: '123' },
                body: { stock: 100, price: 50 }
            });
            const response = createResponse();

            await updateInventory(request, response);

            expect(response.statusCode).toBe(200);
            const data = response._getJSONData();
            expect(data.ok).toBe(true);
            expect(data.inventory).toEqual(mockInventory);
        });

        it('should return 500 on service error', async () => {
            const { updateInventoryById } = require('../../../domain/services/inventory-services');
            updateInventoryById.mockRejectedValue(new Error('Service error'));

            const request = createRequest({
                params: { id: '123' },
                body: { stock: 100 }
            });
            const response = createResponse();

            await updateInventory(request, response);

            expect(response.statusCode).toBe(500);
        });
    });

    describe('updateReserved', () => {
        it('should update reserved stock successfully', async () => {
            const { updateReservedStock } = require('../../../domain/services/inventory-services');
            const mockInventory = { id: '123', reservedStock: 10 };
            updateReservedStock.mockResolvedValue(mockInventory);

            const request = createRequest({
                params: { id: '123' },
                body: { reservedStock: 10, userId: 'user1', action: 1 }
            });
            const response = createResponse();

            await updateReserved(request, response);

            expect(response.statusCode).toBe(200);
        });
    });

    describe('getInventoryById', () => {
        it('should return inventory by id', async () => {
            const { findInventoryById } = require('../../../domain/services/inventory-services');
            const mockInventory = { id: '123', stock: 100 };
            findInventoryById.mockResolvedValue(mockInventory);

            const request = createRequest({
                params: { id: '123' }
            });
            const response = createResponse();

            await getInventoryById(request, response);

            expect(response.statusCode).toBe(200);
        });
    });
});