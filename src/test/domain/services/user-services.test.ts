// src/test/domain/services/user-services.test.ts

import {
    saveUser,
    updateUserById,
    findUserByEmail,
    hashPassword,
    comparePassword,
    findUserById,
    findAllUsers,
    verifyUserEmail,
    resendVerificationCode,
    validateUserCanPurchase
} from '../../../domain/services/user-services';
import { IUserRepository } from '../../../domain/repositories/IUser-repository';
import { User } from '../../../domain/entities/User';
import { IUsers } from '../../../domain/models/interfaces/IUsers';
import { UserStatus } from '../../../application/dtos/user-dtos';

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
    hash: jest.fn((password: string) => Promise.resolve(`hashed_${password}`)),
    compare: jest.fn((password: string, hash: string) => {
        return Promise.resolve(hash === `hashed_${password}`);
    })
}));

// Mock business rules
jest.mock('../../../domain/business-rules/user-rules', () => ({
    isPasswordSecure: jest.fn((password: string) => password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password)),
    generateVerificationCode: jest.fn(() => '123456'),
    getVerificationCodeExpiration: jest.fn(() => new Date(Date.now() + 86400000)), // 24 hours
    canVerifyEmail: jest.fn((isVerified: boolean) => ({
        canVerify: !isVerified,
        reason: isVerified ? 'Email is already verified' : undefined
    })),
    isValidVerificationCode: jest.fn((code: string) => /^\d{6}$/.test(code)),
    isVerificationCodeExpired: jest.fn((date: Date) => date < new Date()),
    canMakePurchases: jest.fn((isVerified: boolean) => ({
        canPurchase: isVerified,
        reason: !isVerified ? 'Email must be verified before making purchases' : undefined
    }))
}));

describe('User Services', () => {

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

    // ====================================================================
    // saveUser Tests
    // ====================================================================
    describe('saveUser', () => {
        const validUserData: IUsers = {
            email: 'test@example.com',
            password: 'Password123',
            firstName: 'Test',
            lastName: 'User',
            idType: 'cc',
            idNumber: '123456789',
            phone: '3001234567',
            roleId: 'USER',
            gender: 'M',
            birthDate: '1990-01-01',
            status: UserStatus.ACTIVE,
            country: 'Colombia',
            state: 'Antioquia',
            city: 'Medellin',
            neighborhood: 'Poblado',
            address: 'Calle 123',
            postalCode: '050001',
            createdAt: new Date(),
            updatedAt: new Date(),
            paymentMethodId: '',
            isEmailVerified: false
        };

        describe('Given valid user data', () => {
            it('should save user successfully and return user with verification code', async () => {
                mockUserRepo.findByEmail.mockResolvedValue(null);
                mockUserRepo.save.mockResolvedValue(new User({
                    ...validUserData,
                    _id: '123',
                    isEmailVerified: false
                }));
                mockUserRepo.saveVerificationCode.mockResolvedValue(undefined);

                const result = await saveUser(mockUserRepo, validUserData);

                expect(result.user).toBeDefined();
                expect(result.verificationCode).toBe('123456');
                expect(mockUserRepo.save).toHaveBeenCalled();
                expect(mockUserRepo.saveVerificationCode).toHaveBeenCalledWith(
                    validUserData.email,
                    '123456',
                    expect.any(Date)
                );
            });

            it('should set isEmailVerified to false for new user', async () => {
                mockUserRepo.findByEmail.mockResolvedValue(null);
                mockUserRepo.save.mockResolvedValue(new User({
                    ...validUserData,
                    _id: '123',
                    isEmailVerified: false
                }));
                mockUserRepo.saveVerificationCode.mockResolvedValue(undefined);

                const result = await saveUser(mockUserRepo, validUserData);

                expect(result.user.isEmailVerified).toBe(false);
            });

            it('should set status to ACTIVE for new user', async () => {
                mockUserRepo.findByEmail.mockResolvedValue(null);
                mockUserRepo.save.mockResolvedValue(new User({
                    ...validUserData,
                    _id: '123',
                    status: UserStatus.ACTIVE
                }));
                mockUserRepo.saveVerificationCode.mockResolvedValue(undefined);

                const result = await saveUser(mockUserRepo, validUserData);

                expect(result.user.status).toBe(UserStatus.ACTIVE);
            });
        });

        describe('Given duplicate email', () => {
            it('should throw error when email already exists', async () => {
                mockUserRepo.findByEmail.mockResolvedValue(new User(validUserData));

                await expect(saveUser(mockUserRepo, validUserData))
                    .rejects
                    .toThrow('[ERROR TO SERVICE] - Error saving user: Error: Email must be unique "email already in use"');
            });
        });

        describe('Given insecure password', () => {
            it('should throw error when password is too short', async () => {
                const userWithWeakPassword = { ...validUserData, password: 'weak' };
                mockUserRepo.findByEmail.mockResolvedValue(null);

                await expect(saveUser(mockUserRepo, userWithWeakPassword))
                    .rejects
                    .toThrow('[ERROR TO SERVICE] - Error saving user');
            });

            it('should throw error when password lacks uppercase', async () => {
                const userWithWeakPassword = { ...validUserData, password: 'password123' };
                mockUserRepo.findByEmail.mockResolvedValue(null);

                await expect(saveUser(mockUserRepo, userWithWeakPassword))
                    .rejects
                    .toThrow('[ERROR TO SERVICE] - Error saving user');
            });
        });

        describe('Given repository failure', () => {
            it('should throw error when save fails', async () => {
                mockUserRepo.findByEmail.mockResolvedValue(null);
                mockUserRepo.save.mockRejectedValue(new Error('Database error'));

                await expect(saveUser(mockUserRepo, validUserData))
                    .rejects
                    .toThrow('[ERROR TO SERVICE] - Error saving user');
            });
        });
    });

    // ====================================================================
    // updateUserById Tests
    // ====================================================================
    describe('updateUserById', () => {
        describe('Given valid update data', () => {
            it('should update user successfully', async () => {
                const updatedUser = new User({
                    _id: '123',
                    email: 'updated@example.com',
                    password: 'password',
                    firstName: 'Updated',
                    lastName: 'User',
                    idType: 'cc',
                    idNumber: '123',
                    phone: '300',
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
                    isEmailVerified: false
                });

                mockUserRepo.update.mockResolvedValue(updatedUser);

                const result = await updateUserById(mockUserRepo, '123', { firstName: 'Updated' });

                expect(result.firstName).toBe('Updated');
                expect(mockUserRepo.update).toHaveBeenCalledWith('123', { firstName: 'Updated' });
            });

            it('should update partial data', async () => {
                mockUserRepo.update.mockResolvedValue({} as User);

                await updateUserById(mockUserRepo, '123', { phone: '3009999999' });

                expect(mockUserRepo.update).toHaveBeenCalledWith('123', { phone: '3009999999' });
            });
        });

        describe('Given repository failure', () => {
            it('should throw error when update fails', async () => {
                mockUserRepo.update.mockRejectedValue(new Error('Database error'));

                await expect(updateUserById(mockUserRepo, '123', { firstName: 'Test' }))
                    .rejects
                    .toThrow('[ERROR TO SERVICE] - Error updating user');
            });
        });
    });

    // ====================================================================
    // findUserByEmail Tests
    // ====================================================================
    describe('findUserByEmail', () => {
        describe('Given existing email', () => {
            it('should return user when found', async () => {
                const mockUser = new User({
                    email: 'test@example.com',
                    password: 'password',
                    firstName: 'Test',
                    lastName: 'User',
                    idType: 'cc',
                    idNumber: '123',
                    phone: '300',
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
                    isEmailVerified: false
                });

                mockUserRepo.findByEmail.mockResolvedValue(mockUser);

                const result = await findUserByEmail(mockUserRepo, 'test@example.com');

                expect(result).toEqual(mockUser);
                expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('test@example.com');
            });
        });

        describe('Given non-existing email', () => {
            it('should return null when user not found', async () => {
                mockUserRepo.findByEmail.mockResolvedValue(null);

                const result = await findUserByEmail(mockUserRepo, 'nonexistent@example.com');

                expect(result).toBeNull();
            });
        });

        describe('Given repository failure', () => {
            it('should throw error when findByEmail fails', async () => {
                mockUserRepo.findByEmail.mockRejectedValue(new Error('Database error'));

                await expect(findUserByEmail(mockUserRepo, 'test@example.com'))
                    .rejects
                    .toThrow('[ERROR TO SERVICE] - Error finding user by email');
            });
        });
    });

    // ====================================================================
    // hashPassword Tests
    // ====================================================================
    describe('hashPassword', () => {
        describe('Given valid password', () => {
            it('should hash password successfully', async () => {
                const password = 'Password123';
                const hashed = await hashPassword(password);

                expect(hashed).toBe(`hashed_${password}`);
            });

            it('should call bcrypt.hash with correct parameters', async () => {
                const bcrypt = require('bcryptjs');
                await hashPassword('test');

                expect(bcrypt.hash).toHaveBeenCalledWith('test', 10);
            });
        });

        describe('Given bcrypt failure', () => {
            it('should throw error when hashing fails', async () => {
                const bcrypt = require('bcryptjs');
                bcrypt.hash.mockRejectedValueOnce(new Error('Hashing failed'));

                await expect(hashPassword('test'))
                    .rejects
                    .toThrow('[ERROR TO SERVICE] - Error hashing password');
            });
        });
    });

    // ====================================================================
    // comparePassword Tests
    // ====================================================================
    describe('comparePassword', () => {
        describe('Given correct password', () => {
            it('should return true for matching password', async () => {
                const password = 'Password123';
                const hash = 'hashed_Password123';

                const result = await comparePassword(password, hash);

                expect(result).toBe(true);
            });
        });

        describe('Given incorrect password', () => {
            it('should return false for non-matching password', async () => {
                const password = 'WrongPassword';
                const hash = 'hashed_Password123';

                const result = await comparePassword(password, hash);

                expect(result).toBe(false);
            });
        });

        describe('Given bcrypt failure', () => {
            it('should throw error when comparison fails', async () => {
                const bcrypt = require('bcryptjs');
                bcrypt.compare.mockRejectedValueOnce(new Error('Comparison failed'));

                await expect(comparePassword('test', 'hash'))
                    .rejects
                    .toThrow('[ERROR TO SERVICE] - Error comparing password');
            });
        });
    });

    // ====================================================================
    // findUserById Tests
    // ====================================================================
    describe('findUserById', () => {
        describe('Given existing user ID', () => {
            it('should return user when found', async () => {
                const mockUser = new User({
                    _id: '123',
                    email: 'test@example.com',
                    password: 'password',
                    firstName: 'Test',
                    lastName: 'User',
                    idType: 'cc',
                    idNumber: '123',
                    phone: '300',
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
                    isEmailVerified: false
                });

                mockUserRepo.findById.mockResolvedValue(mockUser);

                const result = await findUserById(mockUserRepo, '123');

                expect(result).toEqual(mockUser);
                expect(mockUserRepo.findById).toHaveBeenCalledWith('123');
            });
        });

        describe('Given non-existing user ID', () => {
            it('should return null when user not found', async () => {
                mockUserRepo.findById.mockResolvedValue(null);

                const result = await findUserById(mockUserRepo, 'nonexistent');

                expect(result).toBeNull();
            });
        });

        describe('Given repository failure', () => {
            it('should throw error when findById fails', async () => {
                mockUserRepo.findById.mockRejectedValue(new Error('Database error'));

                await expect(findUserById(mockUserRepo, '123'))
                    .rejects
                    .toThrow('[ERROR TO SERVICE] - Error finding user by ID');
            });
        });
    });

    // ====================================================================
    // findAllUsers Tests
    // ====================================================================
    describe('findAllUsers', () => {
        describe('Given users exist', () => {
            it('should return array of users', async () => {
                const mockUsers = [
                    new User({
                        _id: '1',
                        email: 'user1@example.com',
                        password: 'password',
                        firstName: 'User',
                        lastName: 'One',
                        idType: 'cc',
                        idNumber: '123',
                        phone: '300',
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
                        isEmailVerified: false
                    }),
                    new User({
                        _id: '2',
                        email: 'user2@example.com',
                        password: 'password',
                        firstName: 'User',
                        lastName: 'Two',
                        idType: 'cc',
                        idNumber: '456',
                        phone: '301',
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
                        isEmailVerified: false
                    })
                ];

                mockUserRepo.findAll.mockResolvedValue(mockUsers);

                const result = await findAllUsers(mockUserRepo);

                expect(result).toEqual(mockUsers);
                expect(result).toHaveLength(2);
            });
        });

        describe('Given no users exist', () => {
            it('should return empty array', async () => {
                mockUserRepo.findAll.mockResolvedValue([]);

                const result = await findAllUsers(mockUserRepo);

                expect(result).toEqual([]);
            });
        });

        describe('Given repository failure', () => {
            it('should return undefined when findAll fails', async () => {
                mockUserRepo.findAll.mockRejectedValue(new Error('Database error'));

                const result = await findAllUsers(mockUserRepo);

                expect(result).toBeUndefined();
            });
        });
    });

    // ====================================================================
    // verifyUserEmail Tests
    // ====================================================================
    describe('verifyUserEmail', () => {
        const validCode = '123456';
        const validEmail = 'test@example.com';
        const mockUser = new User({
            _id: '123',
            email: validEmail,
            password: 'password',
            firstName: 'Test',
            lastName: 'User',
            idType: 'cc',
            idNumber: '123',
            phone: '300',
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
            isEmailVerified: false
        });

        describe('Given valid verification code', () => {
            it('should verify email successfully', async () => {
                mockUserRepo.findByEmail.mockResolvedValue(mockUser);
                mockUserRepo.getVerificationCode.mockResolvedValue({
                    code: validCode,
                    expiresAt: new Date(Date.now() + 86400000)
                });
                mockUserRepo.update.mockResolvedValue({} as User);
                mockUserRepo.deleteVerificationCode.mockResolvedValue(undefined);

                const result = await verifyUserEmail(mockUserRepo, validEmail, validCode);

                expect(result.success).toBe(true);
                expect(result.message).toBe('Email verified successfully. You can now make purchases.');
                expect(mockUserRepo.update).toHaveBeenCalledWith('123', { isEmailVerified: true });
                expect(mockUserRepo.deleteVerificationCode).toHaveBeenCalledWith(validEmail);
            });
        });

        describe('Given invalid code format', () => {
            it('should return error for non-6-digit code', async () => {
                const result = await verifyUserEmail(mockUserRepo, validEmail, '12345');

                expect(result.success).toBe(false);
                expect(result.message).toBe('Invalid code format. Code must be 6 digits');
            });

            it('should return error for code with letters', async () => {
                const result = await verifyUserEmail(mockUserRepo, validEmail, '12345A');

                expect(result.success).toBe(false);
                expect(result.message).toBe('Invalid code format. Code must be 6 digits');
            });
        });

        describe('Given non-existent user', () => {
            it('should return error when user not found', async () => {
                mockUserRepo.findByEmail.mockResolvedValue(null);

                const result = await verifyUserEmail(mockUserRepo, 'nonexistent@example.com', validCode);

                expect(result.success).toBe(false);
                expect(result.message).toBe('User not found');
            });
        });

        describe('Given already verified email', () => {
            it('should return error when email is already verified', async () => {
                const verifiedUser = new User({ ...mockUser, isEmailVerified: true });
                mockUserRepo.findByEmail.mockResolvedValue(verifiedUser);

                const result = await verifyUserEmail(mockUserRepo, validEmail, validCode);

                expect(result.success).toBe(false);
                expect(result.message).toBe('Email is already verified');
            });
        });

        describe('Given no verification code stored', () => {
            it('should return error when no code found', async () => {
                mockUserRepo.findByEmail.mockResolvedValue(mockUser);
                mockUserRepo.getVerificationCode.mockResolvedValue(null);

                const result = await verifyUserEmail(mockUserRepo, validEmail, validCode);

                expect(result.success).toBe(false);
                expect(result.message).toBe('No verification code found for this email');
            });
        });

        describe('Given expired verification code', () => {
            it('should return error and delete expired code', async () => {
                mockUserRepo.findByEmail.mockResolvedValue(mockUser);
                mockUserRepo.getVerificationCode.mockResolvedValue({
                    code: validCode,
                    expiresAt: new Date(Date.now() - 1000) // Expired
                });
                mockUserRepo.deleteVerificationCode.mockResolvedValue(undefined);

                const result = await verifyUserEmail(mockUserRepo, validEmail, validCode);

                expect(result.success).toBe(false);
                expect(result.message).toBe('Verification code has expired');
                expect(mockUserRepo.deleteVerificationCode).toHaveBeenCalledWith(validEmail);
            });
        });

        describe('Given wrong verification code', () => {
            it('should return error when code does not match', async () => {
                mockUserRepo.findByEmail.mockResolvedValue(mockUser);
                mockUserRepo.getVerificationCode.mockResolvedValue({
                    code: '654321',
                    expiresAt: new Date(Date.now() + 86400000)
                });

                const result = await verifyUserEmail(mockUserRepo, validEmail, validCode);

                expect(result.success).toBe(false);
                expect(result.message).toBe('Invalid verification code');
            });
        });

        describe('Given repository failure', () => {
            it('should throw error when verification process fails', async () => {
                mockUserRepo.findByEmail.mockRejectedValue(new Error('Database error'));

                await expect(verifyUserEmail(mockUserRepo, validEmail, validCode))
                    .rejects
                    .toThrow('[ERROR TO SERVICE] - Error verifying email');
            });
        });
    });

    // ====================================================================
    // resendVerificationCode Tests
    // ====================================================================
    describe('resendVerificationCode', () => {
        const validEmail = 'test@example.com';
        const mockUser = new User({
            _id: '123',
            email: validEmail,
            password: 'password',
            firstName: 'Test',
            lastName: 'User',
            idType: 'cc',
            idNumber: '123',
            phone: '300',
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
            isEmailVerified: false
        });

        describe('Given valid unverified user', () => {
            it('should allow resending code', async () => {
                mockUserRepo.findByEmail.mockResolvedValue(mockUser);
                mockUserRepo.hasVerificationCode.mockResolvedValue(true);
                mockUserRepo.deleteVerificationCode.mockResolvedValue(undefined);

                const result = await resendVerificationCode(mockUserRepo, validEmail);

                expect(result.success).toBe(true);
                expect(result.message).toBe('Ready to generate new code');
                expect(mockUserRepo.deleteVerificationCode).toHaveBeenCalledWith(validEmail);
            });

            it('should work when no old code exists', async () => {
                mockUserRepo.findByEmail.mockResolvedValue(mockUser);
                mockUserRepo.hasVerificationCode.mockResolvedValue(false);

                const result = await resendVerificationCode(mockUserRepo, validEmail);

                expect(result.success).toBe(true);
                expect(mockUserRepo.deleteVerificationCode).not.toHaveBeenCalled();
            });
        });

        describe('Given non-existent user', () => {
            it('should return error when user not found', async () => {
                mockUserRepo.findByEmail.mockResolvedValue(null);

                const result = await resendVerificationCode(mockUserRepo, 'nonexistent@example.com');

                expect(result.success).toBe(false);
                expect(result.message).toBe('User not found');
            });
        });

        describe('Given already verified email', () => {
            it('should return error when email is already verified', async () => {
                const verifiedUser = new User({ ...mockUser, isEmailVerified: true });
                mockUserRepo.findByEmail.mockResolvedValue(verifiedUser);

                const result = await resendVerificationCode(mockUserRepo, validEmail);

                expect(result.success).toBe(false);
                expect(result.message).toBe('Email is already verified');
            });
        });

        describe('Given repository failure', () => {
            it('should throw error when resend process fails', async () => {
                mockUserRepo.findByEmail.mockRejectedValue(new Error('Database error'));

                await expect(resendVerificationCode(mockUserRepo, validEmail))
                    .rejects
                    .toThrow('[ERROR TO SERVICE] - Error resending code');
            });
        });
    });

    // ====================================================================
    // validateUserCanPurchase Tests
    // ====================================================================
    describe('validateUserCanPurchase', () => {
        const mockVerifiedUser = new User({
            _id: '123',
            email: 'verified@example.com',
            password: 'password',
            firstName: 'Verified',
            lastName: 'User',
            idType: 'cc',
            idNumber: '123',
            phone: '300',
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

        const mockUnverifiedUser = new User({
            ...mockVerifiedUser,
            isEmailVerified: false
        });

        describe('Given verified user', () => {
            it('should allow purchases for verified user', async () => {
                mockUserRepo.findById.mockResolvedValue(mockVerifiedUser);

                const result = await validateUserCanPurchase(mockUserRepo, '123');

                expect(result.canPurchase).toBe(true);
                expect(result.reason).toBeUndefined();
            });
        });

        describe('Given unverified user', () => {
            it('should not allow purchases for unverified user', async () => {
                mockUserRepo.findById.mockResolvedValue(mockUnverifiedUser);

                const result = await validateUserCanPurchase(mockUserRepo, '123');

                expect(result.canPurchase).toBe(false);
                expect(result.reason).toBe('Email must be verified before making purchases');
            });
        });

        describe('Given non-existent user', () => {
            it('should return error when user not found', async () => {
                mockUserRepo.findById.mockResolvedValue(null);

                const result = await validateUserCanPurchase(mockUserRepo, 'nonexistent');

                expect(result.canPurchase).toBe(false);
                expect(result.reason).toBe('User not found');
            });
        });

        describe('Given repository failure', () => {
            it('should throw error when validation fails', async () => {
                mockUserRepo.findById.mockRejectedValue(new Error('Database error'));

                await expect(validateUserCanPurchase(mockUserRepo, '123'))
                    .rejects
                    .toThrow('[ERROR TO SERVICE] - Error validating purchase');
            });
        });
    });
});

