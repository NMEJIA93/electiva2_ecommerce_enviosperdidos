import { ITrackingRepository } from '../../../domain/repositories/ITracking-repository';
import { ITracking } from '../../../domain/models/interfaces/ITracking';
import { TrackingStatus } from '../../../domain/entities/Tracking';

describe('ITrackingRepository', () => {
  let mockRepository: ITrackingRepository;

  beforeEach(() => {
    mockRepository = {
      createTracking: jest.fn(),
      getTrackingByOrderNumber: jest.fn(),
      updateTrackingStatus: jest.fn(),
      addNotification: jest.fn()
    };
  });

  const mockTracking: ITracking = {
    trackingNumber: 'TRK-001',
    orderNumber: 'ORD-001',
    userId: 'user1',
    currentStatus: TrackingStatus.PENDIENTE,
    statusHistory: [],
    notifications: []
  };

  describe('createTracking', () => {
    it('should create and return tracking', async () => {
      (mockRepository.createTracking as jest.Mock).mockResolvedValue(mockTracking);

      const result = await mockRepository.createTracking(mockTracking, 'admin');

      expect(result).toEqual(mockTracking);
      expect(mockRepository.createTracking).toHaveBeenCalledWith(mockTracking, 'admin');
    });

    it('should create tracking without changedBy parameter', async () => {
      (mockRepository.createTracking as jest.Mock).mockResolvedValue(mockTracking);

      const result = await mockRepository.createTracking(mockTracking);

      expect(result).toEqual(mockTracking);
      expect(mockRepository.createTracking).toHaveBeenCalledWith(mockTracking);
    });
  });

  describe('getTrackingByOrderNumber', () => {
    it('should return tracking by order number', async () => {
      (mockRepository.getTrackingByOrderNumber as jest.Mock).mockResolvedValue(mockTracking);

      const result = await mockRepository.getTrackingByOrderNumber('ORD-001');

      expect(result).toEqual(mockTracking);
      expect(mockRepository.getTrackingByOrderNumber).toHaveBeenCalledWith('ORD-001');
    });

    it('should return null if tracking not found', async () => {
      (mockRepository.getTrackingByOrderNumber as jest.Mock).mockResolvedValue(null);

      const result = await mockRepository.getTrackingByOrderNumber('ORD-999');

      expect(result).toBeNull();
      expect(mockRepository.getTrackingByOrderNumber).toHaveBeenCalledWith('ORD-999');
    });
  });

  describe('updateTrackingStatus', () => {
    it('should update tracking status and return updated tracking', async () => {
      const updatedTracking = { ...mockTracking, currentStatus: TrackingStatus.EN_TRANSITO };
      (mockRepository.updateTrackingStatus as jest.Mock).mockResolvedValue(updatedTracking);

      const result = await mockRepository.updateTrackingStatus('TRK-001', TrackingStatus.EN_TRANSITO, 'admin');

      expect(result).toEqual(updatedTracking);
      expect(mockRepository.updateTrackingStatus).toHaveBeenCalledWith('TRK-001', TrackingStatus.EN_TRANSITO, 'admin');
    });

    it('should update tracking status without changedBy parameter', async () => {
      const updatedTracking = { ...mockTracking, currentStatus: TrackingStatus.EN_TRANSITO };
      (mockRepository.updateTrackingStatus as jest.Mock).mockResolvedValue(updatedTracking);

      const result = await mockRepository.updateTrackingStatus('TRK-001', TrackingStatus.EN_TRANSITO);

      expect(result).toEqual(updatedTracking);
      expect(mockRepository.updateTrackingStatus).toHaveBeenCalledWith('TRK-001', TrackingStatus.EN_TRANSITO);
    });
  });

  describe('addNotification', () => {
    it('should add notification to tracking', async () => {
      const notification = { type: 'email', message: 'Status updated', timestamp: new Date(), sent: true, retries: 0 };
      (mockRepository.addNotification as jest.Mock).mockResolvedValue(undefined);

      await mockRepository.addNotification('TRK-001', notification);

      expect(mockRepository.addNotification).toHaveBeenCalledWith('TRK-001', notification);
    });
  });
});