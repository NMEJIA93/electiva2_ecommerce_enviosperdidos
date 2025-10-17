import { loginUser, generateToken, verifyToken } from '../../../domain/services/auth-services';
import { IUserRepository } from '../../../domain/repositories/IUser-repository';
import { User } from '../../../domain/entities/User';
import { UserStatus } from '../../../application/dtos/user-dtos';

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(() => 'mock-token'),
    verify: jest.fn(() => ({ id: '123', email: 'test@example.com' }))
}));

jest.mock('../../../domain/services/user-services', () => ({
    findUserByEmail: jest.fn(),
    comparePassword: jest.fn(),
    updateUserById: jest.fn()
}));

jest.mock('../../../infraestructure/repositories/mongo-login', () => ({
    MongoLoginRepository: jest.fn().mockImplementation(() => ({
        incrementRetries: jest.fn(),
        resetRetries: jest.fn()
    }))
}));

jest.mock('../../../infraestructure/config/jwt-config', () => ({
    JWTConfig: {
        secret: 'test-secret',
        expiresIn: '24h'
    }
}));

describe('Auth Services', () => {
    let mockUserRepo: jest.Mocked<IUserRepository>;

    beforeEach(() => {
        jest.clearAllMocks();
        mockUserRepo = {
            save: jest.fn(),
            findById: jest.fn(),
            findByEmail: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            saveVerificationCode: jest.fn(),
            getVerificationCode: jest.fn(),
            deleteVerificationCode: jest.fn(),
            hasVerificationCode: jest.fn()
        } as any;
    });

    describe('loginUser', () => {
        const mockUser = new User({
            _id: '123',
            email: 'test@example.com',
            password: 'hashedPassword',
            firstName: 'Test',
            lastName: 'User',
            idType: 'cc',
            idNumber: '123456789',
            phone: '3001234567',
            roleId: 'USER',
            gender: '',
            birthDate: '',
            status: UserStatus.ACTIVE,
            country: '',
            state: '',
            city: '',
            neighborhood: '',
            address: '',
            postalCode: '',
            createdAt: new Date(),
            updatedAt: new Date(),
            paymentMethodId: '',
            isEmailVerified: true
        });

        it('should login successfully with valid credentials', async () => {
            const { findUserByEmail, comparePassword } = require('../../../domain/services/user-services');
            findUserByEmail.mockResolvedValue(mockUser);
            comparePassword.mockResolvedValue(true);

            const result = await loginUser(mockUserRepo, {
                email: 'test@example.com',
                password: 'password123'
            });

            expect(result.success).toBe(true);
            expect(result.token).toBe('mock-token');
        });

        it('should fail with invalid email', async () => {
            const { findUserByEmail } = require('../../../domain/services/user-services');
            findUserByEmail.mockResolvedValue(null);

            const result = await loginUser(mockUserRepo, {
                email: 'wrong@example.com',
                password: 'password123'
            });

            expect(result.success).toBe(false);
            expect(result.message).toBe('Invalid credentials (wrong email or password)');
        });

        it('should fail with blocked user', async () => {
            const blockedUser = { ...mockUser, status: UserStatus.BLOCKED };
            const { findUserByEmail } = require('../../../domain/services/user-services');
            findUserByEmail.mockResolvedValue(blockedUser);

            const result = await loginUser(mockUserRepo, {
                email: 'test@example.com',
                password: 'password123'
            });

            expect(result.success).toBe(false);
            expect(result.message).toBe('User is blocked. Please contact the administrator.');
        });

        it('should fail with invalid password', async () => {
            const { findUserByEmail, comparePassword } = require('../../../domain/services/user-services');
            findUserByEmail.mockResolvedValue(mockUser);
            comparePassword.mockResolvedValue(false);

            const result = await loginUser(mockUserRepo, {
                email: 'test@example.com',
                password: 'wrongpassword'
            });

            expect(result.success).toBe(false);
            expect(result.message).toBe('Invalid credentials (wrong email or password)');
        });

        it('should throw error on service failure', async () => {
            const { findUserByEmail } = require('../../../domain/services/user-services');
            findUserByEmail.mockRejectedValue(new Error('Database error'));

            await expect(loginUser(mockUserRepo, {
                email: 'test@example.com',
                password: 'password123'
            })).rejects.toThrow('[ERROR AUTH SERVICE] - Login error');
        });
    });

    describe('generateToken', () => {
        it('should generate JWT token', () => {
            const payload = { id: '123', email: 'test@example.com' };
            const token = generateToken(payload);

            expect(token).toBe('mock-token');
            const jwt = require('jsonwebtoken');
            expect(jwt.sign).toHaveBeenCalledWith(payload, 'test-secret', { expiresIn: '24h' });
        });
    });

    describe('verifyToken', () => {
        it('should verify valid token', () => {
            const result = verifyToken('valid-token');

            expect(result).toEqual({ id: '123', email: 'test@example.com' });
        });

        it('should throw error for invalid token', () => {
            const jwt = require('jsonwebtoken');
            jwt.verify.mockImplementationOnce(() => {
                throw new Error('Invalid token');
            });

            expect(() => verifyToken('invalid-token')).toThrow('Invalid token');
        });
    });
});