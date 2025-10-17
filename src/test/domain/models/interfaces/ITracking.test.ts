import { ITracking } from '../../../../domain/models/interfaces/ITracking';
import { TrackingStatus, StatusHistory, NotificationHistory } from '../../../../domain/entities/Tracking';

describe('ITracking Interface', () => {
  const mockStatusHistory: StatusHistory = {
    status: TrackingStatus.PENDIENTE,
    timestamp: new Date('2024-01-01'),
    changedBy: 'system'
  };

  const mockNotification: NotificationHistory = {
    type: 'email',
    message: 'Order created',
    timestamp: new Date('2024-01-01'),
    sent: true,
    retries: 0
  };

  test('should accept valid tracking object with all properties', () => {
    const tracking: ITracking = {
      trackingNumber: 'TRK-123456',
      orderNumber: 'ORD-789',
      userId: 'user-123',
      userEmail: 'test@example.com',
      currentStatus: TrackingStatus.PENDIENTE,
      statusHistory: [mockStatusHistory],
      notifications: [mockNotification],
      trackingSeq: 1,
      trackingDate: '2024-01-01'
    };

    expect(tracking.trackingNumber).toBe('TRK-123456');
    expect(tracking.orderNumber).toBe('ORD-789');
    expect(tracking.userId).toBe('user-123');
    expect(tracking.userEmail).toBe('test@example.com');
    expect(tracking.currentStatus).toBe(TrackingStatus.PENDIENTE);
    expect(tracking.statusHistory).toEqual([mockStatusHistory]);
    expect(tracking.notifications).toEqual([mockNotification]);
    expect(tracking.trackingSeq).toBe(1);
    expect(tracking.trackingDate).toBe('2024-01-01');
  });

  test('should accept tracking object with only required properties', () => {
    const tracking: ITracking = {
      orderNumber: 'ORD-456',
      userId: 'user-456',
      currentStatus: TrackingStatus.EN_TRANSITO,
      statusHistory: [],
      notifications: []
    };

    expect(tracking.orderNumber).toBe('ORD-456');
    expect(tracking.userId).toBe('user-456');
    expect(tracking.currentStatus).toBe(TrackingStatus.EN_TRANSITO);
    expect(tracking.statusHistory).toEqual([]);
    expect(tracking.notifications).toEqual([]);
    expect(tracking.trackingNumber).toBeUndefined();
    expect(tracking.userEmail).toBeUndefined();
    expect(tracking.trackingSeq).toBeUndefined();
    expect(tracking.trackingDate).toBeUndefined();
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
      const tracking: ITracking = {
        orderNumber: 'ORD-TEST',
        userId: 'user-test',
        currentStatus: status,
        statusHistory: [],
        notifications: []
      };

      expect(tracking.currentStatus).toBe(status);
    });
  });

  test('should handle multiple status history entries', () => {
    const multipleHistory: StatusHistory[] = [
      {
        status: TrackingStatus.PENDIENTE,
        timestamp: new Date('2024-01-01'),
        changedBy: 'system'
      },
      {
        status: TrackingStatus.PREPARANDO,
        timestamp: new Date('2024-01-02'),
        changedBy: 'admin'
      }
    ];

    const tracking: ITracking = {
      orderNumber: 'ORD-MULTI',
      userId: 'user-multi',
      currentStatus: TrackingStatus.PREPARANDO,
      statusHistory: multipleHistory,
      notifications: []
    };

    expect(tracking.statusHistory).toHaveLength(2);
    expect(tracking.statusHistory[0].status).toBe(TrackingStatus.PENDIENTE);
    expect(tracking.statusHistory[1].status).toBe(TrackingStatus.PREPARANDO);
  });

  test('should handle multiple notifications', () => {
    const multipleNotifications: NotificationHistory[] = [
      {
        type: 'email',
        message: 'Order created',
        timestamp: new Date('2024-01-01'),
        sent: true,
        retries: 0
      },
      {
        type: 'sms',
        message: 'Order shipped',
        timestamp: new Date('2024-01-02'),
        sent: false,
        retries: 2
      }
    ];

    const tracking: ITracking = {
      orderNumber: 'ORD-NOTIF',
      userId: 'user-notif',
      currentStatus: TrackingStatus.EN_TRANSITO,
      statusHistory: [],
      notifications: multipleNotifications
    };

    expect(tracking.notifications).toHaveLength(2);
    expect(tracking.notifications[0].type).toBe('email');
    expect(tracking.notifications[1].type).toBe('sms');
  });
});