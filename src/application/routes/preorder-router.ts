import express, { Router, Request, Response } from 'express';
import { usePreOrderValidation } from '../middlewares/preorder-validators';

import {
    authenticateToken,
    authorizeProfileAccess
} from '../middlewares/auth-middleware';

import {
    createdCheckoutOrder,
    confirmPreorder
} from '../controllers/preorder-controller';

const preOrderRouter: Router = express.Router();

preOrderRouter.post('/user/preorder', usePreOrderValidation, createdCheckoutOrder);
preOrderRouter.patch('/preorder/:preorderId/confirm', authenticateToken, confirmPreorder);

export default preOrderRouter;