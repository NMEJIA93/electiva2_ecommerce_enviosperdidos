import 'dotenv/config'
import express, {Application, Request, Response} from 'express';
import { createServer } from 'http';

import appRouter from './application/routes/app-router'
import { dbConnection } from './infraestructure/config/config-db-mongo';
import { JWTConfig } from './infraestructure/config/jwt-config';
import { MongoUserRepository } from './infraestructure/repositories/mongo-user';
import { startNotificationRetryJob } from './infraestructure/jobs/notification-retry-job';
import { WebSocketServer } from './infraestructure/websocket/websocket-server';
import './infraestructure/observers';

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
const httpServer = createServer(app);

// Initialize WebSocket server
export const webSocketServer = new WebSocketServer(httpServer);

app.use(express.json());
app.use(appRouter);

httpServer.listen(PORT, ()=>{
    console.log(`Maldito genio el servidor esta corriendo por el puesto ${PORT}`);
    console.log(`http://localhost:${PORT}`);
    console.log(`WebSocket server initialized`);
})