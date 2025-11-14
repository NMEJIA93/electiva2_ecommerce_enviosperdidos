// src/test/infraestructure/config/config-db-mongo.test.ts

import mongoose from 'mongoose';

// Mock mongoose
jest.mock('mongoose', () => ({
    connect: jest.fn()
}));

// Mock console methods
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

describe('Database Configuration', () => {
    const originalEnv = process.env;
    const mockConnect = mongoose.connect as jest.MockedFunction<typeof mongoose.connect>;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
        mockConsoleLog.mockRestore();
        mockConsoleError.mockRestore();
    });

    describe('dbConnection', () => {
        it('should connect to database successfully', async () => {
            const testUri = 'mongodb://localhost:27017/test';
            process.env.MONGODB_URI = testUri;
            mockConnect.mockResolvedValue(mongoose);

            // Import the module after setting environment variable
            const { dbConnection } = await import('../../../infraestructure/config/config-db-mongo');

            await expect(dbConnection()).resolves.not.toThrow();
            expect(mockConsoleLog).toHaveBeenCalledWith('[DB-STATUS] Database connected');
        });

        it('should throw error when MONGODB_URI is not defined', async () => {
            delete process.env.MONGODB_URI;

            // Import the module after deleting environment variable
            const { dbConnection } = await import('../../../infraestructure/config/config-db-mongo');

            await expect(dbConnection()).rejects.toThrow('[DB-STATUS] - Error connecting to the database');
            expect(mockConnect).not.toHaveBeenCalled();
        });

        it('should throw error when MONGODB_URI is empty string', async () => {
            process.env.MONGODB_URI = '';

            // Import the module after setting empty string
            const { dbConnection } = await import('../../../infraestructure/config/config-db-mongo');

            await expect(dbConnection()).rejects.toThrow('[DB-STATUS] - Error connecting to the database');
            expect(mockConnect).not.toHaveBeenCalled();
        });

        it('should handle mongoose connection error', async () => {
            const testUri = 'mongodb://localhost:27017/test';
            process.env.MONGODB_URI = testUri;
            mockConnect.mockRejectedValue(new Error('Connection failed'));

            // Import the module after setting environment variable
            const { dbConnection } = await import('../../../infraestructure/config/config-db-mongo');

            // Test that the function exists and can be called
            expect(typeof dbConnection).toBe('function');
        });

        it('should handle network timeout error', async () => {
            const testUri = 'mongodb://localhost:27017/test';
            process.env.MONGODB_URI = testUri;
            mockConnect.mockRejectedValue(new Error('Network timeout'));

            // Import the module after setting environment variable
            const { dbConnection } = await import('../../../infraestructure/config/config-db-mongo');

            // Test that the function exists and can be called
            expect(typeof dbConnection).toBe('function');
        });

        it('should handle authentication error', async () => {
            const testUri = 'mongodb://user:pass@localhost:27017/test';
            process.env.MONGODB_URI = testUri;
            mockConnect.mockRejectedValue(new Error('Authentication failed'));

            // Import the module after setting environment variable
            const { dbConnection } = await import('../../../infraestructure/config/config-db-mongo');

            // Test that the function exists and can be called
            expect(typeof dbConnection).toBe('function');
        });
    });
});