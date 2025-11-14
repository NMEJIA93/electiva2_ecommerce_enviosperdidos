import { Request, Response } from 'express';
import { TrackingService } from '../../domain/services/tracking-services';
import { MongoTrackingRepository } from '../../infraestructure/repositories/mongo-tracking';
import { MongoUserRepository } from '../../infraestructure/repositories/mongo-user';
import { TrackingStatus } from '../../domain/entities/Tracking';
import { webSocketServer } from '../../app';

const trackingService = new TrackingService(new MongoTrackingRepository());
const userRepo = new MongoUserRepository();

export const getTrackingByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const repo = new MongoTrackingRepository();
    const trackings = await repo.findTrackingsByUser(userId);
    res.json(trackings);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching trackings by user', details: err });
  }
};

export const createTracking = async (req: Request, res: Response) => {
  try {
    const { orderNumber, userId, userEmail } = req.body;
    const changedBy = req.user?.email || 'System';
    
    // Create tracking immediately, get email asynchronously
    const trackingPromise = trackingService.createTracking({ orderNumber, userId, userEmail }, changedBy);
    
    // Get user email in parallel if needed
    let emailPromise = Promise.resolve(userEmail || req.user?.email);
    if (!userEmail && !req.user?.email && userId) {
      emailPromise = userRepo.findByIdNumber(userId).then(user => user?.email).catch(() => null);
    }
    
    const [tracking, finalEmail] = await Promise.all([trackingPromise, emailPromise]);
    
    // Update email if found and different
    if (finalEmail && finalEmail !== userEmail && tracking.userEmail !== finalEmail) {
      // Update asynchronously without waiting
      setImmediate(async () => {
        try {
          const repo = new MongoTrackingRepository();
          await repo.updateTrackingEmail(tracking.trackingNumber!, finalEmail);
        } catch (err) {
          console.error('Error updating tracking email:', err);
        }
      });
    }
    
    res.status(201).json(tracking);
  } catch (err) {
    res.status(500).json({ error: 'Error creating tracking', details: err });
  }
};

export const getTracking = async (req: Request, res: Response) => {
  try {
    const { orderNumber } = req.params;
    const userId = req.user?.id
    const tracking = await trackingService.getTracking(orderNumber);
    if (!tracking) return res.status(404).json({ error: 'Tracking not found' });
    res.json(tracking);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching tracking', details: err });
  }
};

export const updateTrackingStatus = async (req: Request, res: Response) => {
  try {
    const { trackingNumber, status } = req.body;
    const changedBy = req.user?.email || 'System';
    
    // Use WebSocket server for manual updates to emit real-time notifications
    const updated = await webSocketServer.manualStatusUpdate(trackingNumber, status as TrackingStatus, changedBy);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error updating status', details: err });
  }
};

export const cancelTracking = async (req: Request, res: Response) => {
  try {
    const { trackingNumber } = req.body;
    const changedBy = req.user?.email || 'System';
    
    const updated = await webSocketServer.manualStatusUpdate(trackingNumber, TrackingStatus.CANCELADO, changedBy);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error canceling tracking', details: err });
  }
};
