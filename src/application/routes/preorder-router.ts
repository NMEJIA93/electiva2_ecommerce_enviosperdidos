import express, { Router, Request, Response } from 'express';
import { usePreOrderValidation } from '../middlewares/preorder-validators';

import {
    authenticateToken,
    authorizeProfileAccess
} from '../middlewares/auth-middleware';

import {
    createdCheckoutOrder
} from '../controllers/preorder-controller';

const orderRouter: Router = express.Router();

orderRouter.post('/user/preorder',usePreOrderValidation, createdCheckoutOrder)

export default orderRouter;