import { createRequest, createResponse } from 'node-mocks-http';
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from '../../../application/controllers/products-controllers';

jest.mock('../../../domain/services/product-services', () => ({
    saveProduct: jest.fn(),
    findProducts: jest.fn(),
    findProductById: jest.fn(),
    updateProductById: jest.fn(),
    deleteProductById: jest.fn()
}));

jest.mock('../../../infraestructure/repositories/mongo-products', () => ({
    MongoProductRepository: jest.fn().mockImplementation(() => ({}))
}));

describe('Products Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createProduct', () => {
        it('should create product successfully', async () => {
            const { saveProduct } = require('../../../domain/services/product-services');
            const mockProduct = { _id: '123', name: 'Test Product', price: 100 };
            saveProduct.mockResolvedValue(mockProduct);

            const request = createRequest({
                body: { name: 'Test Product', price: 100, categoryId: 'cat1' }
            });
            const response = createResponse();

            await createProduct(request, response);

            expect(response.statusCode).toBe(201);
            const data = response._getJSONData();
            expect(data.ok).toBe(true);
            expect(data.product).toEqual(mockProduct);
        });

        it('should return 500 on service error', async () => {
            const { saveProduct } = require('../../../domain/services/product-services');
            saveProduct.mockRejectedValue(new Error('Service error'));

            const request = createRequest({
                body: { name: 'Test Product' }
            });
            const response = createResponse();

            await createProduct(request, response);

            expect(response.statusCode).toBe(500);
        });
    });

    describe('getProducts', () => {
        it('should return all products', async () => {
            const { findProducts } = require('../../../domain/services/product-services');
            const mockProducts = [{ _id: '1', name: 'Product 1' }, { _id: '2', name: 'Product 2' }];
            findProducts.mockResolvedValue(mockProducts);

            const request = createRequest();
            const response = createResponse();

            await getProducts(request, response);

            expect(response.statusCode).toBe(200);
            const data = response._getJSONData();
            expect(data.products).toEqual(mockProducts);
        });

        it('should return 500 on service error', async () => {
            const { findProducts } = require('../../../domain/services/product-services');
            findProducts.mockRejectedValue(new Error('Service error'));

            const request = createRequest();
            const response = createResponse();

            await getProducts(request, response);

            expect(response.statusCode).toBe(500);
        });
    });

    describe('getProductById', () => {
        it('should return product by id', async () => {
            const { findProductById } = require('../../../domain/services/product-services');
            const mockProduct = { _id: '123', name: 'Test Product' };
            findProductById.mockResolvedValue(mockProduct);

            const request = createRequest({
                params: { id: '123' }
            });
            const response = createResponse();

            await getProductById(request, response);

            expect(response.statusCode).toBe(200);
            const data = response._getJSONData();
            expect(data.product).toEqual(mockProduct);
        });
    });

    describe('updateProduct', () => {
        it('should update product successfully', async () => {
            const { updateProductById } = require('../../../domain/services/product-services');
            const mockUpdatedProduct = { _id: '123', name: 'Updated Product' };
            updateProductById.mockResolvedValue(mockUpdatedProduct);

            const request = createRequest({
                params: { id: '123' },
                body: { name: 'Updated Product' }
            });
            const response = createResponse();

            await updateProduct(request, response);

            expect(response.statusCode).toBe(200);
            const data = response._getJSONData();
            expect(data.product).toEqual(mockUpdatedProduct);
        });
    });

    describe('deleteProduct', () => {
        it('should delete product successfully', async () => {
            const { deleteProductById } = require('../../../domain/services/product-services');
            deleteProductById.mockResolvedValue(undefined);

            const request = createRequest({
                params: { id: '123' }
            });
            const response = createResponse();

            await deleteProduct(request, response);

            expect(response.statusCode).toBe(200);
            const data = response._getJSONData();
            expect(data.ok).toBe(true);
            expect(data.message).toBe('Product deleted successfully');
        });
    });
});