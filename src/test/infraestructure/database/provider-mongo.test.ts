import mongoose from 'mongoose';

jest.mock('mongoose', () => ({
    model: jest.fn(),
    Schema: jest.fn().mockImplementation(() => ({}))
}));

jest.mock('../../../infraestructure/database/provider-mongo', () => ({
    ProviderModel: {
        create: jest.fn(),
        findOne: jest.fn(),
        findById: jest.fn(),
        find: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn()
    }
}));

describe('ProviderModel', () => {
    let ProviderModel: any;

    beforeEach(async () => {
        jest.clearAllMocks();
        const providerModule = await import('../../../infraestructure/database/provider-mongo');
        ProviderModel = providerModule.ProviderModel;
    });

    describe('create', () => {
        it('should create provider successfully', async () => {
            const providerData = { name: 'Test Provider' };
            const mockProvider = { _id: '507f1f77bcf86cd799439011', ...providerData };
            
            ProviderModel.create.mockResolvedValue(mockProvider);
            
            const result = await ProviderModel.create(providerData);
            
            expect(ProviderModel.create).toHaveBeenCalledWith(providerData);
            expect(result).toEqual(mockProvider);
        });
    });

    describe('findOne', () => {
        it('should find provider by name', async () => {
            const name = 'Test Provider';
            const mockProvider = { _id: '507f1f77bcf86cd799439011', name };
            
            ProviderModel.findOne.mockResolvedValue(mockProvider);
            
            const result = await ProviderModel.findOne({ name });
            
            expect(ProviderModel.findOne).toHaveBeenCalledWith({ name });
            expect(result).toEqual(mockProvider);
        });

        it('should return null when provider not found', async () => {
            ProviderModel.findOne.mockResolvedValue(null);
            
            const result = await ProviderModel.findOne({ name: 'Nonexistent Provider' });
            
            expect(result).toBeNull();
        });
    });

    describe('findById', () => {
        it('should find provider by id', async () => {
            const providerId = '507f1f77bcf86cd799439011';
            const mockProvider = { _id: providerId, name: 'Test Provider' };
            
            ProviderModel.findById.mockResolvedValue(mockProvider);
            
            const result = await ProviderModel.findById(providerId);
            
            expect(ProviderModel.findById).toHaveBeenCalledWith(providerId);
            expect(result).toEqual(mockProvider);
        });
    });

    describe('find', () => {
        it('should find all providers', async () => {
            const mockProviders = [
                { _id: '507f1f77bcf86cd799439011', name: 'Provider 1' },
                { _id: '507f1f77bcf86cd799439012', name: 'Provider 2' }
            ];
            
            ProviderModel.find.mockResolvedValue(mockProviders);
            
            const result = await ProviderModel.find({});
            
            expect(ProviderModel.find).toHaveBeenCalledWith({});
            expect(result).toEqual(mockProviders);
            expect(result).toHaveLength(2);
        });
    });

    describe('findByIdAndUpdate', () => {
        it('should update provider', async () => {
            const providerId = '507f1f77bcf86cd799439011';
            const updateData = { name: 'Updated Provider' };
            const mockUpdatedProvider = { _id: providerId, ...updateData };
            
            ProviderModel.findByIdAndUpdate.mockResolvedValue(mockUpdatedProvider);
            
            const result = await ProviderModel.findByIdAndUpdate(providerId, updateData, { new: true });
            
            expect(ProviderModel.findByIdAndUpdate).toHaveBeenCalledWith(providerId, updateData, { new: true });
            expect(result).toEqual(mockUpdatedProvider);
            expect(result.name).toBe('Updated Provider');
        });
    });

    describe('findByIdAndDelete', () => {
        it('should delete provider by id', async () => {
            const providerId = '507f1f77bcf86cd799439011';
            const mockDeletedProvider = { _id: providerId, name: 'Test Provider' };
            
            ProviderModel.findByIdAndDelete.mockResolvedValue(mockDeletedProvider);
            
            const result = await ProviderModel.findByIdAndDelete(providerId);
            
            expect(ProviderModel.findByIdAndDelete).toHaveBeenCalledWith(providerId);
            expect(result).toEqual(mockDeletedProvider);
        });
    });
});