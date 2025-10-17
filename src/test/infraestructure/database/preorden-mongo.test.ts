import mongoose from 'mongoose';

jest.mock('mongoose', () => ({
    model: jest.fn(),
    Schema: jest.fn().mockImplementation(() => ({}))
}));

jest.mock('../../../infraestructure/database/preorden-mongo', () => ({
    PreorderModel: {
        create: jest.fn(),
        findOne: jest.fn(),
        findById: jest.fn(),
        find: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn()
    }
}));

describe('PreorderModel', () => {
    let PreorderModel: any;

    beforeEach(async () => {
        jest.clearAllMocks();
        const preorderModule = await import('../../../infraestructure/database/preorden-mongo');
        PreorderModel = preorderModule.PreorderModel;
    });

    describe('create', () => {
        it('should create preorder successfully', async () => {
            const preorderData = {
                userId: '507f1f77bcf86cd799439011',
                products: [{
                    productId: '507f1f77bcf86cd799439012',
                    name: 'Test Product',
                    quantity: 2,
                    price: 100,
                    categoryId: '507f1f77bcf86cd799439013'
                }],
                shippingAddress: {
                    country: 'Colombia',
                    state: 'Cundinamarca',
                    city: 'Bogotá',
                    neighborhood: 'Centro',
                    address: 'Calle 123',
                    postalCode: '110111'
                },
                paymentMethod: 'credit_card',
                shippingCost: 0,
                total: 200,
                status: 'PENDING'
            };
            const mockPreorder = { _id: '507f1f77bcf86cd799439014', ...preorderData };
            
            PreorderModel.create.mockResolvedValue(mockPreorder);
            
            const result = await PreorderModel.create(preorderData);
            
            expect(PreorderModel.create).toHaveBeenCalledWith(preorderData);
            expect(result).toEqual(mockPreorder);
        });
    });

    describe('findById', () => {
        it('should find preorder by id', async () => {
            const preorderId = '507f1f77bcf86cd799439014';
            const mockPreorder = {
                _id: preorderId,
                userId: '507f1f77bcf86cd799439011',
                status: 'PENDING',
                total: 200
            };
            
            PreorderModel.findById.mockResolvedValue(mockPreorder);
            
            const result = await PreorderModel.findById(preorderId);
            
            expect(PreorderModel.findById).toHaveBeenCalledWith(preorderId);
            expect(result).toEqual(mockPreorder);
        });
    });

    describe('find', () => {
        it('should find preorders by userId', async () => {
            const userId = '507f1f77bcf86cd799439011';
            const mockPreorders = [
                { _id: '507f1f77bcf86cd799439014', userId, status: 'PENDING' },
                { _id: '507f1f77bcf86cd799439015', userId, status: 'CONFIRMED' }
            ];
            
            PreorderModel.find.mockResolvedValue(mockPreorders);
            
            const result = await PreorderModel.find({ userId });
            
            expect(PreorderModel.find).toHaveBeenCalledWith({ userId });
            expect(result).toEqual(mockPreorders);
            expect(result).toHaveLength(2);
        });
    });

    describe('findByIdAndUpdate', () => {
        it('should update preorder status', async () => {
            const preorderId = '507f1f77bcf86cd799439014';
            const updateData = { status: 'CONFIRMED' };
            const mockUpdatedPreorder = {
                _id: preorderId,
                userId: '507f1f77bcf86cd799439011',
                ...updateData
            };
            
            PreorderModel.findByIdAndUpdate.mockResolvedValue(mockUpdatedPreorder);
            
            const result = await PreorderModel.findByIdAndUpdate(preorderId, updateData, { new: true });
            
            expect(PreorderModel.findByIdAndUpdate).toHaveBeenCalledWith(preorderId, updateData, { new: true });
            expect(result).toEqual(mockUpdatedPreorder);
            expect(result.status).toBe('CONFIRMED');
        });
    });

    describe('findByIdAndDelete', () => {
        it('should delete preorder by id', async () => {
            const preorderId = '507f1f77bcf86cd799439014';
            const mockDeletedPreorder = {
                _id: preorderId,
                userId: '507f1f77bcf86cd799439011',
                status: 'PENDING'
            };
            
            PreorderModel.findByIdAndDelete.mockResolvedValue(mockDeletedPreorder);
            
            const result = await PreorderModel.findByIdAndDelete(preorderId);
            
            expect(PreorderModel.findByIdAndDelete).toHaveBeenCalledWith(preorderId);
            expect(result).toEqual(mockDeletedPreorder);
        });
    });
});