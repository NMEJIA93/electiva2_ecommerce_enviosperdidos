import { Request, Response } from 'express';
import { TrackingService } from '../../domain/services/tracking-services';
import { MongoTrackingRepository } from '../../infraestructure/repositories/mongo-tracking';
import { TrackingStatus } from '../../domain/entities/Tracking';
import { webSocketServer } from '../../app';

const trackingService = new TrackingService(new MongoTrackingRepository());

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
    const emailToStore = userEmail || req.user?.email;
    const tracking = await trackingService.createTracking({ orderNumber, userId, userEmail: emailToStore }, changedBy);
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
