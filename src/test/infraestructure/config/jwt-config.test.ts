// src/test/infraestructure/config/jwt-config.test.ts

import { JWTConfig } from '../../../infraestructure/config/jwt-config';

// Mock console methods
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

describe('JWTConfig', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.clearAllMocks();
        // Reset environment variables
        process.env = { ...originalEnv };
        // Clear static properties
        (JWTConfig as any)._secret = undefined;
        (JWTConfig as any)._expiresIn = undefined;
    });

    afterAll(() => {
        process.env = originalEnv;
        mockConsoleLog.mockRestore();
        mockConsoleError.mockRestore();
    });

    describe('secret getter', () => {
        it('should return JWT_SECRET from environment variables', () => {
            const testSecret = 'test-secret-that-is-long-enough-for-security-requirements';
            process.env.JWT_SECRET = testSecret;

            const result = JWTConfig.secret;

            expect(result).toBe(testSecret);
        });

        it('should cache the secret value', () => {
            const testSecret = 'test-secret-that-is-long-enough-for-security-requirements';
            process.env.JWT_SECRET = testSecret;

            const result1 = JWTConfig.secret;
            const result2 = JWTConfig.secret;

            expect(result1).toBe(result2);
            expect(result1).toBe(testSecret);
        });

        it('should throw error when JWT_SECRET is not defined', () => {
            delete process.env.JWT_SECRET;

            expect(() => JWTConfig.secret).toThrow('JWT_SECRET is not defined in environment variables');
        });

        it('should throw error when JWT_SECRET is too short', () => {
            process.env.JWT_SECRET = 'short';

            expect(() => JWTConfig.secret).toThrow('JWT_SECRET must be at least 32 characters long for security');
        });

        it('should accept JWT_SECRET with exactly 32 characters', () => {
            const testSecret = 'a'.repeat(32);
            process.env.JWT_SECRET = testSecret;

            const result = JWTConfig.secret;

            expect(result).toBe(testSecret);
        });
    });

    describe('expiresIn getter', () => {
        it('should return JWT_EXPIRES_IN from environment variables', () => {
            const testExpiresIn = '1h';
            process.env.JWT_EXPIRES_IN = testExpiresIn;

            const result = JWTConfig.expiresIn;

            expect(result).toBe(testExpiresIn);
        });

        it('should return default value when JWT_EXPIRES_IN is not defined', () => {
            delete process.env.JWT_EXPIRES_IN;

            const result = JWTConfig.expiresIn;

            expect(result).toBe('24h');
        });

        it('should cache the expiresIn value', () => {
            const testExpiresIn = '1h';
            process.env.JWT_EXPIRES_IN = testExpiresIn;

            const result1 = JWTConfig.expiresIn;
            const result2 = JWTConfig.expiresIn;

            expect(result1).toBe(result2);
            expect(result1).toBe(testExpiresIn);
        });
    });

    describe('validateConfig', () => {
        it('should validate configuration successfully with valid JWT_SECRET', () => {
            const testSecret = 'test-secret-that-is-long-enough-for-security-requirements';
            process.env.JWT_SECRET = testSecret;

            expect(() => JWTConfig.validateConfig()).not.toThrow();
            expect(mockConsoleLog).toHaveBeenCalledWith('[JWT-CONFIG] ✅ JWT configuration is valid');
        });

        it('should throw error and log when JWT_SECRET is not defined', () => {
            delete process.env.JWT_SECRET;

            expect(() => JWTConfig.validateConfig()).toThrow('JWT_SECRET is not defined in environment variables');
            expect(mockConsoleError).toHaveBeenCalledWith(
                '[JWT-CONFIG] ❌ JWT configuration error:',
                'JWT_SECRET is not defined in environment variables'
            );
        });

        it('should throw error and log when JWT_SECRET is too short', () => {
            process.env.JWT_SECRET = 'short';

            expect(() => JWTConfig.validateConfig()).toThrow('JWT_SECRET must be at least 32 characters long for security');
            expect(mockConsoleError).toHaveBeenCalledWith(
                '[JWT-CONFIG] ❌ JWT configuration error:',
                'JWT_SECRET must be at least 32 characters long for security'
            );
        });
    });
});
