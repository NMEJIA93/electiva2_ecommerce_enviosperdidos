import { TrackingStatus, StatusHistory, NotificationHistory } from '../../entities/Tracking';

export interface ITracking {
  trackingNumber?: string;
  orderNumber: string;
  userId: string;
  userEmail?: string;
  currentStatus: TrackingStatus;
  statusHistory: StatusHistory[];
  notifications: NotificationHistory[];
  trackingSeq?: number;
  trackingDate?: string;
}
