import 'dotenv/config'
import express, {Application, Request, Response} from 'express';

import appRouter from './application/routes/app-router'
import { dbConnection } from './infraestructure/config/config-db-mongo';
import { JWTConfig } from './infraestructure/config/jwt-config';
import { MongoUserRepository } from './infraestructure/repositories/mongo-user';


const PORT:number = Number(process.env.PORT);

// Validate JWT configuration
JWTConfig.validateConfig();

// DB CONNECTION
dbConnection();


MongoUserRepository.initialize();
console.log('[APP] User repository initialized with verification code cleanup');

const app:Application = express();

app.use(express.json());

app.use(appRouter);


app.listen(PORT, ()=>{
    console.log(`Maldito genio el servidor esta corriendo por el puesto ${PORT}`);
    console.log(`http://localhost:${PORT}`);
})