import { Request, Response, NextFunction } from 'express';
import { useParamValidation, validateEmailVerification, validateResendCode } from '../../../application/middlewares/users-validators';
import { UserStatus } from '../../../application/dtos/user-dtos';
import { isValidVerificationCode } from '../../../domain/business-rules/user-rules';

jest.mock('../../../domain/business-rules/user-rules');

const mockIsValidVerificationCode = isValidVerificationCode as jest.MockedFunction<typeof isValidVerificationCode>;

describe('Users Validators', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockRequest = { body: {} };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        mockNext = jest.fn();
        jest.clearAllMocks();
    });

    const validUserData = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        idType: 'CC',
        idNumber: '12345678',
        phone: '1234567890',
        roleId: 'user'
    };

    describe('useParamValidation', () => {
        it('should return 422 when email is missing', () => {
            mockRequest.body = { ...validUserData, email: undefined };

            useParamValidation(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockResponse.json).toHaveBeenCalledWith({
                ok: false,
                error: 'The email field is required'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 422 when email format is invalid', () => {
            mockRequest.body = { ...validUserData, email: 'invalid-email' };

            useParamValidation(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockResponse.json).toHaveBeenCalledWith({
                ok: false,
                error: 'The email format is invalid'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 422 when password is missing', () => {
            mockRequest.body = { ...validUserData, password: undefined };

            useParamValidation(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockResponse.json).toHaveBeenCalledWith({
                ok: false,
                error: 'The password field is required'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 422 when password does not meet requirements', () => {
            mockRequest.body = { ...validUserData, password: 'weak' };

            useParamValidation(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockResponse.json).toHaveBeenCalledWith({
                ok: false,
                error: 'The password must be at least 8 characters and include uppercase, lowercase, numbers, and symbols.'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 422 when firstName is missing', () => {
            mockRequest.body = { ...validUserData, firstName: undefined };

            useParamValidation(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockResponse.json).toHaveBeenCalledWith({
                ok: false,
                error: 'The firstName field is required'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 422 when lastName is missing', () => {
            mockRequest.body = { ...validUserData, lastName: undefined };

            useParamValidation(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockResponse.json).toHaveBeenCalledWith({
                ok: false,
                error: 'The lastName field is required'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 422 when idType is missing', () => {
            mockRequest.body = { ...validUserData, idType: undefined };

            useParamValidation(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockResponse.json).toHaveBeenCalledWith({
                ok: false,
                error: 'The idType field is required'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 422 when idNumber is missing', () => {
            mockRequest.body = { ...validUserData, idNumber: undefined };

            useParamValidation(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockResponse.json).toHaveBeenCalledWith({
                ok: false,
                error: 'The idNumber field is required'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 422 when status is invalid', () => {
            mockRequest.body = { ...validUserData, status: 'INVALID_STATUS' };

            useParamValidation(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockResponse.json).toHaveBeenCalledWith({
                ok: false,
                error: `The status field must be one of: ${Object.values(UserStatus).join(', ')}`
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should set default status to ACTIVE when not provided', () => {
            mockRequest.body = validUserData;

            useParamValidation(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockRequest.body.status).toBe(UserStatus.ACTIVE);
            expect(mockNext).toHaveBeenCalled();
        });

        it('should call next when all validations pass', () => {
            mockRequest.body = { ...validUserData, status: UserStatus.ACTIVE };

            useParamValidation(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });
    });

    describe('validateEmailVerification', () => {
        it('should return 400 when email is missing', () => {
            mockRequest.body = { code: '123456' };

            validateEmailVerification(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                ok: false,
                message: 'Email is required'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 400 when code is missing', () => {
            mockRequest.body = { email: 'test@example.com' };

            validateEmailVerification(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                ok: false,
                message: 'Verification code is required'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 400 when email format is invalid', () => {
            mockRequest.body = { email: 'invalid-email', code: '123456' };

            validateEmailVerification(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                ok: false,
                message: 'Invalid email format'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 400 when code format is invalid', () => {
            mockRequest.body = { email: 'test@example.com', code: '123' };
            mockIsValidVerificationCode.mockReturnValue(false);

            validateEmailVerification(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                ok: false,
                message: 'Invalid code format. Code must be 6 digits'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should call next when all validations pass', () => {
            mockRequest.body = { email: 'test@example.com', code: '123456' };
            mockIsValidVerificationCode.mockReturnValue(true);

            validateEmailVerification(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });
    });

    describe('validateResendCode', () => {
        it('should return 400 when email is missing', () => {
            mockRequest.body = {};

            validateResendCode(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                ok: false,
                message: 'Email is required'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 400 when email format is invalid', () => {
            mockRequest.body = { email: 'invalid-email' };

            validateResendCode(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                ok: false,
                message: 'Invalid email format'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should call next when email is valid', () => {
            mockRequest.body = { email: 'test@example.com' };

            validateResendCode(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });
    });
});