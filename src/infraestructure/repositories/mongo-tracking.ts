  import TrackingModel, { ITrackingMongo } from '../database/tracking-mongo';
  import { ITrackingRepository } from '../../domain/repositories/ITracking-repository';
  import { ITracking } from '../../domain/models/interfaces/ITracking';
  import { TrackingStatus } from '../../domain/entities/Tracking';

  export class MongoTrackingRepository implements ITrackingRepository {
    async createTracking(tracking: ITracking, changedBy?: string): Promise<ITracking> {
      if (changedBy && tracking.statusHistory && tracking.statusHistory.length > 0) {
        tracking.statusHistory[0].changedBy = changedBy;
      }
      const created = await TrackingModel.create(tracking);
      if (!created.trackingNumber && created.trackingSeq && created.trackingDate) {
        const trackingNumber = `TRK-${created.trackingDate}-${String(created.trackingSeq).padStart(5, '0')}`;
        created.trackingNumber = trackingNumber;
        await created.save();
      }
      return created.toObject();
    }

    async getTrackingByOrderNumber(orderNumber: string): Promise<ITracking | null> {
      const found = await TrackingModel.findOne({ orderNumber });
      return found ? found.toObject() : null;
    }

    async updateTrackingStatus(trackingNumber: string, status: TrackingStatus, changedBy?: string): Promise<ITracking> {
      const updated = await TrackingModel.findOneAndUpdate(
        { trackingNumber },
        { $set: { currentStatus: status }, $push: { statusHistory: { status, timestamp: new Date(), changedBy: changedBy || 'system' } } },
        { new: true }
      );
      return updated.toObject();
    }

    async addNotification(trackingNumber: string, notification: any): Promise<void> {
      await TrackingModel.findOneAndUpdate(
        { trackingNumber },
        { $push: { notifications: notification } }
      );
    }

    async updateNotification(trackingNumber: string, notificationId: string, patch: any): Promise<void> {
      const set: any = {};
      if (patch.sent !== undefined) set['notifications.$.sent'] = patch.sent;
      if (patch.retries !== undefined) set['notifications.$.retries'] = patch.retries;
      if (patch.message !== undefined) set['notifications.$.message'] = patch.message;
      if (patch.timestamp !== undefined) set['notifications.$.timestamp'] = patch.timestamp;

      await TrackingModel.findOneAndUpdate(
        { trackingNumber, 'notifications._id': notificationId },
        { $set: set }
      );
    }

    async findTrackingsByUser(userId: string): Promise<ITracking[]> {
      const found = await TrackingModel.find({ userId });
      return found.map(doc => doc.toObject());
    }

    // Devuelve una lista de { trackingNumber, userEmail, notification } para notificaciones pendientes
    async findPendingNotifications(maxRetries: number): Promise<Array<{ trackingNumber: string; userEmail?: string; notification: any }>> {
      // Proyección para filtrar documentos con notificaciones pendientes
      const docs = await TrackingModel.find({ 'notifications.sent': false }).lean();
      const results: Array<{ trackingNumber: string; userEmail?: string; notification: any }> = [];
      for (const d of docs) {
        const pending = (d.notifications || []).filter((n: any) => !n.sent && (n.retries || 0) < maxRetries);
        for (const p of pending) {
          results.push({ trackingNumber: d.trackingNumber, userEmail: d.userEmail, notification: p });
        }
      }
      return results;
    }
  }
