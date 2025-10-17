import { Router } from 'express';
import { createTracking, getTracking, updateTrackingStatus } from '../controllers/tracking-controller';
import { authenticateToken } from '../middlewares/auth-middleware';

const router = Router();

// Crear tracking para una orden
router.post('/tracking', createTracking);

// Consultar tracking por número de orden
router.get('/tracking/:orderNumber', getTracking);

// Consultar tracking por userId
import { getTrackingByUser } from '../controllers/tracking-controller';
router.get('/tracking/user/:userId', getTrackingByUser);

// Actualizar estado del tracking (requiere autenticación)
router.put('/tracking/status', authenticateToken, updateTrackingStatus);

export default router;
