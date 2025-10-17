import { Request, Response, NextFunction } from 'express';
import { validateProduct } from '../../../application/middlewares/product-middleware';

describe('Product Middleware', () => {
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

    describe('validateProduct', () => {
        it('should return 422 when name is too short', () => {
            mockRequest.body = { name: 'ab' };

            validateProduct(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockResponse.json).toHaveBeenCalledWith({
                ok: false,
                error: 'The product name must be a string between 3 and 50 characters'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 422 when name is too long', () => {
            mockRequest.body = { name: 'a'.repeat(51) };

            validateProduct(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 422 when name is not a string', () => {
            mockRequest.body = { name: 123 };

            validateProduct(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 422 when description is too short', () => {
            mockRequest.body = { description: 'short' };

            validateProduct(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockResponse.json).toHaveBeenCalledWith({
                ok: false,
                error: 'The product description must be a string between 10 and 500 characters'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 422 when description is too long', () => {
            mockRequest.body = { description: 'a'.repeat(501) };

            validateProduct(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 422 when cost is negative', () => {
            mockRequest.body = { cost: -10 };

            validateProduct(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockResponse.json).toHaveBeenCalledWith({
                ok: false,
                error: 'The product cost must be a positive number'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 422 when cost is not a number', () => {
            mockRequest.body = { cost: 'invalid' };

            validateProduct(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 422 when stock is negative', () => {
            mockRequest.body = { stock: -5 };

            validateProduct(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockResponse.json).toHaveBeenCalledWith({
                ok: false,
                error: 'The product stock must be a non-negative number'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 422 when stock is not a number', () => {
            mockRequest.body = { stock: 'invalid' };

            validateProduct(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 422 when categoryId is empty string', () => {
            mockRequest.body = { categoryId: '' };

            validateProduct(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockResponse.json).toHaveBeenCalledWith({
                ok: false,
                error: 'The product categoryId must be a non-empty string'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 422 when categoryId is not a string', () => {
            mockRequest.body = { categoryId: 123 };

            validateProduct(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 422 when images is empty array', () => {
            mockRequest.body = { images: [] };

            validateProduct(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockResponse.json).toHaveBeenCalledWith({
                ok: false,
                error: 'The product images must be a non-empty array of strings'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 422 when images contains non-string values', () => {
            mockRequest.body = { images: ['image1.jpg', 123] };

            validateProduct(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should call next when all validations pass', () => {
            mockRequest.body = {
                name: 'Valid Product',
                description: 'This is a valid product description',
                cost: 100,
                stock: 10,
                categoryId: 'cat123',
                images: ['image1.jpg', 'image2.jpg']
            };

            validateProduct(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });

        it('should call next when no fields are provided', () => {
            mockRequest.body = {};

            validateProduct(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });

        it('should call next when cost is zero', () => {
            mockRequest.body = { cost: 0 };

            validateProduct(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });

        it('should call next when stock is zero', () => {
            mockRequest.body = { stock: 0 };

            validateProduct(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });
    });
});