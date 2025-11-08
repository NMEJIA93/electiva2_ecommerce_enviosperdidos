import { notificationDispatcher, NotificationEvent } from '../../domain/notifications/notification-dispatcher';
import { NodemailerEmailService } from '../services/nodemailer-email';
import { MongoTrackingRepository } from '../repositories/mongo-tracking';

const emailService = new NodemailerEmailService();
const trackingRepo = new MongoTrackingRepository();

const handler = async (event: NotificationEvent) => {
  if (event.type !== 'tracking.notification') return;

  const { trackingNumber, userEmail, subject, message, type, notificationId } = event.payload;

  let sent = false;
  if (userEmail) {
    try {
      const result = await emailService.sendTestEmail(userEmail, subject || 'Notificación de tracking', message, `<p>${message}</p>`);
      sent = !!result.success;
    } catch (err) {
      console.error('[EMAIL OBSERVER] error sending email', err);
      sent = false;
    }
  }

  try {
    if (trackingNumber && notificationId) {
      await trackingRepo.updateNotification(trackingNumber, notificationId, { sent, retries: sent ? 0 : 1, timestamp: new Date(), message });
    } else if (trackingNumber) {
      const notification = {
        type: type || 'email',
        message,
        timestamp: new Date(),
        sent,
        retries: sent ? 0 : 1
      };
      await trackingRepo.addNotification(trackingNumber, notification);
    }
  } catch (err) {
    console.error('[EMAIL OBSERVER] error saving notification to tracking', err);
  }
};

notificationDispatcher.register(handler);

export default handler;
