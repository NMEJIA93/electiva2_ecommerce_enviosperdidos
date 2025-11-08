import { MongoTrackingRepository } from '../repositories/mongo-tracking';
import { notificationDispatcher } from '../../domain/notifications/notification-dispatcher';
import cron from 'node-cron';

const repo = new MongoTrackingRepository();

const MAX_RETRIES = Number(process.env.NOTIFICATION_MAX_RETRIES);

const CRON_TIME = process.env.NOTIFICATION_CRON;

export const startNotificationRetryJob = () => {
  if (!CRON_TIME) {
    console.log('[JOB] NOTIFICATION_CRON no está definido — el job de reintentos no será programado');
    return;
  }

  console.log(`[JOB] Notification retry job scheduled via cron expression: ${CRON_TIME} (maxRetries=${MAX_RETRIES})`);
  cron.schedule(CRON_TIME, async () => {
    await runJobIteration();
  });
};

async function runJobIteration() {
  try {
    const candidates = await (repo as any).findPendingNotifications(MAX_RETRIES);

    for (const item of candidates) {
      const { trackingNumber, notification } = item;

      await repo.updateNotification(trackingNumber, notification._id.toString(), { retries: (notification.retries || 0) + 1 });

      const payload = {
        notificationId: notification._id.toString(),
        trackingNumber,
        userEmail: (item.userEmail),
        subject: `Reintento: ${notification.type}`,
        message: notification.message,
        type: notification.type
      };

      await notificationDispatcher.dispatch({ type: 'tracking.notification', payload });
    }
  } catch (err) {
    console.error('[JOB] Error in notification retry job', err);
  }
}

export default startNotificationRetryJob;
