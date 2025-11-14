import { IUserRepository } from '../../../domain/repositories/IUser-repository';
import { User } from '../../../domain/entities/User';
import { UserStatus } from '../../../application/dtos/user-dtos';

describe('IUserRepository', () => {
  let mockRepository: IUserRepository;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      update: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      saveVerificationCode: jest.fn(),
      getVerificationCode: jest.fn(),
      deleteVerificationCode: jest.fn(),
      hasVerificationCode: jest.fn()
    };
  });

  const mockUser = new User({
    _id: '1',
    email: 'test@example.com',
    password: 'hashedPassword',
    firstName: 'John',
    lastName: 'Doe',
    idType: 'CC',
    idNumber: '12345678',
    phone: '1234567890',
    roleId: 'customer',
    gender: 'M',
    birthDate: '1990-01-01',
    status: UserStatus.ACTIVE,
    country: 'Colombia',
    state: 'Cundinamarca',
    city: 'Bogotá',
    neighborhood: 'Centro',
    address: 'Calle 123',
    postalCode: '110111',
    createdAt: new Date(),
    updatedAt: new Date(),
    paymentMethodId: 'pm1',
    isEmailVerified: true
  });

  describe('save', () => {
    it('should save and return user', async () => {
      (mockRepository.save as jest.Mock).mockResolvedValue(mockUser);

      const result = await mockRepository.save(mockUser);

      expect(result).toEqual(mockUser);
      expect(mockRepository.save).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('update', () => {
    it('should update and return user', async () => {
      const updatedUser = { ...mockUser, firstName: 'Jane' };
      (mockRepository.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await mockRepository.update('1', { firstName: 'Jane' });

      expect(result).toEqual(updatedUser);
      expect(mockRepository.update).toHaveBeenCalledWith('1', { firstName: 'Jane' });
    });
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      (mockRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      const result = await mockRepository.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(mockRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should return null if user not found', async () => {
      (mockRepository.findByEmail as jest.Mock).mockResolvedValue(null);

      const result = await mockRepository.findByEmail('notfound@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return user by id', async () => {
      (mockRepository.findById as jest.Mock).mockResolvedValue(mockUser);

      const result = await mockRepository.findById('1');

      expect(result).toEqual(mockUser);
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      (mockRepository.findAll as jest.Mock).mockResolvedValue([mockUser]);

      const result = await mockRepository.findAll();

      expect(result).toEqual([mockUser]);
      expect(mockRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('saveVerificationCode', () => {
    it('should save verification code', async () => {
      const expiresAt = new Date();
      (mockRepository.saveVerificationCode as jest.Mock).mockResolvedValue(undefined);

      await mockRepository.saveVerificationCode('test@example.com', '123456', expiresAt);

      expect(mockRepository.saveVerificationCode).toHaveBeenCalledWith('test@example.com', '123456', expiresAt);
    });
  });

  describe('getVerificationCode', () => {
    it('should return verification code', async () => {
      const codeData = { code: '123456', expiresAt: new Date() };
      (mockRepository.getVerificationCode as jest.Mock).mockResolvedValue(codeData);

      const result = await mockRepository.getVerificationCode('test@example.com');

      expect(result).toEqual(codeData);
      expect(mockRepository.getVerificationCode).toHaveBeenCalledWith('test@example.com');
    });

    it('should return null if no verification code found', async () => {
      (mockRepository.getVerificationCode as jest.Mock).mockResolvedValue(null);

      const result = await mockRepository.getVerificationCode('test@example.com');

      expect(result).toBeNull();
    });
  });

  describe('deleteVerificationCode', () => {
    it('should delete verification code', async () => {
      (mockRepository.deleteVerificationCode as jest.Mock).mockResolvedValue(undefined);

      await mockRepository.deleteVerificationCode('test@example.com');

      expect(mockRepository.deleteVerificationCode).toHaveBeenCalledWith('test@example.com');
    });
  });

  describe('hasVerificationCode', () => {
    it('should return true if verification code exists', async () => {
      (mockRepository.hasVerificationCode as jest.Mock).mockResolvedValue(true);

      const result = await mockRepository.hasVerificationCode('test@example.com');

      expect(result).toBe(true);
      expect(mockRepository.hasVerificationCode).toHaveBeenCalledWith('test@example.com');
    });

    it('should return false if verification code does not exist', async () => {
      (mockRepository.hasVerificationCode as jest.Mock).mockResolvedValue(false);

      const result = await mockRepository.hasVerificationCode('test@example.com');

      expect(result).toBe(false);
    });
  });
});