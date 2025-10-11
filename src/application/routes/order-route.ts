import { Router } from 'express';
import { 
    createOrder, 
    confirmOrderController, 
    getOrderByIdController, 
    getOrderByNumberController, 
    getUserOrdersController 
} from '../controllers/order-controller';
import { authenticateToken } from '../middlewares/auth-middleware';

const router = Router();

// All order routes require authentication
router.use(authenticateToken);

// Create order from preorder
router.post('/order', createOrder);

router.post('/:orderId/confirm', confirmOrderController);

router.get('/:orderId', getOrderByIdController);

router.get('/number/:orderNumber', getOrderByNumberController);

router.get('/user/:userId', getUserOrdersController);

export default router;
