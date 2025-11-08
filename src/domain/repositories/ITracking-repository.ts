import { ITracking } from '../models/interfaces/ITracking';
import { TrackingStatus } from '../entities/Tracking';

export interface ITrackingRepository {
  createTracking(tracking: ITracking, changedBy?: string): Promise<ITracking>;
  getTrackingByOrderNumber(orderNumber: string): Promise<ITracking | null>;
  updateTrackingStatus(trackingNumber: string, status: TrackingStatus, changedBy?: string): Promise<ITracking>;
  addNotification(trackingNumber: string, notification: any): Promise<void>;
}
