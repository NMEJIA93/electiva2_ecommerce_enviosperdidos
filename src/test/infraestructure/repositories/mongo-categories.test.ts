import { MongoCategoriesRepository } from '../../../infraestructure/repositories/mongo-categories';
import { Categories } from '../../../domain/entities/Categories';

jest.mock('../../../infraestructure/database/categories-mongo', () => ({
    CategoriesModel: {
        create: jest.fn(),
        find: jest.fn().mockReturnValue({
            exec: jest.fn()
        }),
        findById: jest.fn().mockReturnValue({
            exec: jest.fn()
        }),
        findByIdAndUpdate: jest.fn().mockReturnValue({
            exec: jest.fn()
        }),
        findByIdAndDelete: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue({})
        })
    }
}));

jest.mock('../../../infraestructure/database/Product-mongo', () => ({
    ProductModel: {
        findOne: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(null)
        }),
        exists: jest.fn().mockResolvedValue(null)
    }
}));

describe('MongoCategoriesRepository', () => {
    let repository: MongoCategoriesRepository;

    beforeEach(() => {
        repository = new MongoCategoriesRepository();
        jest.clearAllMocks();
    });

    describe('save', () => {
        it('should save category', async () => {
            const category = new Categories({ id: '507f1f77bcf86cd799439011', name: 'Electronics' });
            const mockSaved = { 
                _id: '507f1f77bcf86cd799439011', 
                name: 'Electronics',
                toObject: () => ({ _id: '507f1f77bcf86cd799439011', name: 'Electronics' })
            };
            
            const { CategoriesModel } = require('../../../infraestructure/database/categories-mongo');
            CategoriesModel.create.mockResolvedValue(mockSaved);
            
            const result = await repository.save(category);
            
            expect(CategoriesModel.create).toHaveBeenCalled();
            expect(result).toBeInstanceOf(Categories);
        });
    });

    describe('findAll', () => {
        it('should find all categories', async () => {
            const mockCategories = [{ 
                _id: '1', 
                name: 'Electronics',
                toObject: () => ({ _id: '1', name: 'Electronics' })
            }];
            
            const { CategoriesModel } = require('../../../infraestructure/database/categories-mongo');
            CategoriesModel.find().exec.mockResolvedValue(mockCategories);
            
            const result = await repository.findAll();
            
            expect(CategoriesModel.find).toHaveBeenCalled();
            expect(result).toHaveLength(1);
        });
    });

    describe('findById', () => {
        it('should find category by id', async () => {
            const mockCategory = { 
                _id: '1', 
                name: 'Electronics',
                toObject: () => ({ _id: '1', name: 'Electronics' })
            };
            
            const { CategoriesModel } = require('../../../infraestructure/database/categories-mongo');
            CategoriesModel.findById().exec.mockResolvedValue(mockCategory);
            
            const result = await repository.findById('1');
            
            expect(CategoriesModel.findById).toHaveBeenCalledWith('1');
            expect(result).toBeInstanceOf(Categories);
        });
    });

    describe('update', () => {
        it('should update category', async () => {
            const category = new Categories({ id: '1', name: 'Updated' });
            const mockUpdated = { 
                _id: '1', 
                name: 'Updated',
                toObject: () => ({ _id: '1', name: 'Updated' })
            };
            
            const { CategoriesModel } = require('../../../infraestructure/database/categories-mongo');
            CategoriesModel.findByIdAndUpdate().exec.mockResolvedValue(mockUpdated);
            
            const result = await repository.update(category);
            
            expect(CategoriesModel.findByIdAndUpdate).toHaveBeenCalledWith('1', category, { new: true });
            expect(result).toBeInstanceOf(Categories);
        });
    });

    describe('delete', () => {
        it('should delete category', async () => {
            const { CategoriesModel } = require('../../../infraestructure/database/categories-mongo');
            CategoriesModel.findByIdAndDelete().exec.mockResolvedValue({});
            
            await repository.delete('507f1f77bcf86cd799439011');
            
            expect(CategoriesModel.findByIdAndDelete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
        });
    });
});