import 'dotenv/config'
import express, {Application, Request, Response} from 'express';

import appRouter from './application/routes/app-router'
import { dbConnection } from './infraestructure/config/config-db-mongo';
import { JWTConfig } from './infraestructure/config/jwt-config';
import { MongoUserRepository } from './infraestructure/repositories/mongo-user';
import { startNotificationRetryJob } from './infraestructure/jobs/notification-retry-job';
import './infraestructure/observers';
import './infraestructure/cron/inventoryCleanup'

const PORT:number = Number(process.env.PORT);

// Validate JWT configuration
JWTConfig.validateConfig();

// DB CONNECTION
dbConnection();

MongoUserRepository.initialize();
console.log('[APP] User repository initialized with verification code cleanup');

// Inicializar job de reintentos de notificaciones
startNotificationRetryJob();

const app:Application = express();

app.use(express.json());

app.use(appRouter);

app.listen(PORT, ()=>{
    console.log(`[APP] Server running on port ${PORT}`);
    console.log(`[APP] Server URL: http://localhost:${PORT}`);
})