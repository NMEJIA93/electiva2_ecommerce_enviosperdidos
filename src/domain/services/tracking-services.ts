import { ITrackingRepository } from '../repositories/ITracking-repository';
import { CreateTrackingDTO, UpdateTrackingStatusDTO } from '../../application/dtos/tracking-dtos';
import { TrackingStatus } from '../entities/Tracking';
import { notificationDispatcher } from '../notifications/notification-dispatcher';
import mongoose from 'mongoose';

export class TrackingService {
  constructor(private trackingRepo: ITrackingRepository) {}

  async createTracking(dto: CreateTrackingDTO, changedBy?: string) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0,10).replace(/-/g, '');
    const tracking = {
      orderNumber: dto.orderNumber,
      userId: dto.userId,
      userEmail: (dto as any).userEmail,
      currentStatus: TrackingStatus.PENDIENTE,
      statusHistory: [{ status: TrackingStatus.PENDIENTE, timestamp: new Date(), changedBy: changedBy || 'System' }],
      notifications: [],
      trackingDate: dateStr
    };
  const created = await this.trackingRepo.createTracking(tracking, changedBy);
    created.trackingNumber = `TRK-${created.trackingDate}-${String(created.trackingSeq).padStart(5, '0')}`;
    const notificationId = new mongoose.Types.ObjectId().toHexString();
    const notifyMessage = `Se ha creado el tracking ${created.trackingNumber} para la orden ${created.orderNumber}`;
    const notification = {
      _id: notificationId,
      type: 'created',
      message: notifyMessage,
      timestamp: new Date(),
      sent: false,
      retries: 0
    };

    await this.trackingRepo.addNotification(created.trackingNumber, notification);

    const notifyPayload = {
      notificationId,
      trackingNumber: created.trackingNumber,
      userId: created.userId,
      userEmail: created.userEmail || ((changedBy && changedBy !== 'System') ? changedBy : undefined),
      subject: 'Tracking creado',
      message: notifyMessage,
      type: 'tracking_created'
    };

    await notificationDispatcher.dispatch({ type: 'tracking.notification', payload: notifyPayload });

    return created;
  }

  async getTracking(orderNumber: string) {
    return await this.trackingRepo.getTrackingByOrderNumber(orderNumber);
  }

  async updateStatus(dto: UpdateTrackingStatusDTO, changedBy?: string) {
    const updated = await this.trackingRepo.updateTrackingStatus(dto.trackingNumber, dto.status, changedBy);

    const notificationId = new mongoose.Types.ObjectId().toHexString();
    const notifyMessage = `El tracking ${updated.trackingNumber} cambió a estado ${dto.status}`;
    const notification = {
      _id: notificationId,
      type: 'status_change',
      message: notifyMessage,
      timestamp: new Date(),
      sent: false,
      retries: 0
    };

    await this.trackingRepo.addNotification(updated.trackingNumber, notification);

    const userEmailFromTracking = (updated as any).userEmail;
    const notifyPayload = {
      notificationId,
      trackingNumber: updated.trackingNumber,
      userId: updated.userId,
      userEmail: userEmailFromTracking || ((changedBy && changedBy !== 'System') ? changedBy : undefined),
      subject: `Estado actualizado: ${dto.status}`,
      message: notifyMessage,
      type: 'tracking_status'
    };

    await notificationDispatcher.dispatch({ type: 'tracking.notification', payload: notifyPayload });

    return updated;
  }

  async addNotification(trackingNumber: string, notification: any) {
    await this.trackingRepo.addNotification(trackingNumber, notification);
  }
}
