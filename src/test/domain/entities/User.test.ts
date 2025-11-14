import { User } from '../../../domain/entities/User';
import { IUsers } from '../../../domain/models/interfaces/IUsers';
import { UserStatus } from '../../../application/dtos/user-dtos';

describe('User Entity', () => {
  const mockUserData: IUsers = {
    _id: 'user-123',
    email: 'test@example.com',
    password: '$2b$10$hashedPasswordExample123456789',
    firstName: 'John',
    lastName: 'Doe',
    idType: 'CC',
    idNumber: '12345678',
    phone: '+57300123456',
    roleId: 'role-user',
    gender: 'M',
    birthDate: '1990-01-01',
    status: UserStatus.ACTIVE,
    country: 'Colombia',
    state: 'Cundinamarca',
    city: 'Bogotá',
    neighborhood: 'Chapinero',
    address: 'Calle 123 #45-67',
    postalCode: '110111',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    paymentMethodId: 'payment-123',
    isEmailVerified: true
  };

  test('should create a User instance with all properties', () => {
    const user = new User(mockUserData);

    expect(user._id).toBe('user-123');
    expect(user.email).toBe('test@example.com');
    expect(user.firstName).toBe('John');
    expect(user.lastName).toBe('Doe');
    expect(user.idType).toBe('CC');
    expect(user.idNumber).toBe('12345678');
    expect(user.phone).toBe('+57300123456');
    expect(user.status).toBe(UserStatus.ACTIVE);
    expect(user.country).toBe('Colombia');
    expect(user.city).toBe('Bogotá');
    expect(user.isEmailVerified).toBe(true);
  });

  test('should handle different user statuses', () => {
    const inactiveUser = new User({
      ...mockUserData,
      status: UserStatus.INACTIVE
    });

    const blockedUser = new User({
      ...mockUserData,
      status: UserStatus.BLOCKED
    });

    expect(inactiveUser.status).toBe(UserStatus.INACTIVE);
    expect(blockedUser.status).toBe(UserStatus.BLOCKED);
  });

  test('should create a User without _id', () => {
    const userData = { ...mockUserData };
    delete userData._id;

    const user = new User(userData);

    expect(user._id).toBeUndefined();
    expect(user.email).toBe('test@example.com');
    expect(user.firstName).toBe('John');
  });

  test('should handle different ID types', () => {
    const idTypes = ['CC', 'CE', 'TI', 'PP', 'NIT'];

    idTypes.forEach(idType => {
      const user = new User({
        ...mockUserData,
        idType,
        idNumber: '123456789'
      });
      expect(user.idType).toBe(idType);
    });
  });

  test('should handle different genders', () => {
    const genders = ['M', 'F', 'O'];

    genders.forEach(gender => {
      const user = new User({
        ...mockUserData,
        gender
      });
      expect(user.gender).toBe(gender);
    });
  });

  test('should handle complete address information', () => {
    const user = new User(mockUserData);

    expect(user.country).toBe('Colombia');
    expect(user.state).toBe('Cundinamarca');
    expect(user.city).toBe('Bogotá');
    expect(user.neighborhood).toBe('Chapinero');
    expect(user.address).toBe('Calle 123 #45-67');
    expect(user.postalCode).toBe('110111');
  });

  test('should handle email verification status', () => {
    const verifiedUser = new User({
      ...mockUserData,
      isEmailVerified: true
    });

    const unverifiedUser = new User({
      ...mockUserData,
      isEmailVerified: false
    });

    expect(verifiedUser.isEmailVerified).toBe(true);
    expect(unverifiedUser.isEmailVerified).toBe(false);
  });

  test('should handle different phone number formats', () => {
    const phoneFormats = [
      '+57300123456',
      '+1234567890',
      '300123456',
      '+57 300 123 456'
    ];

    phoneFormats.forEach(phone => {
      const user = new User({
        ...mockUserData,
        phone
      });
      expect(user.phone).toBe(phone);
    });
  });

  test('should handle special characters in names', () => {
    const user = new User({
      ...mockUserData,
      firstName: 'José María',
      lastName: 'García-López'
    });

    expect(user.firstName).toBe('José María');
    expect(user.lastName).toBe('García-López');
  });

  test('should handle different date formats for birthDate', () => {
    const dates = ['1990-01-01', '1985-12-25', '2000-06-15'];

    dates.forEach(birthDate => {
      const user = new User({
        ...mockUserData,
        birthDate
      });
      expect(user.birthDate).toBe(birthDate);
    });
  });

  test('should preserve timestamps correctly', () => {
    const createdAt = new Date('2024-01-01T10:00:00Z');
    const updatedAt = new Date('2024-01-02T15:30:00Z');

    const user = new User({
      ...mockUserData,
      createdAt,
      updatedAt
    });

    expect(user.createdAt).toEqual(createdAt);
    expect(user.updatedAt).toEqual(updatedAt);
  });

  test('should handle all user status values', () => {
    const statuses = [UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.BLOCKED];

    statuses.forEach(status => {
      const user = new User({
        ...mockUserData,
        status
      });
      expect(user.status).toBe(status);
    });
  });
});