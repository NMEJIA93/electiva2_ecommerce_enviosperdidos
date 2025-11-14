import { createRequest, createResponse } from 'node-mocks-http';
import { login, getLogin, logout, verifyEmail, resendCode } from '../../../application/controllers/auth-controller';

// Mock de servicios de autenticación
jest.mock('../../../domain/services/auth-services', () => ({
    loginUser: jest.fn()
}));

// Mock de servicios de usuario
jest.mock('../../../domain/services/user-services', () => ({
    verifyUserEmail: jest.fn(),
    resendVerificationCode: jest.fn(),
    findUserById: jest.fn()
}));

// Mock de reglas de negocio
jest.mock('../../../domain/business-rules/user-rules', () => ({
    generateVerificationCode: jest.fn(() => '123456'),
    getVerificationCodeExpiration: jest.fn(() => new Date(Date.now() + 86400000))
}));

// Mock del repositorio de usuarios
jest.mock('../../../infraestructure/repositories/mongo-user', () => ({
    MongoUserRepository: jest.fn().mockImplementation(() => ({
        saveVerificationCode: jest.fn().mockResolvedValue(true),
        findByEmail: jest.fn().mockResolvedValue({
            _id: '507f1f77bcf86cd799439011',
            firstName: 'Test',
            email: 'test@example.com'
        })
    }))
}));

// Mock del repositorio de login
jest.mock('../../../infraestructure/repositories/mongo-login', () => ({
    MongoLoginRepository: jest.fn().mockImplementation(() => ({
        resetRetries: jest.fn().mockResolvedValue(true)
    }))
}));

// Mock del servicio de email
jest.mock('../../../infraestructure/services/nodemailer-email', () => ({
    NodemailerEmailService: jest.fn().mockImplementation(() => ({
        sendVerificationCode: jest.fn().mockResolvedValue({ success: true })
    }))
}));

describe('Auth Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('login', () => {
        it('should return 200 and token on successful login', async () => {
            const { loginUser } = require('../../../domain/services/auth-services');
            loginUser.mockResolvedValue({ success: true, token: 'mock-token' });

            const request = createRequest({
                body: { email: 'test@example.com', password: 'password123' }
            });
            const response = createResponse();

            await login(request, response);

            expect(response.statusCode).toBe(200);
            const data = response._getJSONData();
            expect(data.msg).toBe('Token generated');
            expect(data.token).toBe('mock-token');
        });

        it('should return 401 on invalid credentials', async () => {
            const { loginUser } = require('../../../domain/services/auth-services');
            loginUser.mockResolvedValue({ success: false, message: 'Invalid credentials' });

            const request = createRequest({
                body: { email: 'test@example.com', password: 'wrong' }
            });
            const response = createResponse();

            await login(request, response);

            expect(response.statusCode).toBe(401);
        });

        it('should return 503 on service error', async () => {
            const { loginUser } = require('../../../domain/services/auth-services');
            loginUser.mockRejectedValue(new Error('Service error'));

            const request = createRequest({
                body: { email: 'test@example.com', password: 'password123' }
            });
            const response = createResponse();

            await login(request, response);

            expect(response.statusCode).toBe(503);
        });
    });

    describe('getLogin', () => {
        it('should return user profile when authenticated', async () => {
            const mockUser = { id: '123', email: 'test@example.com' };
            const request = createRequest();
            request.user = mockUser;
            const response = createResponse();

            await getLogin(request, response);

            expect(response.statusCode).toBe(200);
            const data = response._getJSONData();
            expect(data.user).toEqual(mockUser);
        });

        it('should return 401 when not authenticated', async () => {
            const request = createRequest();
            const response = createResponse();

            await getLogin(request, response);

            expect(response.statusCode).toBe(401);
        });
    });

    describe('logout', () => {
        it('should logout successfully', async () => {
            const { findUserById } = require('../../../domain/services/user-services');
            findUserById.mockResolvedValue({ _id: '123', idNumber: '123456789' });

            const request = createRequest();
            request.user = { id: '123' };
            const response = createResponse();

            await logout(request, response);

            expect(response.statusCode).toBe(200);
        });

        it('should return 401 when not authenticated', async () => {
            const request = createRequest();
            const response = createResponse();

            await logout(request, response);

            expect(response.statusCode).toBe(401);
        });
    });

    describe('verifyEmail', () => {
        it('should verify email successfully', async () => {
            const { verifyUserEmail } = require('../../../domain/services/user-services');
            verifyUserEmail.mockResolvedValue({ success: true, message: 'Email verified' });

            const request = createRequest({
                body: { email: 'test@example.com', code: '123456' }
            });
            const response = createResponse();

            await verifyEmail(request, response);

            expect(response.statusCode).toBe(200);
        });

        it('should return 400 on invalid code', async () => {
            const { verifyUserEmail } = require('../../../domain/services/user-services');
            verifyUserEmail.mockResolvedValue({ success: false, message: 'Invalid code' });

            const request = createRequest({
                body: { email: 'test@example.com', code: '000000' }
            });
            const response = createResponse();

            await verifyEmail(request, response);

            expect(response.statusCode).toBe(400);
        });
    });

    describe('resendCode', () => {
        it('should resend verification code successfully', async () => {
            const { resendVerificationCode } = require('../../../domain/services/user-services');
            resendVerificationCode.mockResolvedValue({ success: true, message: 'Ready to generate new code' });

            const request = createRequest({
                body: { email: 'test@example.com' }
            });
            const response = createResponse();

            await resendCode(request, response);

            expect(response.statusCode).toBe(200);
            const data = response._getJSONData();
            expect(data.ok).toBe(true);
            expect(data.message).toBe('New verification code sent successfully');
        });

        it('should return 400 when resend verification fails', async () => {
            const { resendVerificationCode } = require('../../../domain/services/user-services');
            resendVerificationCode.mockResolvedValue({ success: false, message: 'Cannot resend code yet' });

            const request = createRequest({
                body: { email: 'test@example.com' }
            });
            const response = createResponse();

            await resendCode(request, response);

            expect(response.statusCode).toBe(400);
            const data = response._getJSONData();
            expect(data.ok).toBe(false);
            expect(data.message).toBe('Cannot resend code yet');
        });

        it('should handle email service properly', async () => {
            const { resendVerificationCode } = require('../../../domain/services/user-services');
            
            resendVerificationCode.mockResolvedValue({ success: true, message: 'Ready to generate new code' });

            const request = createRequest({
                body: { email: 'test@example.com' }
            });
            const response = createResponse();

            await resendCode(request, response);

            // Should succeed with mocked email service
            expect(response.statusCode).toBe(200);
            const data = response._getJSONData();
            expect(data.ok).toBe(true);
            expect(data.message).toBe('New verification code sent successfully');
        });

        it('should return 500 on internal server error', async () => {
            const { resendVerificationCode } = require('../../../domain/services/user-services');
            resendVerificationCode.mockRejectedValue(new Error('Database error'));

            const request = createRequest({
                body: { email: 'test@example.com' }
            });
            const response = createResponse();

            await resendCode(request, response);

            expect(response.statusCode).toBe(500);
            const data = response._getJSONData();
            expect(data.ok).toBe(false);
            expect(data.message).toBe('Internal server error');
        });
    });

    describe('logout - additional cases', () => {
        it('should return 404 when user not found', async () => {
            const { findUserById } = require('../../../domain/services/user-services');
            findUserById.mockResolvedValue(null);

            const request = createRequest();
            request.user = { id: '123' };
            const response = createResponse();

            await logout(request, response);

            expect(response.statusCode).toBe(404);
            const data = response._getJSONData();
            expect(data.type).toBe('NotFound');
            expect(data.msg).toBe('User not found');
        });

        it('should handle resetRetries error gracefully', async () => {
            const { findUserById } = require('../../../domain/services/user-services');
            const { MongoLoginRepository } = require('../../../infraestructure/repositories/mongo-login');
            
            findUserById.mockResolvedValue({ _id: '123', idNumber: '123456789' });
            
            // Mock resetRetries to throw error
            MongoLoginRepository.mockImplementation(() => ({
                resetRetries: jest.fn().mockRejectedValue(new Error('Database error'))
            }));

            const request = createRequest();
            request.user = { id: '123' };
            const response = createResponse();

            await logout(request, response);

            expect(response.statusCode).toBe(200);
            const data = response._getJSONData();
            expect(data.ok).toBe(true);
            expect(data.message).toBe('Logged out successfully');
        });

        it('should return 500 on internal server error', async () => {
            const { findUserById } = require('../../../domain/services/user-services');
            findUserById.mockRejectedValue(new Error('Database error'));

            const request = createRequest();
            request.user = { id: '123' };
            const response = createResponse();

            await logout(request, response);

            expect(response.statusCode).toBe(500);
            const data = response._getJSONData();
            expect(data.type).toBe('InternalServerError');
            expect(data.msg).toBe('Internal server error');
        });
    });

    describe('verifyEmail - additional cases', () => {
        it('should return 500 on internal server error', async () => {
            const { verifyUserEmail } = require('../../../domain/services/user-services');
            verifyUserEmail.mockRejectedValue(new Error('Database error'));

            const request = createRequest({
                body: { email: 'test@example.com', code: '123456' }
            });
            const response = createResponse();

            await verifyEmail(request, response);

            expect(response.statusCode).toBe(500);
            const data = response._getJSONData();
            expect(data.ok).toBe(false);
            expect(data.message).toBe('Internal server error');
            expect(data.error).toBe('Database error');
        });
    });

    describe('getLogin - additional cases', () => {
        it('should handle authenticated user correctly', async () => {
            const mockUser = { id: '123', email: 'test@example.com', name: 'Test User' };
            const request = createRequest();
            request.user = mockUser;
            const response = createResponse();

            await getLogin(request, response);

            expect(response.statusCode).toBe(200);
            const data = response._getJSONData();
            expect(data.ok).toBe(true);
            expect(data.message).toBe('Profile retrieved successfully');
            expect(data.user).toEqual(mockUser);
        });
    });
});