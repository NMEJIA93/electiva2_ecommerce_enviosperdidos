import { Router, Request, Response } from 'express';
import userRouter from './users-route';
import authRouter from './auth-route';
import productRouter from './product-route';
import inventoryRouter from './inventory-route';

// Swagger UI setup
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import providerRouter from './provider-route';
import categoryRouter from './categories-route';
const swaggerDocument = YAML.load('./swagger.yaml');

const appRouter: Router = Router();

appRouter.get('/', (request: Request, response: Response) => {
    response.status(200).json({
        ok: true,
        message: 'Api is working'
    });
});

// Swagger docs at /api/v1/api-docs
appRouter.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

appRouter.use('/api/v1', userRouter);
appRouter.use('/api/v1', authRouter);
appRouter.use('/api/v1', productRouter);
appRouter.use('/api/v1', providerRouter);
appRouter.use('/api/v1', categoryRouter);
appRouter.use('/api/v1', inventoryRouter);


export default appRouter;