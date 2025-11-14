import { Request, Response, NextFunction } from 'express';
import { validateLogin, validateRegister } from '../../../application/middlewares/auth-validators';
import { buildErrorResponse } from '../../../application/dtos/auth-dtos';

jest.mock('../../../application/dtos/auth-dtos');

const mockBuildErrorResponse = buildErrorResponse as jest.MockedFunction<typeof buildErrorResponse>;

describe('Auth Validators', () => {
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
        mockBuildErrorResponse.mockReturnValue({ type: 'ValidationError', msg: 'Validation failed' });
    });

    describe('validateLogin', () => {
        it('should return 422 when email is missing', () => {
            mockRequest.body = { password: 'password123' };

            validateLogin(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 422 when password is missing', () => {
            mockRequest.body = { email: 'test@example.com' };

            validateLogin(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 422 when email format is invalid', () => {
            mockRequest.body = { email: 'invalid-email', password: 'password123' };

            validateLogin(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 422 when password is too short', () => {
            mockRequest.body = { email: 'test@example.com', password: '123' };

            validateLogin(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should call next when validation passes', () => {
            mockRequest.body = { email: 'test@example.com', password: 'password123' };

            validateLogin(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });
    });

    describe('validateRegister', () => {
        const validData = {
            email: 'test@example.com',
            password: 'Password123!',
            name: 'John Doe',
            phone: '1234567890'
        };

        it('should return 422 when email is missing', () => {
            mockRequest.body = { ...validData, email: undefined };

            validateRegister(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 422 when password is missing', () => {
            mockRequest.body = { ...validData, password: undefined };

            validateRegister(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 422 when name is missing', () => {
            mockRequest.body = { ...validData, name: undefined };

            validateRegister(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 422 when phone is missing', () => {
            mockRequest.body = { ...validData, phone: undefined };

            validateRegister(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 422 when email format is invalid', () => {
            mockRequest.body = { ...validData, email: 'invalid-email' };

            validateRegister(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 422 when password does not meet requirements', () => {
            mockRequest.body = { ...validData, password: 'weak' };

            validateRegister(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 422 when name is too short', () => {
            mockRequest.body = { ...validData, name: 'A' };

            validateRegister(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 422 when phone format is invalid', () => {
            mockRequest.body = { ...validData, phone: '123' };

            validateRegister(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should call next when all validations pass', () => {
            mockRequest.body = validData;

            validateRegister(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });
    });
});