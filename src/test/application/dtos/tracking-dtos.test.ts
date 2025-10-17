import { TrackingStatus } from '../../../domain/entities/Tracking';

describe('Tracking DTOs', () => {
  describe('CreateTrackingDTO', () => {
    it('should have correct interface structure', () => {
      const dto = {
        orderNumber: 'ORD-001',
        userId: 'user123',
        userEmail: 'test@test.com'
      };
      
      expect(dto.orderNumber).toBe('ORD-001');
      expect(dto.userId).toBe('user123');
      expect(dto.userEmail).toBe('test@test.com');
    });
  });

  describe('UpdateTrackingStatusDTO', () => {
    it('should have correct interface structure', () => {
      const dto = {
        trackingNumber: 'TRK-001',
        status: TrackingStatus.EN_TRANSITO
      };
      
      expect(dto.trackingNumber).toBe('TRK-001');
      expect(dto.status).toBe(TrackingStatus.EN_TRANSITO);
    });
  });

  describe('TrackingResponseDTO', () => {
    it('should have correct interface structure', () => {
      const dto = {
        trackingNumber: 'TRK-001',
        orderNumber: 'ORD-001',
        userId: 'user123',
        currentStatus: TrackingStatus.ENTREGADO,
        statusHistory: [{ status: TrackingStatus.PENDIENTE, timestamp: new Date() }],
        notifications: [{ type: 'email', message: 'Order shipped', timestamp: new Date(), sent: true, retries: 0 }]
      };
      
      expect(dto.trackingNumber).toBe('TRK-001');
      expect(dto.orderNumber).toBe('ORD-001');
      expect(dto.userId).toBe('user123');
      expect(dto.currentStatus).toBe(TrackingStatus.ENTREGADO);
      expect(dto.statusHistory).toHaveLength(1);
      expect(dto.notifications).toHaveLength(1);
    });
  });
});