import { Tracking, TrackingStatus } from '../../../domain/entities/Tracking';

describe('Tracking Entity', () => {
  test('should create a Tracking instance with all properties', () => {
    const trackingData = {
      trackingNumber: 'TRK-123456',
      orderNumber: 'ORD-789',
      userId: 'user-123',
      currentStatus: TrackingStatus.PENDIENTE,
      statusHistory: [],
      notifications: []
    };

    const tracking = new Tracking(trackingData);

    expect(tracking.trackingNumber).toBe('TRK-123456');
    expect(tracking.orderNumber).toBe('ORD-789');
    expect(tracking.userId).toBe('user-123');
    expect(tracking.currentStatus).toBe(TrackingStatus.PENDIENTE);
    expect(tracking.statusHistory).toEqual([]);
    expect(tracking.notifications).toEqual([]);
  });

  test('should create a Tracking with partial data', () => {
    const trackingData = {
      orderNumber: 'ORD-456',
      currentStatus: TrackingStatus.EN_TRANSITO
    };

    const tracking = new Tracking(trackingData);

    expect(tracking.orderNumber).toBe('ORD-456');
    expect(tracking.currentStatus).toBe(TrackingStatus.EN_TRANSITO);
    expect(tracking.trackingNumber).toBeUndefined();
    expect(tracking.userId).toBeUndefined();
  });

  test('should handle different tracking statuses', () => {
    const statuses = [
      TrackingStatus.PENDIENTE,
      TrackingStatus.PREPARANDO,
      TrackingStatus.EN_TRANSITO,
      TrackingStatus.EN_ENTREGA,
      TrackingStatus.ENTREGADO,
      TrackingStatus.CANCELADO
    ];

    statuses.forEach(status => {
      const tracking = new Tracking({
        orderNumber: 'ORD-TEST',
        currentStatus: status
      });

      expect(tracking.currentStatus).toBe(status);
    });
  });

  test('should handle tracking with status history', () => {
    const statusHistory = [
      {
        status: TrackingStatus.PENDIENTE,
        timestamp: new Date('2024-01-01T10:00:00Z'),
        changedBy: 'system'
      },
      {
        status: TrackingStatus.PREPARANDO,
        timestamp: new Date('2024-01-01T11:00:00Z'),
        changedBy: 'warehouse-user'
      }
    ];

    const tracking = new Tracking({
      trackingNumber: 'TRK-HISTORY',
      orderNumber: 'ORD-HISTORY',
      currentStatus: TrackingStatus.PREPARANDO,
      statusHistory,
      notifications: []
    });

    expect(tracking.statusHistory).toHaveLength(2);
    expect(tracking.statusHistory[0].status).toBe(TrackingStatus.PENDIENTE);
    expect(tracking.statusHistory[1].changedBy).toBe('warehouse-user');
  });

  test('should handle tracking with notifications', () => {
    const notifications = [
      {
        type: 'email',
        message: 'Order confirmed',
        timestamp: new Date('2024-01-01T10:00:00Z'),
        sent: true,
        retries: 0
      },
      {
        type: 'sms',
        message: 'Package in transit',
        timestamp: new Date('2024-01-01T12:00:00Z'),
        sent: false,
        retries: 2
      }
    ];

    const tracking = new Tracking({
      trackingNumber: 'TRK-NOTIF',
      orderNumber: 'ORD-NOTIF',
      currentStatus: TrackingStatus.EN_TRANSITO,
      statusHistory: [],
      notifications
    });

    expect(tracking.notifications).toHaveLength(2);
    expect(tracking.notifications[0].sent).toBe(true);
    expect(tracking.notifications[1].retries).toBe(2);
  });

  test('should handle complete tracking lifecycle', () => {
    const completeTracking = new Tracking({
      trackingNumber: 'TRK-COMPLETE-123',
      orderNumber: 'ORD-COMPLETE-456',
      userId: 'user-complete-789',
      currentStatus: TrackingStatus.ENTREGADO,
      statusHistory: [
        {
          status: TrackingStatus.PENDIENTE,
          timestamp: new Date('2024-01-01T09:00:00Z')
        },
        {
          status: TrackingStatus.PREPARANDO,
          timestamp: new Date('2024-01-01T10:00:00Z')
        },
        {
          status: TrackingStatus.EN_TRANSITO,
          timestamp: new Date('2024-01-01T14:00:00Z')
        },
        {
          status: TrackingStatus.EN_ENTREGA,
          timestamp: new Date('2024-01-02T09:00:00Z')
        },
        {
          status: TrackingStatus.ENTREGADO,
          timestamp: new Date('2024-01-02T15:30:00Z')
        }
      ],
      notifications: []
    });

    expect(completeTracking.trackingNumber).toBe('TRK-COMPLETE-123');
    expect(completeTracking.currentStatus).toBe(TrackingStatus.ENTREGADO);
    expect(completeTracking.statusHistory).toHaveLength(5);
  });

  test('should handle cancelled tracking', () => {
    const cancelledTracking = new Tracking({
      trackingNumber: 'TRK-CANCELLED',
      orderNumber: 'ORD-CANCELLED',
      userId: 'user-123',
      currentStatus: TrackingStatus.CANCELADO,
      statusHistory: [
        {
          status: TrackingStatus.PENDIENTE,
          timestamp: new Date('2024-01-01T09:00:00Z')
        },
        {
          status: TrackingStatus.CANCELADO,
          timestamp: new Date('2024-01-01T10:00:00Z'),
          changedBy: 'customer'
        }
      ],
      notifications: []
    });

    expect(cancelledTracking.currentStatus).toBe(TrackingStatus.CANCELADO);
    expect(cancelledTracking.statusHistory[1].changedBy).toBe('customer');
  });

  test('should handle tracking with special characters in numbers', () => {
    const tracking = new Tracking({
      trackingNumber: 'TRK-SPECIAL-Ñ-123!@#',
      orderNumber: 'ORD-SPECIAL-ÁÉÍ-456',
      userId: 'user-unicode-ñ',
      currentStatus: TrackingStatus.PENDIENTE,
      statusHistory: [],
      notifications: []
    });

    expect(tracking.trackingNumber).toBe('TRK-SPECIAL-Ñ-123!@#');
    expect(tracking.orderNumber).toBe('ORD-SPECIAL-ÁÉÍ-456');
    expect(tracking.userId).toBe('user-unicode-ñ');
  });
});