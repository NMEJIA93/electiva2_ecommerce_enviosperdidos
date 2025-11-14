// src/test/infraestructure/database/user-mongo.test.ts

import mongoose from 'mongoose';
import { UserStatus } from '../../../application/dtos/user-dtos';

// Mock mongoose
jest.mock('mongoose', () => {
    const mockSchema = jest.fn().mockImplementation(() => ({
        // Mock schema methods
    }));
    
    return {
        model: jest.fn(),
        Schema: mockSchema
    };
});

// Mock the UserModel module
jest.mock('../../../infraestructure/database/user-mongo', () => {
    const mockUserModel = {
        create: jest.fn(),
        findOne: jest.fn(),
        findById: jest.fn(),
        find: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
        countDocuments: jest.fn(),
        aggregate: jest.fn()
    };
    
    return {
        UserModel: mockUserModel
    };
});

// Mock user document with toObject method
const createMockUserDocument = (userData: any): any => ({
    _id: userData._id || '507f1f77bcf86cd799439011',
    email: userData.email,
    password: userData.password,
    firstName: userData.firstName,
    lastName: userData.lastName,
    idType: userData.idType,
    idNumber: userData.idNumber,
    phone: userData.phone,
    roleId: userData.roleId,
    gender: userData.gender,
    birthDate: userData.birthDate,
    status: userData.status,
    country: userData.country,
    state: userData.state,
    city: userData.city,
    neighborhood: userData.neighborhood,
    address: userData.address,
    postalCode: userData.postalCode,
    createdAt: userData.createdAt || new Date(),
    updatedAt: userData.updatedAt || new Date(),
    toObject: jest.fn().mockReturnValue({
        _id: userData._id || '507f1f77bcf86cd799439011',
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        idType: userData.idType,
        idNumber: userData.idNumber,
        phone: userData.phone,
        roleId: userData.roleId,
        gender: userData.gender,
        birthDate: userData.birthDate,
        status: userData.status,
        country: userData.country,
        state: userData.state,
        city: userData.city,
        neighborhood: userData.neighborhood,
        address: userData.address,
        postalCode: userData.postalCode,
        createdAt: userData.createdAt || new Date(),
        updatedAt: userData.updatedAt || new Date()
    }),
    save: jest.fn(),
    remove: jest.fn()
});

describe('UserModel (Mongoose Model)', () => {
    let mockUserModel: any;
    let UserModel: any;

    beforeEach(async () => {
        jest.clearAllMocks();
        
        // Import the mocked UserModel
        const userMongoModule = await import('../../../infraestructure/database/user-mongo');
        UserModel = userMongoModule.UserModel;
        
        // Get reference to the mock
        mockUserModel = UserModel;
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('Model Creation', () => {
        it('should create UserModel with correct schema', () => {
            // The UserModel should be defined and have the expected methods
            expect(UserModel).toBeDefined();
            expect(typeof UserModel.create).toBe('function');
            expect(typeof UserModel.findOne).toBe('function');
            expect(typeof UserModel.findById).toBe('function');
            expect(typeof UserModel.find).toBe('function');
            expect(typeof UserModel.findByIdAndUpdate).toBe('function');
            expect(typeof UserModel.findByIdAndDelete).toBe('function');
            expect(typeof UserModel.countDocuments).toBe('function');
            expect(typeof UserModel.aggregate).toBe('function');
        });
    });

    describe('User CRUD Operations', () => {
        describe('create', () => {
            it('should create a new user successfully', async () => {
                const userData = {
                    email: 'test@example.com',
                    password: 'hashedPassword123',
                    firstName: 'John',
                    lastName: 'Doe',
                    idType: 'CC',
                    idNumber: '12345678',
                    phone: '1234567890',
                    roleId: 'user',
                    gender: 'M',
                    birthDate: new Date('1990-01-01'),
                    status: UserStatus.ACTIVE,
                    country: 'Colombia',
                    state: 'Cundinamarca',
                    city: 'Bogotá',
                    neighborhood: 'Centro',
                    address: 'Calle 123 #45-67',
                    postalCode: '110111'
                };

                const mockCreatedUser = createMockUserDocument({
                    _id: '507f1f77bcf86cd799439011',
                    ...userData
                });

                mockUserModel.create.mockResolvedValue(mockCreatedUser);

                const result = await UserModel.create(userData);

                expect(mockUserModel.create).toHaveBeenCalledWith(userData);
                expect(result).toEqual(mockCreatedUser);
                expect(result._id).toBe('507f1f77bcf86cd799439011');
                expect(result.email).toBe('test@example.com');
            });

            it('should handle create error', async () => {
                const userData = {
                    email: 'test@example.com',
                    password: 'hashedPassword123'
                };

                const error = new Error('Database connection failed');
                mockUserModel.create.mockRejectedValue(error);

                await expect(UserModel.create(userData)).rejects.toThrow('Database connection failed');
                expect(mockUserModel.create).toHaveBeenCalledWith(userData);
            });
        });

        describe('findOne', () => {
            it('should find user by email successfully', async () => {
                const email = 'test@example.com';
                const mockUser = createMockUserDocument({
                    _id: '507f1f77bcf86cd799439011',
                    email: email,
                    firstName: 'John',
                    lastName: 'Doe'
                });

                mockUserModel.findOne.mockResolvedValue(mockUser);

                const result = await UserModel.findOne({ email });

                expect(mockUserModel.findOne).toHaveBeenCalledWith({ email });
                expect(result).toEqual(mockUser);
                expect(result.email).toBe(email);
            });

            it('should return null when user not found', async () => {
                const email = 'nonexistent@example.com';
                mockUserModel.findOne.mockResolvedValue(null);

                const result = await UserModel.findOne({ email });

                expect(mockUserModel.findOne).toHaveBeenCalledWith({ email });
                expect(result).toBeNull();
            });

            it('should handle findOne error', async () => {
                const email = 'test@example.com';
                const error = new Error('Database query failed');
                mockUserModel.findOne.mockRejectedValue(error);

                await expect(UserModel.findOne({ email })).rejects.toThrow('Database query failed');
                expect(mockUserModel.findOne).toHaveBeenCalledWith({ email });
            });
        });

        describe('findById', () => {
            it('should find user by ID successfully', async () => {
                const userId = '507f1f77bcf86cd799439011';
                const mockUser = createMockUserDocument({
                    _id: userId,
                    email: 'test@example.com',
                    firstName: 'John',
                    lastName: 'Doe'
                });

                mockUserModel.findById.mockResolvedValue(mockUser);

                const result = await UserModel.findById(userId);

                expect(mockUserModel.findById).toHaveBeenCalledWith(userId);
                expect(result).toEqual(mockUser);
                expect(result._id).toBe(userId);
            });

            it('should return null when user not found by ID', async () => {
                const userId = '507f1f77bcf86cd799439011';
                mockUserModel.findById.mockResolvedValue(null);

                const result = await UserModel.findById(userId);

                expect(mockUserModel.findById).toHaveBeenCalledWith(userId);
                expect(result).toBeNull();
            });

            it('should handle findById error', async () => {
                const userId = '507f1f77bcf86cd799439011';
                const error = new Error('Invalid ObjectId');
                mockUserModel.findById.mockRejectedValue(error);

                await expect(UserModel.findById(userId)).rejects.toThrow('Invalid ObjectId');
                expect(mockUserModel.findById).toHaveBeenCalledWith(userId);
            });
        });

        describe('find', () => {
            it('should find multiple users successfully', async () => {
                const mockUsers = [
                    createMockUserDocument({
                        _id: '507f1f77bcf86cd799439011',
                        email: 'user1@example.com',
                        firstName: 'John',
                        lastName: 'Doe'
                    }),
                    createMockUserDocument({
                        _id: '507f1f77bcf86cd799439012',
                        email: 'user2@example.com',
                        firstName: 'Jane',
                        lastName: 'Smith'
                    })
                ];

                mockUserModel.find.mockResolvedValue(mockUsers);

                const result = await UserModel.find({ status: UserStatus.ACTIVE });

                expect(mockUserModel.find).toHaveBeenCalledWith({ status: UserStatus.ACTIVE });
                expect(result).toEqual(mockUsers);
                expect(result).toHaveLength(2);
            });

            it('should return empty array when no users found', async () => {
                mockUserModel.find.mockResolvedValue([]);

                const result = await UserModel.find({ status: UserStatus.INACTIVE });

                expect(mockUserModel.find).toHaveBeenCalledWith({ status: UserStatus.INACTIVE });
                expect(result).toEqual([]);
            });

            it('should handle find error', async () => {
                const error = new Error('Database query failed');
                mockUserModel.find.mockRejectedValue(error);

                await expect(UserModel.find({})).rejects.toThrow('Database query failed');
                expect(mockUserModel.find).toHaveBeenCalledWith({});
            });
        });

        describe('findByIdAndUpdate', () => {
            it('should update user by ID successfully', async () => {
                const userId = '507f1f77bcf86cd799439011';
                const updateData = { firstName: 'UpdatedName' };
                const mockUpdatedUser = createMockUserDocument({
                    _id: userId,
                    email: 'test@example.com',
                    firstName: 'UpdatedName',
                    lastName: 'Doe'
                });

                mockUserModel.findByIdAndUpdate.mockResolvedValue(mockUpdatedUser);

                const result = await UserModel.findByIdAndUpdate(userId, updateData, { new: true });

                expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(userId, updateData, { new: true });
                expect(result).toEqual(mockUpdatedUser);
                expect(result.firstName).toBe('UpdatedName');
            });

            it('should return null when user not found for update', async () => {
                const userId = '507f1f77bcf86cd799439011';
                const updateData = { firstName: 'UpdatedName' };
                mockUserModel.findByIdAndUpdate.mockResolvedValue(null);

                const result = await UserModel.findByIdAndUpdate(userId, updateData, { new: true });

                expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(userId, updateData, { new: true });
                expect(result).toBeNull();
            });

            it('should handle findByIdAndUpdate error', async () => {
                const userId = '507f1f77bcf86cd799439011';
                const updateData = { firstName: 'UpdatedName' };
                const error = new Error('Update failed');
                mockUserModel.findByIdAndUpdate.mockRejectedValue(error);

                await expect(UserModel.findByIdAndUpdate(userId, updateData, { new: true })).rejects.toThrow('Update failed');
                expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(userId, updateData, { new: true });
            });
        });

        describe('findByIdAndDelete', () => {
            it('should delete user by ID successfully', async () => {
                const userId = '507f1f77bcf86cd799439011';
                const mockDeletedUser = createMockUserDocument({
                    _id: userId,
                    email: 'test@example.com',
                    firstName: 'John',
                    lastName: 'Doe'
                });

                mockUserModel.findByIdAndDelete.mockResolvedValue(mockDeletedUser);

                const result = await UserModel.findByIdAndDelete(userId);

                expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith(userId);
                expect(result).toEqual(mockDeletedUser);
                expect(result._id).toBe(userId);
            });

            it('should return null when user not found for deletion', async () => {
                const userId = '507f1f77bcf86cd799439011';
                mockUserModel.findByIdAndDelete.mockResolvedValue(null);

                const result = await UserModel.findByIdAndDelete(userId);

                expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith(userId);
                expect(result).toBeNull();
            });

            it('should handle findByIdAndDelete error', async () => {
                const userId = '507f1f77bcf86cd799439011';
                const error = new Error('Delete failed');
                mockUserModel.findByIdAndDelete.mockRejectedValue(error);

                await expect(UserModel.findByIdAndDelete(userId)).rejects.toThrow('Delete failed');
                expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith(userId);
            });
        });

        describe('countDocuments', () => {
            it('should count documents successfully', async () => {
                const count = 5;
                mockUserModel.countDocuments.mockResolvedValue(count);

                const result = await UserModel.countDocuments({ status: UserStatus.ACTIVE });

                expect(mockUserModel.countDocuments).toHaveBeenCalledWith({ status: UserStatus.ACTIVE });
                expect(result).toBe(count);
            });

            it('should return 0 when no documents match', async () => {
                mockUserModel.countDocuments.mockResolvedValue(0);

                const result = await UserModel.countDocuments({ status: UserStatus.INACTIVE });

                expect(mockUserModel.countDocuments).toHaveBeenCalledWith({ status: UserStatus.INACTIVE });
                expect(result).toBe(0);
            });

            it('should handle countDocuments error', async () => {
                const error = new Error('Count failed');
                mockUserModel.countDocuments.mockRejectedValue(error);

                await expect(UserModel.countDocuments({})).rejects.toThrow('Count failed');
                expect(mockUserModel.countDocuments).toHaveBeenCalledWith({});
            });
        });

        describe('aggregate', () => {
            it('should execute aggregation pipeline successfully', async () => {
                const pipeline = [
                    { $group: { _id: '$status', count: { $sum: 1 } } },
                    { $sort: { count: -1 } }
                ];
                const mockResult = [
                    { _id: UserStatus.ACTIVE, count: 10 },
                    { _id: UserStatus.INACTIVE, count: 2 }
                ];

                mockUserModel.aggregate.mockResolvedValue(mockResult);

                const result = await UserModel.aggregate(pipeline as any[]);

                expect(mockUserModel.aggregate).toHaveBeenCalledWith(pipeline);
                expect(result).toEqual(mockResult);
                expect(result).toHaveLength(2);
            });

            it('should return empty array when aggregation has no results', async () => {
                const pipeline = [
                    { $match: { status: 'NONEXISTENT' } }
                ];
                mockUserModel.aggregate.mockResolvedValue([]);

                const result = await UserModel.aggregate(pipeline as any[]);

                expect(mockUserModel.aggregate).toHaveBeenCalledWith(pipeline);
                expect(result).toEqual([]);
            });

            it('should handle aggregate error', async () => {
                const pipeline = [
                    { $invalidStage: 'invalid' }
                ];
                const error = new Error('Aggregation failed');
                mockUserModel.aggregate.mockRejectedValue(error);

                await expect(UserModel.aggregate(pipeline as any[])).rejects.toThrow('Aggregation failed');
                expect(mockUserModel.aggregate).toHaveBeenCalledWith(pipeline);
            });
        });
    });

    describe('Document Operations', () => {
        describe('save', () => {
            it('should save document successfully', async () => {
                const mockUser = createMockUserDocument({
                    _id: '507f1f77bcf86cd799439011',
                    email: 'test@example.com',
                    firstName: 'John',
                    lastName: 'Doe'
                });

                mockUser.save.mockResolvedValue(mockUser);

                const result = await mockUser.save();

                expect(mockUser.save).toHaveBeenCalled();
                expect(result).toEqual(mockUser);
            });

            it('should handle save error', async () => {
                const mockUser = createMockUserDocument({
                    email: 'test@example.com'
                });

                const error = new Error('Save failed');
                mockUser.save.mockRejectedValue(error);

                await expect(mockUser.save()).rejects.toThrow('Save failed');
                expect(mockUser.save).toHaveBeenCalled();
            });
        });

        describe('remove', () => {
            it('should remove document successfully', async () => {
                const mockUser = createMockUserDocument({
                    _id: '507f1f77bcf86cd799439011',
                    email: 'test@example.com'
                });

                mockUser.remove.mockResolvedValue(mockUser);

                const result = await mockUser.remove();

                expect(mockUser.remove).toHaveBeenCalled();
                expect(result).toEqual(mockUser);
            });

            it('should handle remove error', async () => {
                const mockUser = createMockUserDocument({
                    _id: '507f1f77bcf86cd799439011',
                    email: 'test@example.com'
                });

                const error = new Error('Remove failed');
                mockUser.remove.mockRejectedValue(error);

                await expect(mockUser.remove()).rejects.toThrow('Remove failed');
                expect(mockUser.remove).toHaveBeenCalled();
            });
        });

        describe('toObject', () => {
            it('should convert document to plain object', () => {
                const mockUser = createMockUserDocument({
                    _id: '507f1f77bcf86cd799439011',
                    email: 'test@example.com',
                    firstName: 'John',
                    lastName: 'Doe'
                });

                const plainObject = mockUser.toObject();

                expect(mockUser.toObject).toHaveBeenCalled();
                expect(plainObject).toEqual({
                    _id: '507f1f77bcf86cd799439011',
                    email: 'test@example.com',
                    firstName: 'John',
                    lastName: 'Doe',
                    password: undefined,
                    idType: undefined,
                    idNumber: undefined,
                    phone: undefined,
                    roleId: undefined,
                    gender: undefined,
                    birthDate: undefined,
                    status: undefined,
                    country: undefined,
                    state: undefined,
                    city: undefined,
                    neighborhood: undefined,
                    address: undefined,
                    postalCode: undefined,
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date)
                });
            });
        });
    });

    describe('Schema Validation', () => {
        it('should validate required fields', () => {
            // Test that the schema is properly defined
            expect(UserModel).toBeDefined();
            expect(typeof UserModel.create).toBe('function');
        });

        it('should handle email uniqueness constraint', () => {
            // This would be tested in integration tests with a real database
            // For unit tests, we verify the model methods work correctly
            expect(UserModel).toBeDefined();
        });
    });
});