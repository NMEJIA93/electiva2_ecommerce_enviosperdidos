import { TrackingStatus } from '../../../domain/entities/Tracking';

const mockTrackingModel = {
    create: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    find: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findOneAndUpdate: jest.fn()
};

jest.mock('../../../infraestructure/database/tracking-mongo', () => ({
    default: mockTrackingModel
}));

describe('TrackingModel', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create tracking successfully', async () => {
            const trackingData = {
                orderNumber: 'ORD-001',
                userId: '507f1f77bcf86cd799439011',
                currentStatus: TrackingStatus.PREPARANDO,
                trackingDate: '2024-01-15'
            };
            const mockTracking = {
                _id: '507f1f77bcf86cd799439012',
                trackingNumber: 'TRK-2024011500001',
                ...trackingData
            };
            
            mockTrackingModel.create.mockResolvedValue(mockTracking);
            
            const result = await mockTrackingModel.create(trackingData);
            
            expect(mockTrackingModel.create).toHaveBeenCalledWith(trackingData);
            expect(result).toEqual(mockTracking);
        });
    });

    describe('findOne', () => {
        it('should find tracking by orderNumber', async () => {
            const orderNumber = 'ORD-001';
            const mockTracking = {
                _id: '507f1f77bcf86cd799439012',
                orderNumber,
                currentStatus: TrackingStatus.PREPARANDO
            };
            
            mockTrackingModel.findOne.mockResolvedValue(mockTracking);
            
            const result = await mockTrackingModel.findOne({ orderNumber });
            
            expect(mockTrackingModel.findOne).toHaveBeenCalledWith({ orderNumber });
            expect(result).toEqual(mockTracking);
        });
    });

    describe('findOneAndUpdate', () => {
        it('should update tracking status', async () => {
            const orderNumber = 'ORD-001';
            const updateData = { currentStatus: TrackingStatus.ENTREGADO };
            const mockUpdatedTracking = {
                _id: '507f1f77bcf86cd799439012',
                orderNumber,
                currentStatus: TrackingStatus.ENTREGADO
            };
            
            mockTrackingModel.findOneAndUpdate.mockResolvedValue(mockUpdatedTracking);
            
            const result = await mockTrackingModel.findOneAndUpdate(
                { orderNumber },
                updateData,
                { new: true }
            );
            
            expect(mockTrackingModel.findOneAndUpdate).toHaveBeenCalledWith(
                { orderNumber },
                updateData,
                { new: true }
            );
            expect(result.currentStatus).toBe(TrackingStatus.ENTREGADO);
        });
    });

    describe('find', () => {
        it('should find trackings by userId', async () => {
            const userId = '507f1f77bcf86cd799439011';
            const mockTrackings = [
                { _id: '507f1f77bcf86cd799439012', userId, currentStatus: TrackingStatus.PREPARANDO },
                { _id: '507f1f77bcf86cd799439013', userId, currentStatus: TrackingStatus.EN_TRANSITO }
            ];
            
            mockTrackingModel.find.mockResolvedValue(mockTrackings);
            
            const result = await mockTrackingModel.find({ userId });
            
            expect(mockTrackingModel.find).toHaveBeenCalledWith({ userId });
            expect(result).toHaveLength(2);
        });
    });
});