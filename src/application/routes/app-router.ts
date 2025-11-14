import { Router, Request, Response } from 'express';
import userRouter from './users-route';
import authRouter from './auth-route';
import trackingRouter from './tracking-route';
import productRouter from './product-route';
import inventoryRouter from './inventory-route';
import providerRouter from './provider-route';
import categoryRouter from './categories-route';
import preorderRouter from './preorder-router';
import orderRouter from './order-route'; 
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import catalogRouter from './catalog-route';
import { Preorder } from '../../domain/entities/Preorder';

const swaggerDocument = YAML.load('./swagger.yaml');

const appRouter: Router = Router();

appRouter.get('/', (request: Request, response: Response) => {
    response.status(200).json({
        ok: true,
        message: 'Api is working'
    });
});

appRouter.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

appRouter.use('/api/v1', userRouter);
appRouter.use('/api/v1', authRouter);
appRouter.use('/api/v1', productRouter);
appRouter.use('/api/v1', trackingRouter);
appRouter.use('/api/v1', providerRouter);
appRouter.use('/api/v1', categoryRouter);
appRouter.use('/api/v1', inventoryRouter);
appRouter.use('/api/v1', catalogRouter);
appRouter.use('/api/v1', preorderRouter);
appRouter.use('/api/v1/orders', orderRouter);


export default appRouter;