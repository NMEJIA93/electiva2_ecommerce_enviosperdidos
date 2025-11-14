import mongoose from 'mongoose';

jest.mock('mongoose', () => ({
    model: jest.fn(),
    Schema: jest.fn().mockImplementation(() => ({}))
}));

jest.mock('../../../infraestructure/database/Product-mongo', () => ({
    ProductModel: {
        create: jest.fn(),
        findOne: jest.fn(),
        findById: jest.fn(),
        find: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        populate: jest.fn(),
        aggregate: jest.fn()
    }
}));

describe('ProductModel', () => {
    let ProductModel: any;

    beforeEach(async () => {
        jest.clearAllMocks();
        const productModule = await import('../../../infraestructure/database/Product-mongo');
        ProductModel = productModule.ProductModel;
    });

    describe('create', () => {
        it('should create product successfully', async () => {
            const productData = {
                name: 'Test Product',
                description: 'Test Description',
                cost: 100,
                categoryId: '507f1f77bcf86cd799439011',
                providers: ['507f1f77bcf86cd799439012'],
                images: ['image1.jpg'],
                isDiscontinued: false
            };
            const mockProduct = { _id: '507f1f77bcf86cd799439013', ...productData };
            
            ProductModel.create.mockResolvedValue(mockProduct);
            
            const result = await ProductModel.create(productData);
            
            expect(ProductModel.create).toHaveBeenCalledWith(productData);
            expect(result).toEqual(mockProduct);
        });
    });

    describe('findById', () => {
        it('should find product by id with population', async () => {
            const productId = '507f1f77bcf86cd799439013';
            const mockProduct = {
                _id: productId,
                name: 'Test Product',
                categoryId: { _id: '507f1f77bcf86cd799439011', name: 'Electronics' },
                providers: [{ _id: '507f1f77bcf86cd799439012', name: 'Provider 1' }]
            };
            
            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockProduct)
            };
            
            ProductModel.findById.mockReturnValue(mockQuery);
            
            const result = await ProductModel.findById(productId).populate('categoryId').populate('providers').exec();
            
            expect(ProductModel.findById).toHaveBeenCalledWith(productId);
            expect(mockQuery.populate).toHaveBeenCalledWith('categoryId');
            expect(mockQuery.populate).toHaveBeenCalledWith('providers');
            expect(result).toEqual(mockProduct);
        });
    });

    describe('find', () => {
        it('should find active products', async () => {
            const mockProducts = [
                { _id: '507f1f77bcf86cd799439013', name: 'Product 1', isDiscontinued: false },
                { _id: '507f1f77bcf86cd799439014', name: 'Product 2', isDiscontinued: false }
            ];
            
            ProductModel.find.mockResolvedValue(mockProducts);
            
            const result = await ProductModel.find({ isDiscontinued: false });
            
            expect(ProductModel.find).toHaveBeenCalledWith({ isDiscontinued: false });
            expect(result).toEqual(mockProducts);
            expect(result).toHaveLength(2);
        });
    });

    describe('findByIdAndUpdate', () => {
        it('should update product', async () => {
            const productId = '507f1f77bcf86cd799439013';
            const updateData = { name: 'Updated Product', cost: 150 };
            const mockUpdatedProduct = {
                _id: productId,
                ...updateData,
                updatedAt: new Date()
            };
            
            ProductModel.findByIdAndUpdate.mockResolvedValue(mockUpdatedProduct);
            
            const result = await ProductModel.findByIdAndUpdate(productId, updateData, { new: true });
            
            expect(ProductModel.findByIdAndUpdate).toHaveBeenCalledWith(productId, updateData, { new: true });
            expect(result).toEqual(mockUpdatedProduct);
            expect(result.name).toBe('Updated Product');
        });
    });

    describe('aggregate', () => {
        it('should execute aggregation pipeline for product statistics', async () => {
            const pipeline = [
                { $group: { _id: '$categoryId', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ];
            const mockResult = [
                { _id: '507f1f77bcf86cd799439011', count: 5 },
                { _id: '507f1f77bcf86cd799439012', count: 3 }
            ];
            
            ProductModel.aggregate.mockResolvedValue(mockResult);
            
            const result = await ProductModel.aggregate(pipeline);
            
            expect(ProductModel.aggregate).toHaveBeenCalledWith(pipeline);
            expect(result).toEqual(mockResult);
            expect(result).toHaveLength(2);
        });
    });
});