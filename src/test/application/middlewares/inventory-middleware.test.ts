import { Request, Response } from 'express';
import { validateInventory } from '../../../application/middlewares/inventory-middleware';

describe('Inventory Middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;

    beforeEach(() => {
        mockRequest = { body: {} };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        mockNext = jest.fn();
        jest.clearAllMocks();
    });

    describe('validateInventory', () => {
        it('should return 422 when price is not a number', () => {
            mockRequest.body = { price: 'invalid' };

            validateInventory(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockResponse.json).toHaveBeenCalledWith({
                ok: false,
                error: 'The price must be a number greater than 0'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 422 when price is zero or negative', () => {
            mockRequest.body = { price: 0 };

            validateInventory(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockResponse.json).toHaveBeenCalledWith({
                ok: false,
                error: 'The price must be a number greater than 0'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 422 when stock is not an integer', () => {
            mockRequest.body = { stock: 1.5 };

            validateInventory(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockResponse.json).toHaveBeenCalledWith({
                ok: false,
                error: 'The stock must be an integer greater or equal to 0'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 422 when stock is negative', () => {
            mockRequest.body = { stock: -1 };

            validateInventory(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockResponse.json).toHaveBeenCalledWith({
                ok: false,
                error: 'The stock must be an integer greater or equal to 0'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should call next when price is valid', () => {
            mockRequest.body = { price: 100 };

            validateInventory(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });

        it('should call next when stock is valid', () => {
            mockRequest.body = { stock: 10 };

            validateInventory(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });

        it('should call next when both price and stock are valid', () => {
            mockRequest.body = { price: 100, stock: 10 };

            validateInventory(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });

        it('should call next when no validation fields are provided', () => {
            mockRequest.body = {};

            validateInventory(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });

        it('should call next when stock is zero', () => {
            mockRequest.body = { stock: 0 };

            validateInventory(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });
    });
});