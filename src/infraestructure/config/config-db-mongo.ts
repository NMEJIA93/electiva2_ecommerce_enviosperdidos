import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

export const dbConnection = async () => {
    try {
        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }
        await mongoose.connect(MONGODB_URI);
        console.log('[DB-STATUS] Database connected');
    } catch (error) {
        console.error('[DB-STATUS] - Error connecting to the database', error);
        throw new Error('[DB-STATUS] - Error connecting to the database');
    }

}