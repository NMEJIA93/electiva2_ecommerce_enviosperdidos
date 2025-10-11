import express, { Router, Request, Response } from 'express';
import { usePreOrderValidation } from '../middlewares/preorder-validators';

import {
    authenticateToken,
    authorizeProfileAccess,
    authorizeUserAccess,
    authorizePreorderConfirmation
} from '../middlewares/auth-middleware';

import {
    createdCheckoutOrder,
    confirmPreorder
} from '../controllers/preorder-controller';

const preOrderRouter: Router = express.Router();

preOrderRouter.post('/user/:userId/preorder', authenticateToken, authorizeUserAccess, usePreOrderValidation, createdCheckoutOrder);
preOrderRouter.patch('/user/:userId/preorder/:preorderId/confirm', authenticateToken, authorizePreorderConfirmation, confirmPreorder);

export default preOrderRouter;
