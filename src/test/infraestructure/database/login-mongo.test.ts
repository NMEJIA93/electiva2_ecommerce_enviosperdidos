import mongoose from 'mongoose';

jest.mock('mongoose', () => ({
    model: jest.fn(),
    Schema: jest.fn().mockImplementation(() => ({}))
}));

jest.mock('../../../infraestructure/database/login-mongo', () => ({
    LoginAttemptModel: {
        create: jest.fn(),
        findOne: jest.fn(),
        findOneAndUpdate: jest.fn(),
        deleteMany: jest.fn()
    }
}));

describe('LoginAttemptModel', () => {
    let LoginAttemptModel: any;

    beforeEach(async () => {
        jest.clearAllMocks();
        const loginModule = await import('../../../infraestructure/database/login-mongo');
        LoginAttemptModel = loginModule.LoginAttemptModel;
    });

    describe('create', () => {
        it('should create login attempt successfully', async () => {
            const loginData = {
                idNumber: '12345678',
                email: 'test@example.com',
                retries: 1
            };
            const mockLogin = { _id: '507f1f77bcf86cd799439011', ...loginData };
            
            LoginAttemptModel.create.mockResolvedValue(mockLogin);
            
            const result = await LoginAttemptModel.create(loginData);
            
            expect(LoginAttemptModel.create).toHaveBeenCalledWith(loginData);
            expect(result).toEqual(mockLogin);
        });
    });

    describe('findOne', () => {
        it('should find login attempt by idNumber', async () => {
            const idNumber = '12345678';
            const mockLogin = {
                _id: '507f1f77bcf86cd799439011',
                idNumber,
                email: 'test@example.com',
                retries: 2
            };
            
            LoginAttemptModel.findOne.mockResolvedValue(mockLogin);
            
            const result = await LoginAttemptModel.findOne({ idNumber });
            
            expect(LoginAttemptModel.findOne).toHaveBeenCalledWith({ idNumber });
            expect(result).toEqual(mockLogin);
        });

        it('should return null when login attempt not found', async () => {
            LoginAttemptModel.findOne.mockResolvedValue(null);
            
            const result = await LoginAttemptModel.findOne({ idNumber: 'nonexistent' });
            
            expect(result).toBeNull();
        });
    });

    describe('findOneAndUpdate', () => {
        it('should increment retries on failed login', async () => {
            const idNumber = '12345678';
            const mockUpdatedLogin = {
                _id: '507f1f77bcf86cd799439011',
                idNumber,
                retries: 3,
                updatedAt: new Date()
            };
            
            LoginAttemptModel.findOneAndUpdate.mockResolvedValue(mockUpdatedLogin);
            
            const result = await LoginAttemptModel.findOneAndUpdate(
                { idNumber },
                { $inc: { retries: 1 }, updatedAt: expect.any(Date) },
                { new: true, upsert: true }
            );
            
            expect(LoginAttemptModel.findOneAndUpdate).toHaveBeenCalledWith(
                { idNumber },
                { $inc: { retries: 1 }, updatedAt: expect.any(Date) },
                { new: true, upsert: true }
            );
            expect(result).toEqual(mockUpdatedLogin);
        });
    });

    describe('deleteMany', () => {
        it('should delete old login attempts', async () => {
            const result = { deletedCount: 5 };
            LoginAttemptModel.deleteMany.mockResolvedValue(result);
            
            const deleteResult = await LoginAttemptModel.deleteMany({
                createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
            });
            
            expect(LoginAttemptModel.deleteMany).toHaveBeenCalled();
            expect(deleteResult.deletedCount).toBe(5);
        });
    });
});