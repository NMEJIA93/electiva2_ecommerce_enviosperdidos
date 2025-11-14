import { Request, Response, NextFunction } from 'express';
import { authenticateToken, authorizeRole, authorizeProfileAccess, authorizeUserAccess, authorizePreorderConfirmation } from '../../../application/middlewares/auth-middleware';
import { verifyToken } from '../../../domain/services/auth-services';
import { buildErrorResponse } from '../../../application/dtos/auth-dtos';

jest.mock('../../../domain/services/auth-services');
jest.mock('../../../application/dtos/auth-dtos');

const mockVerifyToken = verifyToken as jest.MockedFunction<typeof verifyToken>;
const mockBuildErrorResponse = buildErrorResponse as jest.MockedFunction<typeof buildErrorResponse>;

describe('Auth Middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        mockNext = jest.fn();
        jest.clearAllMocks();
    });

    describe('authenticateToken', () => {
        it('should return 401 when no token provided', () => {
            mockRequest.headers = {};

            authenticateToken(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 403 when token is invalid', () => {
            mockRequest.headers = { authorization: 'Bearer invalid-token' };
            mockVerifyToken.mockImplementation(() => {
                throw new Error('Invalid token');
            });

            authenticateToken(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(403);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should call next when token is valid', () => {
            const mockUser = { id: '123', roleId: 'user' };
            mockRequest.headers = { authorization: 'Bearer valid-token' };
            mockVerifyToken.mockReturnValue(mockUser);

            authenticateToken(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockRequest.user).toBe(mockUser);
            expect(mockNext).toHaveBeenCalled();
        });
    });

    describe('authorizeRole', () => {
        it('should return 403 when user has wrong role', () => {
            mockRequest.user = { roleId: 'user' };
            const middleware = authorizeRole(['admin']);

            middleware(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(403);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should call next when user has correct role', () => {
            mockRequest.user = { roleId: 'admin' };
            const middleware = authorizeRole(['admin']);

            middleware(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });
    });

    describe('authorizeProfileAccess', () => {
        it('should return 403 when user IDs do not match', () => {
            mockRequest.user = { id: '123' };
            mockRequest.params = { id: '456' };

            authorizeProfileAccess(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(403);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should call next when user IDs match', () => {
            mockRequest.user = { id: '123' };
            mockRequest.params = { id: '123' };

            authorizeProfileAccess(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });
    });

    describe('authorizeUserAccess', () => {
        it('should return 401 when no user in token', () => {
            mockRequest.params = { userId: '123' };

            authorizeUserAccess(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 400 when no userId in params', () => {
            mockRequest.user = { id: '123' };
            mockRequest.params = {};

            authorizeUserAccess(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should call next when user is admin', () => {
            mockRequest.user = { id: '123', roleId: 'admin' };
            mockRequest.params = { userId: '456' };

            authorizeUserAccess(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });

        it('should call next when user IDs match', () => {
            mockRequest.user = { id: '123', roleId: 'user' };
            mockRequest.params = { userId: '123' };

            authorizeUserAccess(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });
    });

    describe('authorizePreorderConfirmation', () => {
        it('should return 401 when no user in token', () => {
            mockRequest.params = { userId: '123', preorderId: '456' };

            authorizePreorderConfirmation(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 400 when no userId in params', () => {
            mockRequest.user = { id: '123' };
            mockRequest.params = { preorderId: '456' };

            authorizePreorderConfirmation(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 400 when no preorderId in params', () => {
            mockRequest.user = { id: '123' };
            mockRequest.params = { userId: '123' };

            authorizePreorderConfirmation(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 403 when user IDs do not match', () => {
            mockRequest.user = { id: '123' };
            mockRequest.params = { userId: '456', preorderId: '789' };

            authorizePreorderConfirmation(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(403);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should call next when user IDs match', () => {
            mockRequest.user = { id: '123' };
            mockRequest.params = { userId: '123', preorderId: '456' };

            authorizePreorderConfirmation(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });
    });
});