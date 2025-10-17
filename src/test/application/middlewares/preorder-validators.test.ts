import { Request, Response, NextFunction } from 'express';
import { usePreOrderValidation } from '../../../application/middlewares/preorder-validators';

describe('Preorder Validators', () => {
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

    const validProduct = {
        productId: 'prod123',
        name: 'Test Product',
        quantity: 2,
        price: 100,
        categoryId: 'cat123'
    };

    const validShippingAddress = {
        country: 'Colombia',
        state: 'Cundinamarca',
        city: 'Bogotá',
        neighborhood: 'Centro',
        address: 'Calle 123',
        postalCode: '110111'
    };

    describe('usePreOrderValidation', () => {
        it('should return 400 when products is missing', () => {
            mockRequest.body = { shippingAddress: validShippingAddress, paymentMethod: 'credit_card' };

            usePreOrderValidation(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                ok: false,
                message: 'Products are required and must be a non-empty array.'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 400 when products is empty array', () => {
            mockRequest.body = { products: [], shippingAddress: validShippingAddress, paymentMethod: 'credit_card' };

            usePreOrderValidation(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 400 when product has invalid productId', () => {
            const invalidProduct = { ...validProduct, productId: 123 };
            mockRequest.body = { products: [invalidProduct], shippingAddress: validShippingAddress, paymentMethod: 'credit_card' };

            usePreOrderValidation(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                ok: false,
                message: 'Each product must have a valid productId.'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 400 when product has invalid name', () => {
            const invalidProduct = { ...validProduct, name: 123 };
            mockRequest.body = { products: [invalidProduct], shippingAddress: validShippingAddress, paymentMethod: 'credit_card' };

            usePreOrderValidation(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                ok: false,
                message: 'Each product must have a valid name.'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 400 when product has invalid quantity', () => {
            const invalidProduct = { ...validProduct, quantity: 0 };
            mockRequest.body = { products: [invalidProduct], shippingAddress: validShippingAddress, paymentMethod: 'credit_card' };

            usePreOrderValidation(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                ok: false,
                message: 'Each product must have a quantity greater than 0.'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 400 when product has invalid price', () => {
            const invalidProduct = { ...validProduct, price: -10 };
            mockRequest.body = { products: [invalidProduct], shippingAddress: validShippingAddress, paymentMethod: 'credit_card' };

            usePreOrderValidation(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                ok: false,
                message: 'Each product must have a valid price.'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 400 when product has invalid categoryId', () => {
            const invalidProduct = { ...validProduct, categoryId: 123 };
            mockRequest.body = { products: [invalidProduct], shippingAddress: validShippingAddress, paymentMethod: 'credit_card' };

            usePreOrderValidation(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                ok: false,
                message: 'Each product must have a valid categoryId.'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 400 when shippingAddress is missing', () => {
            mockRequest.body = { products: [validProduct], paymentMethod: 'credit_card' };

            usePreOrderValidation(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                ok: false,
                message: 'Valid shipping address is required.'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 400 when shippingAddress field is missing', () => {
            const invalidAddress = { ...validShippingAddress, country: undefined };
            mockRequest.body = { products: [validProduct], shippingAddress: invalidAddress, paymentMethod: 'credit_card' };

            usePreOrderValidation(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                ok: false,
                message: "Shipping address field 'country' is required and must be a string."
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 400 when paymentMethod is missing', () => {
            mockRequest.body = { products: [validProduct], shippingAddress: validShippingAddress };

            usePreOrderValidation(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                ok: false,
                message: 'Valid payment method is required.'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should call next when all validations pass', () => {
            mockRequest.body = {
                products: [validProduct],
                shippingAddress: validShippingAddress,
                paymentMethod: 'credit_card'
            };

            usePreOrderValidation(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });
    });
});