import { notificationDispatcher, NotificationEvent } from '../../domain/notifications/notification-dispatcher';
import { NodemailerEmailService } from '../services/nodemailer-email';
import { MongoTrackingRepository } from '../repositories/mongo-tracking';

const emailService = new NodemailerEmailService();
const trackingRepo = new MongoTrackingRepository();

// Email queue to prevent spam
let emailQueue: Array<() => Promise<void>> = [];
let isProcessingQueue = false;

const processEmailQueue = async () => {
  if (isProcessingQueue || emailQueue.length === 0) return;
  
  isProcessingQueue = true;
  const emailDelay = Number(process.env.EMAIL_DELAY_MS) || 2000;
  
  while (emailQueue.length > 0) {
    const emailTask = emailQueue.shift();
    if (emailTask) {
      await emailTask();
      if (emailQueue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, emailDelay));
      }
    }
  }
  
  isProcessingQueue = false;
};

const handler = async (event: NotificationEvent) => {
  if (event.type !== 'tracking.notification') return;

  const { trackingNumber, userEmail, subject, message, type, notificationId } = event.payload;

  // Add email to queue
  emailQueue.push(async () => {
    let sent = false;
    if (userEmail) {
      try {
        const result = await emailService.sendTestEmail(userEmail, subject || 'Notificación de tracking', message, `<p>${message}</p>`);
        sent = !!result.success;
      } catch (err) {
        console.error('[EMAIL OBSERVER] error sending email', err);
        sent = false;
      }
    } else {
      sent = true; // Mark as sent to avoid retries when no email is available
    }

    // Update notification status
    try {
      if (trackingNumber && notificationId) {
        await trackingRepo.updateNotification(trackingNumber, notificationId, { 
          sent, 
          retries: sent ? 0 : (userEmail ? 1 : 0),
          timestamp: new Date(), 
          message 
        });
      }
    } catch (err) {
      console.error('[EMAIL OBSERVER] error saving notification to tracking', err);
    }
  });

  // Start processing queue
  processEmailQueue();
};

notificationDispatcher.register(handler);

export default handler;
