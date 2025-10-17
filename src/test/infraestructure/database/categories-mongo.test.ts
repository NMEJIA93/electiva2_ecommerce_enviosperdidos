import mongoose from 'mongoose';

jest.mock('mongoose', () => ({
    model: jest.fn(),
    Schema: jest.fn().mockImplementation(() => ({}))
}));

jest.mock('../../../infraestructure/database/categories-mongo', () => ({
    CategoriesModel: {
        create: jest.fn(),
        findOne: jest.fn(),
        findById: jest.fn(),
        find: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn()
    }
}));

describe('CategoriesModel', () => {
    let CategoriesModel: any;

    beforeEach(async () => {
        jest.clearAllMocks();
        const categoriesModule = await import('../../../infraestructure/database/categories-mongo');
        CategoriesModel = categoriesModule.CategoriesModel;
    });

    describe('create', () => {
        it('should create category successfully', async () => {
            const categoryData = { name: 'Electronics' };
            const mockCategory = { _id: '507f1f77bcf86cd799439011', ...categoryData };
            
            CategoriesModel.create.mockResolvedValue(mockCategory);
            
            const result = await CategoriesModel.create(categoryData);
            
            expect(CategoriesModel.create).toHaveBeenCalledWith(categoryData);
            expect(result).toEqual(mockCategory);
        });
    });

    describe('findOne', () => {
        it('should find category by name', async () => {
            const mockCategory = { _id: '507f1f77bcf86cd799439011', name: 'Electronics' };
            
            CategoriesModel.findOne.mockResolvedValue(mockCategory);
            
            const result = await CategoriesModel.findOne({ name: 'Electronics' });
            
            expect(CategoriesModel.findOne).toHaveBeenCalledWith({ name: 'Electronics' });
            expect(result).toEqual(mockCategory);
        });
    });

    describe('find', () => {
        it('should find all categories', async () => {
            const mockCategories = [
                { _id: '507f1f77bcf86cd799439011', name: 'Electronics' },
                { _id: '507f1f77bcf86cd799439012', name: 'Clothing' }
            ];
            
            CategoriesModel.find.mockResolvedValue(mockCategories);
            
            const result = await CategoriesModel.find({});
            
            expect(CategoriesModel.find).toHaveBeenCalledWith({});
            expect(result).toEqual(mockCategories);
        });
    });
});