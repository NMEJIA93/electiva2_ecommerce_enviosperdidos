import { TrackingStatus } from '../../domain/entities/Tracking';

export interface CreateTrackingDTO {
  orderNumber: string;
  userId: string;
  userEmail?: string;
}

export interface UpdateTrackingStatusDTO {
  trackingNumber: string;
  status: TrackingStatus;
}

export interface TrackingResponseDTO {
  trackingNumber: string;
  orderNumber: string;
  userId: string;
  currentStatus: TrackingStatus;
  statusHistory: Array<{ status: TrackingStatus; timestamp: Date }>;
  notifications: Array<{ type: string; message: string; timestamp: Date; sent: boolean; retries: number }>;
}
