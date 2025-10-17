import { createRequest, createResponse } from 'node-mocks-http';

// Mock del repositorio y servicio antes de importar el controlador
const mockRepo = {
    findTrackingsByUser: jest.fn()
};

const mockService = {
    createTracking: jest.fn(),
    getTracking: jest.fn(),
    updateStatus: jest.fn()
};

jest.mock('../../../infraestructure/repositories/mongo-tracking', () => ({
    MongoTrackingRepository: jest.fn().mockImplementation(() => mockRepo)
}));

jest.mock('../../../domain/services/tracking-services', () => ({
    TrackingService: jest.fn().mockImplementation(() => mockService)
}));

// Importar el controlador después de los mocks
import { getTrackingByUser, createTracking, getTracking, updateTrackingStatus } from '../../../application/controllers/tracking-controller';

describe('Tracking Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getTrackingByUser', () => {
        it('should return trackings by user', async () => {
            const mockTrackings = [
                { trackingNumber: 'TRK-001', orderNumber: 'ORD-001' }
            ];
            mockRepo.findTrackingsByUser.mockResolvedValue(mockTrackings);

            const request = createRequest({
                params: { userId: 'user1' }
            });
            const response = createResponse();

            await getTrackingByUser(request, response);

            expect(response.statusCode).toBe(200);
            const data = response._getJSONData();
            expect(data).toEqual(mockTrackings);
        });

        it('should return 500 on error', async () => {
            mockRepo.findTrackingsByUser.mockRejectedValue(new Error('Database error'));

            const request = createRequest({
                params: { userId: 'user1' }
            });
            const response = createResponse();

            await getTrackingByUser(request, response);

            expect(response.statusCode).toBe(500);
            const data = response._getJSONData();
            expect(data.error).toBe('Error fetching trackings by user');
        });
    });

    describe('createTracking', () => {
        it('should create tracking successfully', async () => {
            const mockTracking = { trackingNumber: 'TRK-001', orderNumber: 'ORD-001' };
            mockService.createTracking.mockResolvedValue(mockTracking);

            const request = createRequest({
                body: { orderNumber: 'ORD-001', userId: 'user1' },
                user: { email: 'test@example.com' }
            });
            const response = createResponse();

            await createTracking(request, response);

            expect(response.statusCode).toBe(201);
            const data = response._getJSONData();
            expect(data).toEqual(mockTracking);
        });

        it('should return 500 on error', async () => {
            mockService.createTracking.mockRejectedValue(new Error('Service error'));

            const request = createRequest({
                body: { orderNumber: 'ORD-001', userId: 'user1' }
            });
            const response = createResponse();

            await createTracking(request, response);

            expect(response.statusCode).toBe(500);
            const data = response._getJSONData();
            expect(data.error).toBe('Error creating tracking');
        });
    });

    describe('getTracking', () => {
        it('should return tracking by order number', async () => {
            const mockTracking = { trackingNumber: 'TRK-001', orderNumber: 'ORD-001' };
            mockService.getTracking.mockResolvedValue(mockTracking);

            const request = createRequest({
                params: { orderNumber: 'ORD-001' },
                user: { id: 'user1' }
            });
            const response = createResponse();

            await getTracking(request, response);

            expect(response.statusCode).toBe(200);
            const data = response._getJSONData();
            expect(data).toEqual(mockTracking);
        });

        it('should return 404 when tracking not found', async () => {
            mockService.getTracking.mockResolvedValue(null);

            const request = createRequest({
                params: { orderNumber: 'ORD-999' }
            });
            const response = createResponse();

            await getTracking(request, response);

            expect(response.statusCode).toBe(404);
            const data = response._getJSONData();
            expect(data.error).toBe('Tracking not found');
        });

        it('should return 500 on service error', async () => {
            mockService.getTracking.mockRejectedValue(new Error('Service error'));

            const request = createRequest({
                params: { orderNumber: 'ORD-001' }
            });
            const response = createResponse();

            await getTracking(request, response);

            expect(response.statusCode).toBe(500);
            const data = response._getJSONData();
            expect(data.error).toBe('Error fetching tracking');
        });
    });

    describe('updateTrackingStatus', () => {
        it('should update tracking status successfully', async () => {
            const mockUpdatedTracking = { trackingNumber: 'TRK-001', status: 'SHIPPED' };
            mockService.updateStatus.mockResolvedValue(mockUpdatedTracking);

            const request = createRequest({
                body: { trackingNumber: 'TRK-001', status: 'SHIPPED' },
                user: { email: 'admin@example.com' }
            });
            const response = createResponse();

            await updateTrackingStatus(request, response);

            expect(response.statusCode).toBe(200);
            const data = response._getJSONData();
            expect(data).toEqual(mockUpdatedTracking);
        });

        it('should return 500 on error', async () => {
            mockService.updateStatus.mockRejectedValue(new Error('Service error'));

            const request = createRequest({
                body: { trackingNumber: 'TRK-001', status: 'SHIPPED' }
            });
            const response = createResponse();

            await updateTrackingStatus(request, response);

            expect(response.statusCode).toBe(500);
            const data = response._getJSONData();
            expect(data.error).toBe('Error updating status');
        });
    });
});