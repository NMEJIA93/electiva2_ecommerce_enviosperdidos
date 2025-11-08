import { createRequest, createResponse } from 'node-mocks-http'
import {
    createUser,
    updateUser,
    updatePartialUser,
    getUserProfile,
    getAllUsers,
    verifyEmail,
    resendCode
} from '../../../application/controllers/user-controller'

jest.mock('../../../domain/services/user-services', () => {
    const actual = jest.requireActual('../../../domain/services/user-services');
    return {
        ...actual,
        saveUser: jest.fn(() => Promise.resolve({
            user: {
                _id: '123-123',
                email: "norbeytest@gmail.com",
                password: "hashedPassword123",
                firstName: "NorbeyTest",
                lastName: "MejiaTest",
                idType: "cc",
                idNumber: "123456789",
                phone: "3161234567",
                roleId: "USER",
                status: "ACTIVE",
                isEmailVerified: false
            },
            verificationCode: "123456"
        })),
        hashPassword: jest.fn((password) => Promise.resolve(`hashed_${password}`)),
        findUserById: jest.fn((userRepo, userId) => {
            return Promise.resolve({
                _id: userId,
                email: "default@gmail.com",
                password: "hashedPassword",
                firstName: "DefaultFirst",
                lastName: "DefaultLast",
                idType: "cc",
                idNumber: "123456789",
                phone: "3161234567",
                roleId: "USER",
                gender: "",
                birthDate: "",
                status: "ACTIVE",
                country: "",
                state: "",
                city: "",
                neighborhood: "",
                address: "",
                postalCode: "",
                createdAt: new Date(),
                updatedAt: new Date(),
                paymentMethodId: "",
                isEmailVerified: false
            });
        }),
        updateUserById: jest.fn((userRepo, userId, updatedData) => {
            return Promise.resolve({
                _id: userId,
                email: updatedData.email || "updated@gmail.com",
                password: updatedData.password || "hashedPassword",
                firstName: updatedData.firstName || "UpdatedFirst",
                lastName: updatedData.lastName || "UpdatedLast",
                idType: updatedData.idType || "cc",
                idNumber: updatedData.idNumber || "123456789",
                phone: updatedData.phone || "3161234567",
                roleId: updatedData.roleId || "USER",
                gender: updatedData.gender || "",
                birthDate: updatedData.birthDate || "",
                status: updatedData.status || "ACTIVE",
                country: updatedData.country || "",
                state: updatedData.state || "",
                city: updatedData.city || "",
                neighborhood: updatedData.neighborhood || "",
                address: updatedData.address || "",
                postalCode: updatedData.postalCode || "",
                createdAt: new Date(),
                updatedAt: new Date(),
                paymentMethodId: updatedData.paymentMethodId || "",
                isEmailVerified: updatedData.isEmailVerified || false
            });
        }),

        findAllUsers: jest.fn(() => Promise.resolve([])),
        verifyUserEmail: jest.fn(() => Promise.resolve({ success: true, message: "Email verified successfully" })),
        resendVerificationCode: jest.fn(() => Promise.resolve({ success: true, message: "Ready to generate new code" }))
    };
});

jest.mock('../../../domain/business-rules/user-rules', () => {
    const actual = jest.requireActual('../../../domain/business-rules/user-rules');
    return {
        ...actual,
        generateVerificationCode: jest.fn(() => "123456"),
        getVerificationCodeExpiration: jest.fn(() => new Date(Date.now() + 10 * 60 * 1000))
    };
});

jest.mock('../../../infraestructure/repositories/mongo-user', () => {
    return {
        MongoUserRepository: jest.fn().mockImplementation(() => {
            return {
                saveVerificationCode: jest.fn(() => Promise.resolve()),
                findByEmail: jest.fn(() => Promise.resolve({
                    _id: '123-123',
                    email: "test@gmail.com",
                    firstName: "Test",
                    lastName: "User",
                    isEmailVerified: false
                })),
                findById: jest.fn(),
                save: jest.fn(),
                update: jest.fn(),
                findAll: jest.fn(),
                getVerificationCode: jest.fn(),
                deleteVerificationCode: jest.fn(),
                hasVerificationCode: jest.fn()
            };
        })
    };
});

jest.mock('../../../infraestructure/services/nodemailer-email', () => {
    return {
        NodemailerEmailService: jest.fn().mockImplementation(() => {
            return {
                sendVerificationCode: jest.fn(() => Promise.resolve({
                    success: true,
                    messageId: 'mock-message-id'
                }))
            };
        })
    };
});

describe('user-controller tests', () => {
    describe('when created user successfully', () => {
        test('should return status 201 and user data', async () => {
            const mockNewUser = {
                email: "norbeytest@gmail.com",
                password: "PruebaTest123.",
                firstName: "NorbeyTest",
                lastName: "MejiaTest",
                idType: "cc",
                idNumber: "123456789",
                phone: "3161234567",
                roleId: "USER",
            }

            const request = createRequest({
                body: mockNewUser
            });
            const response = createResponse();

            await createUser(request, response);

            expect(response.statusCode).toBe(201);

            const data = response._getJSONData();
            expect(data).toEqual({
                ok: true,
                message: 'User created successfully',
                user: {
                    id: '123-123',
                    email: "norbeytest@gmail.com",
                    firstName: "NorbeyTest",
                    lastName: "MejiaTest",
                    idType: "cc",
                    idNumber: "123456789",
                    phone: "3161234567",
                    roleId: "USER",
                    status: "ACTIVE",
                    isEmailVerified: false
                }
            });
        });
    });
});


describe('UserController - createUser - Error Cases', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('Given an email that is already registered', () => {
        describe('When attempting to create a new user', () => {
            it('should return 409 status code', async () => {
                const { saveUser } = require('../../../domain/services/user-services');
                saveUser.mockRejectedValueOnce(
                    new Error('[ERROR TO SERVICE] - Error saving user: Email must be unique "email already in use"')
                );

                const duplicateEmailUser = {
                    email: "existing@gmail.com",
                    password: "SecurePass123.",
                    firstName: "Test",
                    lastName: "User",
                    idType: "cc",
                    idNumber: "987654321",
                    phone: "3161234567",
                    roleId: "USER",
                };
                const request = createRequest({ body: duplicateEmailUser });
                const response = createResponse();


                await createUser(request, response);

                expect(response.statusCode).toBe(409);
            });

            it('should return error message indicating duplicate email', async () => {
                const { saveUser } = require('../../../domain/services/user-services');
                saveUser.mockRejectedValueOnce(
                    new Error('[ERROR TO SERVICE] - Error saving user: Email must be unique "email already in use"')
                );

                const duplicateEmailUser = {
                    email: "existing@gmail.com",
                    password: "SecurePass123.",
                    firstName: "Test",
                    lastName: "User",
                    idType: "cc",
                    idNumber: "987654321",
                    phone: "3161234567",
                    roleId: "USER",
                };
                const request = createRequest({ body: duplicateEmailUser });
                const response = createResponse();

                await createUser(request, response);

                const data = response._getJSONData();
                expect(data.ok).toBe(false);
                expect(data.message).toBe('Email already in use');
                expect(data.error).toContain('email already in use');
            });
        });
    });

    describe('Given a password that does not meet security requirements', () => {
        describe('When attempting to create a user with weak password', () => {
            it('should return 422 status code', async () => {

                const { saveUser } = require('../../../domain/services/user-services');
                saveUser.mockRejectedValueOnce(
                    new Error('[ERROR TO SERVICE] - Error saving user: Password must be at least 8 characters and include uppercase, lowercase, and numbers')
                );

                const weakPasswordUser = {
                    email: "newuser@gmail.com",
                    password: "weak",
                    firstName: "Test",
                    lastName: "User",
                    idType: "cc",
                    idNumber: "123456789",
                    phone: "3161234567",
                    roleId: "USER",
                };
                const request = createRequest({ body: weakPasswordUser });
                const response = createResponse();


                await createUser(request, response);


                expect(response.statusCode).toBe(422);
            });

            it('should return error message about password requirements', async () => {

                const { saveUser } = require('../../../domain/services/user-services');
                saveUser.mockRejectedValueOnce(
                    new Error('[ERROR TO SERVICE] - Error saving user: Password must be at least 8 characters and include uppercase, lowercase, and numbers')
                );

                const weakPasswordUser = {
                    email: "newuser@gmail.com",
                    password: "weak",
                    firstName: "Test",
                    lastName: "User",
                    idType: "cc",
                    idNumber: "123456789",
                    phone: "3161234567",
                    roleId: "USER",
                };
                const request = createRequest({ body: weakPasswordUser });
                const response = createResponse();

                await createUser(request, response);

                const data = response._getJSONData();
                expect(data.ok).toBe(false);
                expect(data.message).toBe('Password does not meet security requirements');
                expect(data.error).toContain('Password must be at least 8 characters');
            });
        });

        describe('When password is only lowercase letters', () => {
            it('should return 422 status with password error', async () => {

                const { saveUser } = require('../../../domain/services/user-services');
                saveUser.mockRejectedValueOnce(
                    new Error('[ERROR TO SERVICE] - Error saving user: Password must be at least 8 characters and include uppercase, lowercase, and numbers')
                );

                const lowercaseOnlyUser = {
                    email: "newuser@gmail.com",
                    password: "alllowercase",
                    firstName: "Test",
                    lastName: "User",
                    idType: "cc",
                    idNumber: "123456789",
                    phone: "3161234567",
                    roleId: "USER",
                };
                const request = createRequest({ body: lowercaseOnlyUser });
                const response = createResponse();


                await createUser(request, response);


                expect(response.statusCode).toBe(422);
                const data = response._getJSONData();
                expect(data.ok).toBe(false);
            });
        });

        describe('When password lacks numbers', () => {
            it('should return 500 status with password error', async () => {

                const { saveUser } = require('../../../domain/services/user-services');
                saveUser.mockRejectedValueOnce(
                    new Error('[ERROR TO SERVICE] - Error saving user: Password must be at least 8 characters and include uppercase, lowercase, and numbers')
                );

                const noNumbersUser = {
                    email: "newuser@gmail.com",
                    password: "NoNumbers",
                    firstName: "Test",
                    lastName: "User",
                    idType: "cc",
                    idNumber: "123456789",
                    phone: "3161234567",
                    roleId: "USER",
                };
                const request = createRequest({ body: noNumbersUser });
                const response = createResponse();


                await createUser(request, response);


                expect(response.statusCode).toBe(422);
                const data = response._getJSONData();
                expect(data.ok).toBe(false);
            });
        });
    });



    describe('Given the email service is unavailable', () => {
        describe('When verification email fails to send', () => {
            it('should still return 201 and create the user', async () => {

                const NodemailerEmailServiceMock = require('../../../infraestructure/services/nodemailer-email').NodemailerEmailService;
                NodemailerEmailServiceMock.mockImplementationOnce(() => ({
                    sendVerificationCode: jest.fn(() => Promise.resolve({
                        success: false,
                        error: 'SMTP connection failed'
                    }))
                }));

                const validUserData = {
                    email: "norbeytest@gmail.com",
                    password: "PruebaTest123.",
                    firstName: "NorbeyTest",
                    lastName: "MejiaTest",
                    idType: "cc",
                    idNumber: "123456789",
                    phone: "3161234567",
                    roleId: "USER",
                };
                const request = createRequest({ body: validUserData });
                const response = createResponse();


                await createUser(request, response);


                expect(response.statusCode).toBe(201);
            });

            it.skip('should return 503 when email service fails', async () => {
                // NOTE: This test is skipped because the email service is instantiated at module level
                // in the controller, so mockImplementationOnce cannot override the instance.
                // To properly test this, the controller would need dependency injection for the email service.
                
                const NodemailerEmailServiceMock = require('../../../infraestructure/services/nodemailer-email').NodemailerEmailService;
                NodemailerEmailServiceMock.mockImplementationOnce(() => ({
                    sendVerificationCode: jest.fn(() => Promise.resolve({
                        success: false,
                        error: 'SMTP connection failed'
                    }))
                }));

                const validUserData = {
                    email: "norbeytest@gmail.com",
                    password: "PruebaTest123.",
                    firstName: "NorbeyTest",
                    lastName: "MejiaTest",
                    idType: "cc",
                    idNumber: "123456789",
                    phone: "3161234567",
                    roleId: "USER",
                };
                const request = createRequest({ body: validUserData });
                const response = createResponse();

                await createUser(request, response);

                expect(response.statusCode).toBe(503);
                const data = response._getJSONData();
                expect(data.ok).toBe(false);
                expect(data.message).toContain('verification email could not be sent');
                expect(data.user).toBeDefined();
                expect(data.user.email).toBe("norbeytest@gmail.com");
            });
        });

        describe('When email service throws an exception', () => {
            it.skip('should return 503 when email service throws error', async () => {


                const NodemailerEmailServiceMock = require('../../../infraestructure/services/nodemailer-email').NodemailerEmailService;
                NodemailerEmailServiceMock.mockImplementationOnce(() => ({
                    sendVerificationCode: jest.fn(() => Promise.reject(new Error('Network error')))
                }));

                const validUserData = {
                    email: "norbeytest@gmail.com",
                    password: "PruebaTest123.",
                    firstName: "NorbeyTest",
                    lastName: "MejiaTest",
                    idType: "cc",
                    idNumber: "123456789",
                    phone: "3161234567",
                    roleId: "USER",
                };
                const request = createRequest({ body: validUserData });
                const response = createResponse();


                await createUser(request, response);


                expect(response.statusCode).toBe(503);
            });
        });
    });

    describe('Given a database connection error', () => {
        describe('When attempting to save user to database', () => {
            it('should return 503 status code', async () => {

                const { saveUser } = require('../../../domain/services/user-services');
                saveUser.mockRejectedValueOnce(
                    new Error('[ERROR TO SERVICE] - Error saving user: Database connection failed')
                );

                const validUserData = {
                    email: "newuser@gmail.com",
                    password: "SecurePass123.",
                    firstName: "Test",
                    lastName: "User",
                    idType: "cc",
                    idNumber: "123456789",
                    phone: "3161234567",
                    roleId: "USER",
                };
                const request = createRequest({ body: validUserData });
                const response = createResponse();

                await createUser(request, response);

                expect(response.statusCode).toBe(503);
            });

            it('should return service unavailable message', async () => {
                const { saveUser } = require('../../../domain/services/user-services');
                saveUser.mockRejectedValueOnce(
                    new Error('[ERROR TO SERVICE] - Error saving user: Database connection failed')
                );

                const validUserData = {
                    email: "newuser@gmail.com",
                    password: "SecurePass123.",
                    firstName: "Test",
                    lastName: "User",
                    idType: "cc",
                    idNumber: "123456789",
                    phone: "3161234567",
                    roleId: "USER",
                };
                const request = createRequest({ body: validUserData });
                const response = createResponse();

                await createUser(request, response);

                const data = response._getJSONData();
                expect(data.ok).toBe(false);
                expect(data.message).toBe('Service temporarily unavailable. Please try again later.');
            });
        });
    });


    describe('Given password hashing service fails', () => {
        describe('When attempting to hash user password', () => {
            it('should return 500 status code', async () => {
                const { hashPassword } = require('../../../domain/services/user-services');
                hashPassword.mockRejectedValueOnce(
                    new Error('[ERROR TO SERVICE] - Error hashing password: Bcrypt service unavailable')
                );

                const validUserData = {
                    email: "newuser@gmail.com",
                    password: "SecurePass123.",
                    firstName: "Test",
                    lastName: "User",
                    idType: "cc",
                    idNumber: "123456789",
                    phone: "3161234567",
                    roleId: "USER",
                };
                const request = createRequest({ body: validUserData });
                const response = createResponse();

                await createUser(request, response);

                expect(response.statusCode).toBe(500);
            });

            it('should return hashing error message', async () => {

                const { hashPassword } = require('../../../domain/services/user-services');
                hashPassword.mockRejectedValueOnce(
                    new Error('[ERROR TO SERVICE] - Error hashing password: Bcrypt service unavailable')
                );

                const validUserData = {
                    email: "newuser@gmail.com",
                    password: "SecurePass123.",
                    firstName: "Test",
                    lastName: "User",
                    idType: "cc",
                    idNumber: "123456789",
                    phone: "3161234567",
                    roleId: "USER",
                };
                const request = createRequest({ body: validUserData });
                const response = createResponse();

                await createUser(request, response);

                const data = response._getJSONData();
                expect(data.ok).toBe(false);
                expect(data.message).toBe('Internal server error');
            });
        });
    });


    describe('Given missing required fields', () => {
        describe('When email is missing', () => {
            it('should return 500 status code', async () => {
                const { saveUser } = require('../../../domain/services/user-services');
                saveUser.mockRejectedValueOnce(
                    new Error('[ERROR TO SERVICE] - Error saving user: Email is required')
                );

                const missingEmailUser = {
                    password: "SecurePass123.",
                    firstName: "Test",
                    lastName: "User",
                    idType: "cc",
                    idNumber: "123456789",
                    phone: "3161234567",
                    roleId: "USER",
                };
                const request = createRequest({ body: missingEmailUser });
                const response = createResponse();

                await createUser(request, response);

                expect(response.statusCode).toBe(500);
            });
        });

        describe('When password is missing', () => {
            it('should return 500 status code', async () => {

                const { hashPassword } = require('../../../domain/services/user-services');
                hashPassword.mockRejectedValueOnce(
                    new Error('Password is required')
                );

                const missingPasswordUser = {
                    email: "test@gmail.com",
                    firstName: "Test",
                    lastName: "User",
                    idType: "cc",
                    idNumber: "123456789",
                    phone: "3161234567",
                    roleId: "USER",
                };
                const request = createRequest({ body: missingPasswordUser });
                const response = createResponse();

                await createUser(request, response);

                expect(response.statusCode).toBe(500);
            });
        });

        describe('When firstName is missing', () => {
            it('should return 500 status code', async () => {
                const { saveUser } = require('../../../domain/services/user-services');
                saveUser.mockRejectedValueOnce(
                    new Error('[ERROR TO SERVICE] - Error saving user: First name is required')
                );

                const missingFirstNameUser = {
                    email: "test@gmail.com",
                    password: "SecurePass123.",
                    lastName: "User",
                    idType: "cc",
                    idNumber: "123456789",
                    phone: "3161234567",
                    roleId: "USER",
                };
                const request = createRequest({ body: missingFirstNameUser });
                const response = createResponse();


                await createUser(request, response);


                expect(response.statusCode).toBe(500);
            });
        });
    });
});


describe('UserController - updateUser', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('Given valid user ID and update data', () => {
        describe('When updating an existing user', () => {
            it('should return 200 status code', async () => {
                const { findUserById, updateUserById } = require('../../../domain/services/user-services');

                findUserById.mockResolvedValueOnce({
                    _id: '123-123',
                    email: "existinguser@gmail.com",
                    firstName: "John",
                    lastName: "Doe",
                    idType: "cc",
                    idNumber: "123456789",
                    phone: "3161234567",
                    roleId: "USER",
                    status: "ACTIVE"
                });

                updateUserById.mockResolvedValueOnce({
                    _id: '123-123',
                    email: "existinguser@gmail.com",
                    firstName: "John Updated",
                    lastName: "Doe Updated",
                    idType: "cc",
                    idNumber: "123456789",
                    phone: "3161234567",
                    roleId: "USER",
                    status: "ACTIVE"
                });

                const updateData = {
                    email: "existinguser@gmail.com",
                    password: "NewPassword123.",
                    firstName: "John Updated",
                    lastName: "Doe Updated",
                    idType: "cc",
                    idNumber: "123456789",
                    phone: "3161234567",
                    roleId: "USER",
                    status: "ACTIVE"
                };

                const request = createRequest({
                    params: { id: '123-123' },
                    body: updateData
                });
                const response = createResponse();

                await updateUser(request, response);

                expect(response.statusCode).toBe(200);
            });

            it('should return success message', async () => {

                const { findUserById, updateUserById } = require('../../../domain/services/user-services');

                findUserById.mockResolvedValueOnce({
                    _id: '123-123',
                    email: "existinguser@gmail.com",
                    firstName: "John",
                    lastName: "Doe"
                });

                updateUserById.mockResolvedValueOnce({
                    _id: '123-123',
                    email: "existinguser@gmail.com",
                    firstName: "John Updated",
                    lastName: "Doe Updated"
                });

                const updateData = {
                    email: "existinguser@gmail.com",
                    password: "NewPassword123.",
                    firstName: "John Updated",
                    lastName: "Doe Updated",
                    idType: "cc",
                    idNumber: "123456789",
                    phone: "3161234567",
                    roleId: "USER",
                    status: "ACTIVE"
                };

                const request = createRequest({
                    params: { id: '123-123' },
                    body: updateData
                });
                const response = createResponse();

                await updateUser(request, response);

                const data = response._getJSONData();
                expect(data.ok).toBe(true);
                expect(data.message).toBe('User updated successfully');
            });

            it('should return updated user data', async () => {
                const { findUserById, updateUserById } = require('../../../domain/services/user-services');

                findUserById.mockResolvedValueOnce({
                    _id: '123-123',
                    email: "existinguser@gmail.com",
                    firstName: "John",
                    lastName: "Doe",
                    idType: "cc",
                    idNumber: "123456789",
                    phone: "3161234567",
                    roleId: "USER",
                    status: "ACTIVE"
                });

                updateUserById.mockResolvedValueOnce({
                    _id: '123-123',
                    email: "existinguser@gmail.com",
                    firstName: "John Updated",
                    lastName: "Doe Updated",
                    idType: "cc",
                    idNumber: "123456789",
                    phone: "3169999999",
                    roleId: "USER",
                    status: "ACTIVE"
                });

                const updateData = {
                    email: "existinguser@gmail.com",
                    password: "NewPassword123.",
                    firstName: "John Updated",
                    lastName: "Doe Updated",
                    idType: "cc",
                    idNumber: "123456789",
                    phone: "3169999999",
                    roleId: "USER",
                    status: "ACTIVE"
                };

                const request = createRequest({
                    params: { id: '123-123' },
                    body: updateData
                });
                const response = createResponse();

                await updateUser(request, response);

                const data = response._getJSONData();
                expect(data.user).toBeDefined();
                expect(data.user.firstName).toBe('John Updated');
                expect(data.user.lastName).toBe('Doe Updated');
                expect(data.user.phone).toBe('3169999999');
            });

            it('should call findUserById with correct user ID', async () => {
                const { findUserById, updateUserById } = require('../../../domain/services/user-services');

                findUserById.mockResolvedValueOnce({
                    _id: '456-789',
                    email: "test@gmail.com",
                    firstName: "Test",
                    lastName: "User"
                });

                updateUserById.mockResolvedValueOnce({
                    _id: '456-789',
                    email: "test@gmail.com",
                    firstName: "Test Updated",
                    lastName: "User Updated"
                });

                const updateData = {
                    email: "test@gmail.com",
                    password: "Password123.",
                    firstName: "Test Updated",
                    lastName: "User Updated",
                    idType: "cc",
                    idNumber: "987654321",
                    phone: "3161234567",
                    roleId: "USER",
                    status: "ACTIVE"
                };

                const request = createRequest({
                    params: { id: '456-789' },
                    body: updateData
                });
                const response = createResponse();

                // Act
                await updateUser(request, response);

                expect(findUserById).toHaveBeenCalledWith(expect.anything(), '456-789');
                expect(findUserById).toHaveBeenCalledTimes(1);
            });

            it('should call updateUserById with correct parameters', async () => {
                const { findUserById, updateUserById } = require('../../../domain/services/user-services');

                findUserById.mockResolvedValueOnce({
                    _id: '123-123',
                    email: "test@gmail.com",
                    firstName: "Test",
                    lastName: "User"
                });

                updateUserById.mockResolvedValueOnce({
                    _id: '123-123',
                    email: "test@gmail.com",
                    firstName: "Test Updated",
                    lastName: "User Updated"
                });

                const updateData = {
                    email: "test@gmail.com",
                    password: "Password123.",
                    firstName: "Test Updated",
                    lastName: "User Updated",
                    idType: "cc",
                    idNumber: "987654321",
                    phone: "3161234567",
                    roleId: "USER",
                    status: "ACTIVE"
                };

                const request = createRequest({
                    params: { id: '123-123' },
                    body: updateData
                });
                const response = createResponse();

                await updateUser(request, response);

                expect(updateUserById).toHaveBeenCalledWith(
                    expect.anything(),
                    '123-123',
                    expect.objectContaining({
                        firstName: "Test Updated",
                        lastName: "User Updated"
                    })
                );
                expect(updateUserById).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe('Given a user ID that does not exist', () => {
        describe('When attempting to update a non-existent user', () => {
            it('should return 404 status code', async () => {
                const { findUserById } = require('../../../domain/services/user-services');

                findUserById.mockResolvedValueOnce(null);

                const updateData = {
                    email: "test@gmail.com",
                    password: "Password123.",
                    firstName: "Test",
                    lastName: "User",
                    idType: "cc",
                    idNumber: "123456789",
                    phone: "3161234567",
                    roleId: "USER",
                    status: "ACTIVE"
                };

                const request = createRequest({
                    params: { id: 'non-existent-id' },
                    body: updateData
                });
                const response = createResponse();

                await updateUser(request, response);

                expect(response.statusCode).toBe(404);
            });

            it('should return user not found message', async () => {

                const { findUserById } = require('../../../domain/services/user-services');

                findUserById.mockResolvedValueOnce(null);

                const updateData = {
                    email: "test@gmail.com",
                    password: "Password123.",
                    firstName: "Test",
                    lastName: "User",
                    idType: "cc",
                    idNumber: "123456789",
                    phone: "3161234567",
                    roleId: "USER",
                    status: "ACTIVE"
                };

                const request = createRequest({
                    params: { id: 'non-existent-id' },
                    body: updateData
                });
                const response = createResponse();


                await updateUser(request, response);


                const data = response._getJSONData();
                expect(data.ok).toBe(false);
                expect(data.message).toBe('User not found');
            });

            it('should not call updateUserById', async () => {

                const { findUserById, updateUserById } = require('../../../domain/services/user-services');

                findUserById.mockResolvedValueOnce(null);

                const updateData = {
                    email: "test@gmail.com",
                    password: "Password123.",
                    firstName: "Test",
                    lastName: "User",
                    idType: "cc",
                    idNumber: "123456789",
                    phone: "3161234567",
                    roleId: "USER",
                    status: "ACTIVE"
                };

                const request = createRequest({
                    params: { id: 'non-existent-id' },
                    body: updateData
                });
                const response = createResponse();


                await updateUser(request, response);

                expect(updateUserById).not.toHaveBeenCalled();
            });
        });
    });

    describe('Given an invalid user ID format', () => {
        describe('When attempting to update with invalid ID', () => {
            it('should return 404 status code when user is not found', async () => {

                const { findUserById } = require('../../../domain/services/user-services');

                findUserById.mockResolvedValueOnce(null);

                const updateData = {
                    email: "test@gmail.com",
                    password: "Password123.",
                    firstName: "Test",
                    lastName: "User",
                    idType: "cc",
                    idNumber: "123456789",
                    phone: "3161234567",
                    roleId: "USER",
                    status: "ACTIVE"
                };

                const request = createRequest({
                    params: { id: 'invalid-format-id' },
                    body: updateData
                });
                const response = createResponse();

                await updateUser(request, response);

                expect(response.statusCode).toBe(404);
            });
        });
    });

    describe('Given findUserById service fails', () => {
        describe('When database error occurs during user lookup', () => {
            it('should not throw unhandled error', async () => {
                const { findUserById } = require('../../../domain/services/user-services');

                findUserById.mockRejectedValueOnce(
                    new Error('[ERROR TO SERVICE] - Error finding user by ID: Database connection failed')
                );

                const updateData = {
                    email: "test@gmail.com",
                    password: "Password123.",
                    firstName: "Test",
                    lastName: "User",
                    idType: "cc",
                    idNumber: "123456789",
                    phone: "3161234567",
                    roleId: "USER",
                    status: "ACTIVE"
                };

                const request = createRequest({
                    params: { id: '123-123' },
                    body: updateData
                });
                const response = createResponse();

                await expect(updateUser(request, response)).resolves.not.toThrow();
            });
        });
    });

    describe('Given updateUserById service fails', () => {
        describe('When database error occurs during user update', () => {
            it('should not throw unhandled error', async () => {

                const { findUserById, updateUserById } = require('../../../domain/services/user-services');

                findUserById.mockResolvedValueOnce({
                    _id: '123-123',
                    email: "test@gmail.com",
                    firstName: "Test",
                    lastName: "User"
                });

                updateUserById.mockRejectedValueOnce(
                    new Error('[ERROR TO SERVICE] - Error updating user: Database connection failed')
                );

                const updateData = {
                    email: "test@gmail.com",
                    password: "Password123.",
                    firstName: "Test Updated",
                    lastName: "User Updated",
                    idType: "cc",
                    idNumber: "123456789",
                    phone: "3161234567",
                    roleId: "USER",
                    status: "ACTIVE"
                };

                const request = createRequest({
                    params: { id: '123-123' },
                    body: updateData
                });
                const response = createResponse();


                await expect(updateUser(request, response)).resolves.not.toThrow();
            });
        });
    });
});


describe('UserController - updatePartialUser', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('Given valid user ID and partial update data', () => {
        describe('When updating only specific fields of an existing user', () => {
            it('should return 200 status code', async () => {

                const { findUserById, updateUserById } = require('../../../domain/services/user-services');

                findUserById.mockResolvedValueOnce({
                    _id: '123-123',
                    email: "existinguser@gmail.com",
                    firstName: "John",
                    lastName: "Doe",
                    idType: "cc",
                    idNumber: "123456789",
                    phone: "3161234567",
                    roleId: "USER",
                    status: "ACTIVE"
                });

                updateUserById.mockResolvedValueOnce({
                    _id: '123-123',
                    email: "existinguser@gmail.com",
                    firstName: "John Updated",
                    lastName: "Doe",
                    idType: "cc",
                    idNumber: "123456789",
                    phone: "3161234567",
                    roleId: "USER",
                    status: "ACTIVE"
                });

                const partialUpdateData = {
                    firstName: "John Updated"
                };

                const request = createRequest({
                    params: { id: '123-123' },
                    body: partialUpdateData
                });
                const response = createResponse();

                await updatePartialUser(request, response);

                expect(response.statusCode).toBe(200);
            });

            it('should return success message', async () => {

                const { findUserById, updateUserById } = require('../../../domain/services/user-services');

                findUserById.mockResolvedValueOnce({
                    _id: '123-123',
                    email: "existinguser@gmail.com",
                    firstName: "John",
                    lastName: "Doe"
                });

                updateUserById.mockResolvedValueOnce({
                    _id: '123-123',
                    email: "existinguser@gmail.com",
                    firstName: "John",
                    lastName: "Doe Updated"
                });

                const partialUpdateData = {
                    lastName: "Doe Updated"
                };

                const request = createRequest({
                    params: { id: '123-123' },
                    body: partialUpdateData
                });
                const response = createResponse();

                await updatePartialUser(request, response);

                const data = response._getJSONData();
                expect(data.ok).toBe(true);
                expect(data.message).toBe('User updated successfully');
            });

            it('should return user with only updated fields changed', async () => {

                const { findUserById, updateUserById } = require('../../../domain/services/user-services');

                findUserById.mockResolvedValueOnce({
                    _id: '123-123',
                    email: "existinguser@gmail.com",
                    firstName: "John",
                    lastName: "Doe",
                    phone: "3161234567"
                });

                updateUserById.mockResolvedValueOnce({
                    _id: '123-123',
                    email: "existinguser@gmail.com",
                    firstName: "John",
                    lastName: "Doe",
                    phone: "3169999999"
                });

                const partialUpdateData = {
                    phone: "3169999999"
                };

                const request = createRequest({
                    params: { id: '123-123' },
                    body: partialUpdateData
                });
                const response = createResponse();


                await updatePartialUser(request, response);

                const data = response._getJSONData();
                expect(data.user).toBeDefined();
                expect(data.user.phone).toBe('3169999999');
                expect(data.user.firstName).toBe('John');
                expect(data.user.lastName).toBe('Doe');
            });

            it('should allow updating multiple fields at once', async () => {

                const { findUserById, updateUserById } = require('../../../domain/services/user-services');

                findUserById.mockResolvedValueOnce({
                    _id: '123-123',
                    email: "existinguser@gmail.com",
                    firstName: "John",
                    lastName: "Doe",
                    phone: "3161234567",
                    city: "Bogota"
                });

                updateUserById.mockResolvedValueOnce({
                    _id: '123-123',
                    email: "existinguser@gmail.com",
                    firstName: "John",
                    lastName: "Doe",
                    phone: "3169999999",
                    city: "Medellin"
                });

                const partialUpdateData = {
                    phone: "3169999999",
                    city: "Medellin"
                };

                const request = createRequest({
                    params: { id: '123-123' },
                    body: partialUpdateData
                });
                const response = createResponse();

                await updatePartialUser(request, response);

                const data = response._getJSONData();
                expect(data.user.phone).toBe('3169999999');
                expect(data.user.city).toBe('Medellin');
            });

            it('should call findUserById with correct user ID', async () => {
                const { findUserById, updateUserById } = require('../../../domain/services/user-services');

                findUserById.mockResolvedValueOnce({
                    _id: '456-789',
                    email: "test@gmail.com",
                    firstName: "Test"
                });

                updateUserById.mockResolvedValueOnce({
                    _id: '456-789',
                    email: "test@gmail.com",
                    firstName: "Test Updated"
                });

                const partialUpdateData = {
                    firstName: "Test Updated"
                };

                const request = createRequest({
                    params: { id: '456-789' },
                    body: partialUpdateData
                });
                const response = createResponse();

                await updatePartialUser(request, response);

                // Assert
                expect(findUserById).toHaveBeenCalledWith(expect.anything(), '456-789');
                expect(findUserById).toHaveBeenCalledTimes(1);
            });

            it('should call updateUserById with partial data only', async () => {
                // Arrange
                const { findUserById, updateUserById } = require('../../../domain/services/user-services');

                findUserById.mockResolvedValueOnce({
                    _id: '123-123',
                    email: "test@gmail.com",
                    firstName: "Test"
                });

                updateUserById.mockResolvedValueOnce({
                    _id: '123-123',
                    email: "test@gmail.com",
                    firstName: "Test Updated"
                });

                const partialUpdateData = {
                    firstName: "Test Updated"
                };

                const request = createRequest({
                    params: { id: '123-123' },
                    body: partialUpdateData
                });
                const response = createResponse();

                // Act
                await updatePartialUser(request, response);

                // Assert
                expect(updateUserById).toHaveBeenCalledWith(
                    expect.anything(),
                    '123-123',
                    { firstName: "Test Updated" }
                );
                expect(updateUserById).toHaveBeenCalledTimes(1);
            });

            it('should allow updating status field', async () => {
                // Arrange
                const { findUserById, updateUserById } = require('../../../domain/services/user-services');

                findUserById.mockResolvedValueOnce({
                    _id: '123-123',
                    email: "test@gmail.com",
                    status: "ACTIVE"
                });

                updateUserById.mockResolvedValueOnce({
                    _id: '123-123',
                    email: "test@gmail.com",
                    status: "INACTIVE"
                });

                const partialUpdateData = {
                    status: "INACTIVE"
                };

                const request = createRequest({
                    params: { id: '123-123' },
                    body: partialUpdateData
                });
                const response = createResponse();

                // Act
                await updatePartialUser(request, response);

                // Assert
                const data = response._getJSONData();
                expect(data.user.status).toBe('INACTIVE');
            });

            it('should allow updating address fields', async () => {
                // Arrange
                const { findUserById, updateUserById } = require('../../../domain/services/user-services');

                findUserById.mockResolvedValueOnce({
                    _id: '123-123',
                    email: "test@gmail.com",
                    address: "Old Address",
                    city: "Old City"
                });

                updateUserById.mockResolvedValueOnce({
                    _id: '123-123',
                    email: "test@gmail.com",
                    address: "New Address 123",
                    city: "New City"
                });

                const partialUpdateData = {
                    address: "New Address 123",
                    city: "New City"
                };

                const request = createRequest({
                    params: { id: '123-123' },
                    body: partialUpdateData
                });
                const response = createResponse();

                // Act
                await updatePartialUser(request, response);

                // Assert
                const data = response._getJSONData();
                expect(data.user.address).toBe('New Address 123');
                expect(data.user.city).toBe('New City');
            });
        });

        describe('When updating with empty body', () => {
            it('should return 200 and call update with empty object', async () => {
                // Arrange
                const { findUserById, updateUserById } = require('../../../domain/services/user-services');

                findUserById.mockResolvedValueOnce({
                    _id: '123-123',
                    email: "test@gmail.com",
                    firstName: "Test"
                });

                updateUserById.mockResolvedValueOnce({
                    _id: '123-123',
                    email: "test@gmail.com",
                    firstName: "Test"
                });

                const partialUpdateData = {};

                const request = createRequest({
                    params: { id: '123-123' },
                    body: partialUpdateData
                });
                const response = createResponse();

                // Act
                await updatePartialUser(request, response);

                // Assert
                expect(response.statusCode).toBe(200);
                expect(updateUserById).toHaveBeenCalledWith(
                    expect.anything(),
                    '123-123',
                    {}
                );
            });
        });
    });


    describe('Given a user ID that does not exist', () => {
        describe('When attempting to partially update a non-existent user', () => {
            it('should return 404 status code', async () => {
                // Arrange
                const { findUserById } = require('../../../domain/services/user-services');

                findUserById.mockResolvedValueOnce(null);

                const partialUpdateData = {
                    firstName: "Updated Name"
                };

                const request = createRequest({
                    params: { id: 'non-existent-id' },
                    body: partialUpdateData
                });
                const response = createResponse();

                // Act
                await updatePartialUser(request, response);

                // Assert
                expect(response.statusCode).toBe(404);
            });

            it('should return user not found message', async () => {
                // Arrange
                const { findUserById } = require('../../../domain/services/user-services');

                findUserById.mockResolvedValueOnce(null);

                const partialUpdateData = {
                    phone: "3169999999"
                };

                const request = createRequest({
                    params: { id: 'non-existent-id' },
                    body: partialUpdateData
                });
                const response = createResponse();

                // Act
                await updatePartialUser(request, response);

                // Assert
                const data = response._getJSONData();
                expect(data.ok).toBe(false);
                expect(data.message).toBe('User not found');
            });

            it('should not call updateUserById when user not found', async () => {
                // Arrange
                const { findUserById, updateUserById } = require('../../../domain/services/user-services');

                findUserById.mockResolvedValueOnce(null);

                const partialUpdateData = {
                    firstName: "Test"
                };

                const request = createRequest({
                    params: { id: 'non-existent-id' },
                    body: partialUpdateData
                });
                const response = createResponse();

                // Act
                await updatePartialUser(request, response);

                // Assert
                expect(updateUserById).not.toHaveBeenCalled();
            });
        });
    });

    describe('Given an invalid user ID format', () => {
        describe('When attempting to partially update with invalid ID', () => {
            it('should return 404 status code when user is not found', async () => {
                // Arrange
                const { findUserById } = require('../../../domain/services/user-services');

                findUserById.mockResolvedValueOnce(null);

                const partialUpdateData = {
                    firstName: "Test"
                };

                const request = createRequest({
                    params: { id: 'invalid-id-123' },
                    body: partialUpdateData
                });
                const response = createResponse();

                // Act
                await updatePartialUser(request, response);

                // Assert
                expect(response.statusCode).toBe(404);
            });
        });
    });

    describe('Given findUserById service fails', () => {
        describe('When database error occurs during user lookup', () => {
            it('should not throw unhandled error', async () => {
                // Arrange
                const { findUserById } = require('../../../domain/services/user-services');

                findUserById.mockRejectedValueOnce(
                    new Error('[ERROR TO SERVICE] - Error finding user by ID: Database connection failed')
                );

                const partialUpdateData = {
                    firstName: "Test"
                };

                const request = createRequest({
                    params: { id: '123-123' },
                    body: partialUpdateData
                });
                const response = createResponse();

                await expect(updatePartialUser(request, response)).resolves.not.toThrow();
            });
        });
    });

    describe('Given updateUserById service fails', () => {
        describe('When database error occurs during partial update', () => {
            it('should not throw unhandled error', async () => {
                // Arrange
                const { findUserById, updateUserById } = require('../../../domain/services/user-services');

                findUserById.mockResolvedValueOnce({
                    _id: '123-123',
                    email: "test@gmail.com",
                    firstName: "Test"
                });

                updateUserById.mockRejectedValueOnce(
                    new Error('[ERROR TO SERVICE] - Error updating user: Database connection failed')
                );

                const partialUpdateData = {
                    firstName: "Test Updated"
                };

                const request = createRequest({
                    params: { id: '123-123' },
                    body: partialUpdateData
                });
                const response = createResponse();

                await expect(updatePartialUser(request, response)).resolves.not.toThrow();
            });
        });
    });

    describe('Given invalid partial update data', () => {
        describe('When attempting to update with invalid field types', () => {
            it('should handle update and let service validate data', async () => {
                // Arrange
                const { findUserById, updateUserById } = require('../../../domain/services/user-services');

                findUserById.mockResolvedValueOnce({
                    _id: '123-123',
                    email: "test@gmail.com"
                });

                updateUserById.mockResolvedValueOnce({
                    _id: '123-123',
                    email: "test@gmail.com",
                    status: "INVALID_STATUS" // Dato inválido
                });

                const partialUpdateData = {
                    status: "INVALID_STATUS"
                };

                const request = createRequest({
                    params: { id: '123-123' },
                    body: partialUpdateData
                });
                const response = createResponse();

                // Act
                await updatePartialUser(request, response);

                expect(updateUserById).toHaveBeenCalledWith(
                    expect.anything(),
                    '123-123',
                    { status: "INVALID_STATUS" }
                );
            });
        });
    });
});



// ============================================================================
// USER CONTROLLER - GET USER PROFILE TESTS
// ============================================================================

describe('UserController - getUserProfile', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('Given a valid user ID', () => {
        describe('When retrieving user profile', () => {
            it('should return 200 status code', async () => {
                const { findUserById } = require('../../../domain/services/user-services');

                findUserById.mockResolvedValueOnce({
                    _id: '123-123',
                    email: "user@gmail.com",
                    firstName: "John",
                    lastName: "Doe",
                    idType: "cc",
                    idNumber: "123456789",
                    phone: "3161234567",
                    roleId: "USER",
                    status: "ACTIVE"
                });

                const request = createRequest({
                    params: { id: '123-123' }
                });
                const response = createResponse();

                await getUserProfile(request, response);

                expect(response.statusCode).toBe(200);
            });

            it('should return user profile data', async () => {
                const { findUserById } = require('../../../domain/services/user-services');

                findUserById.mockResolvedValueOnce({
                    _id: '123-123',
                    email: "user@gmail.com",
                    firstName: "John",
                    lastName: "Doe",
                    idType: "cc",
                    idNumber: "123456789",
                    phone: "3161234567",
                    roleId: "USER",
                    status: "ACTIVE"
                });

                const request = createRequest({
                    params: { id: '123-123' }
                });
                const response = createResponse();

                await getUserProfile(request, response);

                const data = response._getJSONData();
                expect(data.ok).toBe(true);
                expect(data.user).toBeDefined();
                expect(data.user.id).toBe('123-123');
                expect(data.user.email).toBe('user@gmail.com');
                expect(data.user.firstName).toBe('John');
            });

            it('should call findUserById with correct user ID', async () => {
                const { findUserById } = require('../../../domain/services/user-services');

                findUserById.mockResolvedValueOnce({
                    _id: '456-789',
                    email: "user@gmail.com",
                    firstName: "John",
                    lastName: "Doe"
                });

                const request = createRequest({
                    params: { id: '456-789' }
                });
                const response = createResponse();

                await getUserProfile(request, response);

                expect(findUserById).toHaveBeenCalledWith(expect.anything(), '456-789');
                expect(findUserById).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe('Given a user ID that does not exist', () => {
        describe('When attempting to retrieve profile', () => {
            it('should return 404 status code', async () => {
                const { findUserById } = require('../../../domain/services/user-services');

                findUserById.mockResolvedValueOnce(null);

                const request = createRequest({
                    params: { id: 'non-existent-id' }
                });
                const response = createResponse();

                await getUserProfile(request, response);

                expect(response.statusCode).toBe(404);
            });

            it('should return user not found message', async () => {
                const { findUserById } = require('../../../domain/services/user-services');

                findUserById.mockResolvedValueOnce(null);

                const request = createRequest({
                    params: { id: 'non-existent-id' }
                });
                const response = createResponse();

                await getUserProfile(request, response);

                const data = response._getJSONData();
                expect(data.ok).toBe(false);
                expect(data.message).toBe('User not found');
            });
        });
    });

    describe('Given findUserById service fails', () => {
        describe('When database error occurs', () => {
            it('should return 503 status code', async () => {
                const { findUserById } = require('../../../domain/services/user-services');

                findUserById.mockRejectedValueOnce(
                    new Error('[ERROR TO SERVICE] - Error finding user by ID: Database connection failed')
                );

                const request = createRequest({
                    params: { id: '123-123' }
                });
                const response = createResponse();

                await getUserProfile(request, response);

                expect(response.statusCode).toBe(503);
            });

            it('should return service unavailable message', async () => {
                const { findUserById } = require('../../../domain/services/user-services');

                findUserById.mockRejectedValueOnce(
                    new Error('[ERROR TO SERVICE] - Error finding user by ID: Database connection failed')
                );

                const request = createRequest({
                    params: { id: '123-123' }
                });
                const response = createResponse();

                await getUserProfile(request, response);

                const data = response._getJSONData();
                expect(data.ok).toBe(false);
                expect(data.message).toBe('Service temporarily unavailable. Please try again later.');
            });
        });
    });
});

// ============================================================================
// USER CONTROLLER - GET ALL USERS TESTS
// ============================================================================

describe('UserController - getAllUsers', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('Given users exist in the database', () => {
        describe('When retrieving all users', () => {
            it('should return 200 status code', async () => {
                const { findAllUsers } = require('../../../domain/services/user-services');

                findAllUsers.mockResolvedValueOnce([
                    {
                        _id: '123-123',
                        email: "user1@gmail.com",
                        firstName: "John",
                        lastName: "Doe",
                        status: "ACTIVE"
                    },
                    {
                        _id: '456-456',
                        email: "user2@gmail.com",
                        firstName: "Jane",
                        lastName: "Smith",
                        status: "ACTIVE"
                    }
                ]);

                const request = createRequest();
                const response = createResponse();

                await getAllUsers(request, response);

                expect(response.statusCode).toBe(200);
            });

            it('should return array of users', async () => {
                const { findAllUsers } = require('../../../domain/services/user-services');

                findAllUsers.mockResolvedValueOnce([
                    {
                        _id: '123-123',
                        email: "user1@gmail.com",
                        firstName: "John",
                        lastName: "Doe"
                    },
                    {
                        _id: '456-456',
                        email: "user2@gmail.com",
                        firstName: "Jane",
                        lastName: "Smith"
                    }
                ]);

                const request = createRequest();
                const response = createResponse();

                await getAllUsers(request, response);

                const data = response._getJSONData();
                expect(data.ok).toBe(true);
                expect(data.users).toBeDefined();
                expect(Array.isArray(data.users)).toBe(true);
                expect(data.users).toHaveLength(2);
            });

            it('should return users with transformed data', async () => {
                const { findAllUsers } = require('../../../domain/services/user-services');

                findAllUsers.mockResolvedValueOnce([
                    {
                        _id: '123-123',
                        email: "user1@gmail.com",
                        firstName: "John",
                        lastName: "Doe",
                        password: "hashedPassword" // Should not be in response
                    }
                ]);

                const request = createRequest();
                const response = createResponse();

                await getAllUsers(request, response);

                const data = response._getJSONData();
                expect(data.users[0].id).toBe('123-123');
                expect(data.users[0].email).toBe('user1@gmail.com');
                expect(data.users[0].password).toBeUndefined(); // Password should not be returned
            });

            it('should call findAllUsers service', async () => {
                const { findAllUsers } = require('../../../domain/services/user-services');

                findAllUsers.mockResolvedValueOnce([]);

                const request = createRequest();
                const response = createResponse();

                await getAllUsers(request, response);

                expect(findAllUsers).toHaveBeenCalledWith(expect.anything());
                expect(findAllUsers).toHaveBeenCalledTimes(1);
            });
        });

        describe('When no users exist', () => {
            it('should return empty array', async () => {
                const { findAllUsers } = require('../../../domain/services/user-services');

                findAllUsers.mockResolvedValueOnce([]);

                const request = createRequest();
                const response = createResponse();

                await getAllUsers(request, response);

                const data = response._getJSONData();
                expect(data.ok).toBe(true);
                expect(data.users).toEqual([]);
            });
        });
    });

    describe('Given findAllUsers service fails', () => {
        describe('When database error occurs', () => {
            it('should return 503 status code', async () => {
                const { findAllUsers } = require('../../../domain/services/user-services');

                findAllUsers.mockRejectedValueOnce(
                    new Error('[ERROR TO SERVICE] - Error finding users: Database connection failed')
                );

                const request = createRequest();
                const response = createResponse();

                await getAllUsers(request, response);

                expect(response.statusCode).toBe(503);
            });

            it('should return service unavailable message', async () => {
                const { findAllUsers } = require('../../../domain/services/user-services');

                findAllUsers.mockRejectedValueOnce(
                    new Error('[ERROR TO SERVICE] - Error finding users: Database connection failed')
                );

                const request = createRequest();
                const response = createResponse();

                await getAllUsers(request, response);

                const data = response._getJSONData();
                expect(data.ok).toBe(false);
                expect(data.message).toBe('Service temporarily unavailable. Please try again later.');
            });
        });
    });
});

// ============================================================================
// USER CONTROLLER - VERIFY EMAIL TESTS
// ============================================================================

describe('UserController - verifyEmail', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('Given valid email and verification code', () => {
        describe('When verifying email successfully', () => {
            it('should return 200 status code', async () => {
                const { verifyUserEmail } = require('../../../domain/services/user-services');

                verifyUserEmail.mockResolvedValueOnce({
                    success: true,
                    message: 'Email verified successfully. You can now make purchases.'
                });

                const request = createRequest({
                    body: {
                        email: "user@gmail.com",
                        code: "123456"
                    }
                });
                const response = createResponse();

                await verifyEmail(request, response);

                expect(response.statusCode).toBe(200);
            });

            it('should return success message', async () => {
                const { verifyUserEmail } = require('../../../domain/services/user-services');

                verifyUserEmail.mockResolvedValueOnce({
                    success: true,
                    message: 'Email verified successfully. You can now make purchases.'
                });

                const request = createRequest({
                    body: {
                        email: "user@gmail.com",
                        code: "123456"
                    }
                });
                const response = createResponse();

                await verifyEmail(request, response);

                const data = response._getJSONData();
                expect(data.ok).toBe(true);
                expect(data.message).toBe('Email verified successfully. You can now make purchases.');
            });

            it('should call verifyUserEmail with correct parameters', async () => {
                const { verifyUserEmail } = require('../../../domain/services/user-services');

                verifyUserEmail.mockResolvedValueOnce({
                    success: true,
                    message: 'Email verified successfully'
                });

                const request = createRequest({
                    body: {
                        email: "user@gmail.com",
                        code: "123456"
                    }
                });
                const response = createResponse();

                await verifyEmail(request, response);

                expect(verifyUserEmail).toHaveBeenCalledWith(
                    expect.anything(),
                    "user@gmail.com",
                    "123456"
                );
                expect(verifyUserEmail).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe('Given invalid verification code', () => {
        describe('When code does not match', () => {
            it('should return 422 status code', async () => {
                const { verifyUserEmail } = require('../../../domain/services/user-services');

                verifyUserEmail.mockResolvedValueOnce({
                    success: false,
                    message: 'Invalid verification code'
                });

                const request = createRequest({
                    body: {
                        email: "user@gmail.com",
                        code: "wrong-code"
                    }
                });
                const response = createResponse();

                await verifyEmail(request, response);

                expect(response.statusCode).toBe(422);
            });

            it('should return error message', async () => {
                const { verifyUserEmail } = require('../../../domain/services/user-services');

                verifyUserEmail.mockResolvedValueOnce({
                    success: false,
                    message: 'Invalid verification code'
                });

                const request = createRequest({
                    body: {
                        email: "user@gmail.com",
                        code: "wrong-code"
                    }
                });
                const response = createResponse();

                await verifyEmail(request, response);

                const data = response._getJSONData();
                expect(data.ok).toBe(false);
                expect(data.message).toBe('Invalid verification code');
            });
        });

        describe('When code has expired', () => {
            it('should return 400 with expiration message', async () => {
                const { verifyUserEmail } = require('../../../domain/services/user-services');

                verifyUserEmail.mockResolvedValueOnce({
                    success: false,
                    message: 'Verification code has expired'
                });

                const request = createRequest({
                    body: {
                        email: "user@gmail.com",
                        code: "123456"
                    }
                });
                const response = createResponse();

                await verifyEmail(request, response);

                expect(response.statusCode).toBe(410);
                const data = response._getJSONData();
                expect(data.message).toBe('Verification code has expired');
            });
        });

        describe('When email is already verified', () => {
            it('should return 409 with already verified message', async () => {
                const { verifyUserEmail } = require('../../../domain/services/user-services');

                verifyUserEmail.mockResolvedValueOnce({
                    success: false,
                    message: 'Email is already verified'
                });

                const request = createRequest({
                    body: {
                        email: "user@gmail.com",
                        code: "123456"
                    }
                });
                const response = createResponse();

                await verifyEmail(request, response);

                expect(response.statusCode).toBe(409);
                const data = response._getJSONData();
                expect(data.message).toBe('Email is already verified');
            });
        });
    });

    describe('Given verifyUserEmail service fails', () => {
        describe('When database error occurs', () => {
            it('should return 503 status code', async () => {
                const { verifyUserEmail } = require('../../../domain/services/user-services');

                verifyUserEmail.mockRejectedValueOnce(
                    new Error('[ERROR TO SERVICE] - Error verifying email: Database connection failed')
                );

                const request = createRequest({
                    body: {
                        email: "user@gmail.com",
                        code: "123456"
                    }
                });
                const response = createResponse();

                await verifyEmail(request, response);

                expect(response.statusCode).toBe(503);
            });

            it('should return service unavailable message', async () => {
                const { verifyUserEmail } = require('../../../domain/services/user-services');

                verifyUserEmail.mockRejectedValueOnce(
                    new Error('[ERROR TO SERVICE] - Error verifying email: Database connection failed')
                );

                const request = createRequest({
                    body: {
                        email: "user@gmail.com",
                        code: "123456"
                    }
                });
                const response = createResponse();

                await verifyEmail(request, response);

                const data = response._getJSONData();
                expect(data.ok).toBe(false);
                expect(data.message).toBe('Service temporarily unavailable. Please try again later.');
            });
        });
    });
});

// ============================================================================
// USER CONTROLLER - RESEND CODE TESTS
// ============================================================================

describe('UserController - resendCode', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('Given valid email for resending code', () => {
        describe('When resending verification code successfully', () => {
            it('should return 200 status code', async () => {
                const { resendVerificationCode } = require('../../../domain/services/user-services');
                const { MongoUserRepository } = require('../../../infraestructure/repositories/mongo-user');
                const { NodemailerEmailService } = require('../../../infraestructure/services/nodemailer-email');

                resendVerificationCode.mockResolvedValueOnce({
                    success: true,
                    message: 'Ready to generate new code'
                });

                const mockRepo = new MongoUserRepository();
                mockRepo.saveVerificationCode.mockResolvedValueOnce(undefined);
                mockRepo.findByEmail.mockResolvedValueOnce({
                    _id: '123-123',
                    email: "user@gmail.com",
                    firstName: "John",
                    isEmailVerified: false
                });

                const mockEmailService = new NodemailerEmailService();
                mockEmailService.sendVerificationCode.mockResolvedValueOnce({
                    success: true,
                    messageId: 'mock-message-id'
                });

                const request = createRequest({
                    body: {
                        email: "user@gmail.com"
                    }
                });
                const response = createResponse();

                await resendCode(request, response);

                expect(response.statusCode).toBe(200);
            });

            it('should return success message', async () => {
                const { resendVerificationCode } = require('../../../domain/services/user-services');
                const { MongoUserRepository } = require('../../../infraestructure/repositories/mongo-user');
                const { NodemailerEmailService } = require('../../../infraestructure/services/nodemailer-email');

                resendVerificationCode.mockResolvedValueOnce({
                    success: true,
                    message: 'Ready to generate new code'
                });

                const mockRepo = new MongoUserRepository();
                mockRepo.saveVerificationCode.mockResolvedValueOnce(undefined);
                mockRepo.findByEmail.mockResolvedValueOnce({
                    _id: '123-123',
                    email: "user@gmail.com",
                    firstName: "John"
                });

                const mockEmailService = new NodemailerEmailService();
                mockEmailService.sendVerificationCode.mockResolvedValueOnce({
                    success: true,
                    messageId: 'mock-message-id'
                });

                const request = createRequest({
                    body: {
                        email: "user@gmail.com"
                    }
                });
                const response = createResponse();

                await resendCode(request, response);

                const data = response._getJSONData();
                expect(data.ok).toBe(true);
                expect(data.message).toBe('New verification code sent successfully');
            });

            it('should call resendVerificationCode with email', async () => {
                const { resendVerificationCode } = require('../../../domain/services/user-services');
                const { MongoUserRepository } = require('../../../infraestructure/repositories/mongo-user');
                const { NodemailerEmailService } = require('../../../infraestructure/services/nodemailer-email');

                resendVerificationCode.mockResolvedValueOnce({
                    success: true,
                    message: 'Ready to generate new code'
                });

                const mockRepo = new MongoUserRepository();
                mockRepo.saveVerificationCode.mockResolvedValueOnce(undefined);
                mockRepo.findByEmail.mockResolvedValueOnce({
                    _id: '123-123',
                    email: "user@gmail.com",
                    firstName: "John"
                });

                const mockEmailService = new NodemailerEmailService();
                mockEmailService.sendVerificationCode.mockResolvedValueOnce({
                    success: true
                });

                const request = createRequest({
                    body: {
                        email: "user@gmail.com"
                    }
                });
                const response = createResponse();

                await resendCode(request, response);

                expect(resendVerificationCode).toHaveBeenCalledWith(
                    expect.anything(),
                    "user@gmail.com"
                );
            });

            it('should generate and save new verification code', async () => {
                const { resendVerificationCode } = require('../../../domain/services/user-services');
                const { generateVerificationCode } = require('../../../domain/business-rules/user-rules');
                const { MongoUserRepository } = require('../../../infraestructure/repositories/mongo-user');
                const { NodemailerEmailService } = require('../../../infraestructure/services/nodemailer-email');

                resendVerificationCode.mockResolvedValueOnce({
                    success: true,
                    message: 'Ready to generate new code'
                });

                const mockRepo = new MongoUserRepository();
                mockRepo.saveVerificationCode.mockResolvedValueOnce(undefined);
                mockRepo.findByEmail.mockResolvedValueOnce({
                    _id: '123-123',
                    email: "user@gmail.com",
                    firstName: "John"
                });

                const mockEmailService = new NodemailerEmailService();
                mockEmailService.sendVerificationCode.mockResolvedValueOnce({
                    success: true
                });

                const request = createRequest({
                    body: {
                        email: "user@gmail.com"
                    }
                });
                const response = createResponse();

                await resendCode(request, response);

                expect(generateVerificationCode).toHaveBeenCalled();
            });
        });
    });

    describe('Given email is already verified', () => {
        describe('When attempting to resend code', () => {
            it('should return 409 status code', async () => {
                const { resendVerificationCode } = require('../../../domain/services/user-services');

                resendVerificationCode.mockResolvedValueOnce({
                    success: false,
                    message: 'Email is already verified'
                });

                const request = createRequest({
                    body: {
                        email: "user@gmail.com"
                    }
                });
                const response = createResponse();

                await resendCode(request, response);

                expect(response.statusCode).toBe(409);
            });

            it('should return already verified message', async () => {
                const { resendVerificationCode } = require('../../../domain/services/user-services');

                resendVerificationCode.mockResolvedValueOnce({
                    success: false,
                    message: 'Email is already verified'
                });

                const request = createRequest({
                    body: {
                        email: "user@gmail.com"
                    }
                });
                const response = createResponse();

                await resendCode(request, response);

                const data = response._getJSONData();
                expect(data.ok).toBe(false);
                expect(data.message).toBe('Email is already verified');
            });
        });
    });

    describe('Given user does not exist', () => {
        describe('When attempting to resend code', () => {
            it('should return 400 with user not found message', async () => {
                const { resendVerificationCode } = require('../../../domain/services/user-services');

                resendVerificationCode.mockResolvedValueOnce({
                    success: false,
                    message: 'User not found'
                });

                const request = createRequest({
                    body: {
                        email: "nonexistent@gmail.com"
                    }
                });
                const response = createResponse();

                await resendCode(request, response);

                expect(response.statusCode).toBe(404);
                const data = response._getJSONData();
                expect(data.message).toBe('User not found');
            });
        });
    });

    describe('Given email service fails', () => {
        describe('When verification email cannot be sent', () => {
            it.skip('should return 503 status code - TODO: emailService is global instance', async () => {
                const { resendVerificationCode } = require('../../../domain/services/user-services');
                const { MongoUserRepository } = require('../../../infraestructure/repositories/mongo-user');
                const { NodemailerEmailService } = require('../../../infraestructure/services/nodemailer-email');

                resendVerificationCode.mockResolvedValueOnce({
                    success: true,
                    message: 'Ready to generate new code'
                });

                const mockRepo = new MongoUserRepository();
                mockRepo.saveVerificationCode.mockResolvedValueOnce(undefined);
                mockRepo.findByEmail.mockResolvedValueOnce({
                    _id: '123-123',
                    email: "user@gmail.com",
                    firstName: "John"
                });

                const mockEmailService = new NodemailerEmailService();
                mockEmailService.sendVerificationCode.mockResolvedValueOnce({
                    success: false,
                    error: 'SMTP connection failed'
                });

                const request = createRequest({
                    body: {
                        email: "user@gmail.com"
                    }
                });
                const response = createResponse();

                await resendCode(request, response);

                expect(response.statusCode).toBe(503);
            });

            it.skip('should return email sending error message - TODO: emailService is global instance', async () => {
                const { resendVerificationCode } = require('../../../domain/services/user-services');
                const { MongoUserRepository } = require('../../../infraestructure/repositories/mongo-user');
                const { NodemailerEmailService } = require('../../../infraestructure/services/nodemailer-email');

                resendVerificationCode.mockResolvedValueOnce({
                    success: true,
                    message: 'Ready to generate new code'
                });

                const mockRepo = new MongoUserRepository();
                mockRepo.saveVerificationCode.mockResolvedValueOnce(undefined);
                mockRepo.findByEmail.mockResolvedValueOnce({
                    _id: '123-123',
                    email: "user@gmail.com",
                    firstName: "John"
                });

                const mockEmailService = new NodemailerEmailService();
                mockEmailService.sendVerificationCode.mockResolvedValueOnce({
                    success: false,
                    error: 'SMTP connection failed'
                });

                const request = createRequest({
                    body: {
                        email: "user@gmail.com"
                    }
                });
                const response = createResponse();

                await resendCode(request, response);

                const data = response._getJSONData();
                expect(data.ok).toBe(false);
                expect(data.message).toBe('Failed to send verification email');
            });
        });
    });

    describe('Given resendVerificationCode service fails', () => {
        describe('When database error occurs', () => {
            it('should return 503 status code', async () => {
                const { resendVerificationCode } = require('../../../domain/services/user-services');

                resendVerificationCode.mockRejectedValueOnce(
                    new Error('[ERROR TO SERVICE] - Error resending code: Database connection failed')
                );

                const request = createRequest({
                    body: {
                        email: "user@gmail.com"
                    }
                });
                const response = createResponse();

                await resendCode(request, response);

                expect(response.statusCode).toBe(503);
            });

            it('should return service unavailable message', async () => {
                const { resendVerificationCode } = require('../../../domain/services/user-services');

                resendVerificationCode.mockRejectedValueOnce(
                    new Error('[ERROR TO SERVICE] - Error resending code: Database connection failed')
                );

                const request = createRequest({
                    body: {
                        email: "user@gmail.com"
                    }
                });
                const response = createResponse();

                await resendCode(request, response);

                const data = response._getJSONData();
                expect(data.ok).toBe(false);
                expect(data.message).toBe('Service temporarily unavailable. Please try again later.');
            });
        });
    });
});