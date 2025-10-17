import { IUsers } from '../../../../domain/models/interfaces/IUsers';
import { UserStatus } from '../../../../application/dtos/user-dtos';

describe('IUsers Interface', () => {
  test('should accept valid user object with all properties', () => {
    const user: IUsers = {
      _id: 'user-123',
      email: 'test@example.com',
      password: 'hashedPassword123',
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

    expect(user._id).toBe('user-123');
    expect(user.email).toBe('test@example.com');
    expect(user.firstName).toBe('John');
    expect(user.lastName).toBe('Doe');
    expect(user.status).toBe(UserStatus.ACTIVE);
    expect(user.isEmailVerified).toBe(true);
  });

  test('should handle different user statuses', () => {
    const statuses = [UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.BLOCKED];

    statuses.forEach(status => {
      const user: IUsers = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        idType: 'CC',
        idNumber: '87654321',
        phone: '+57300987654',
        roleId: 'role-test',
        gender: 'F',
        birthDate: '1995-05-15',
        status: status,
        country: 'Colombia',
        state: 'Antioquia',
        city: 'Medellín',
        neighborhood: 'El Poblado',
        address: 'Carrera 43A #5-15',
        postalCode: '050021',
        createdAt: new Date(),
        updatedAt: new Date(),
        paymentMethodId: 'payment-456',
        isEmailVerified: false
      };

      expect(user.status).toBe(status);
    });
  });

  test('should accept user without optional _id', () => {
    const user: IUsers = {
      email: 'newuser@example.com',
      password: 'newPassword123',
      firstName: 'Jane',
      lastName: 'Smith',
      idType: 'CE',
      idNumber: '11223344',
      phone: '+57301234567',
      roleId: 'role-customer',
      gender: 'F',
      birthDate: '1988-12-25',
      status: UserStatus.BLOCKED,
      country: 'Colombia',
      state: 'Valle del Cauca',
      city: 'Cali',
      neighborhood: 'San Fernando',
      address: 'Avenida 6N #25-50',
      postalCode: '760001',
      createdAt: new Date(),
      updatedAt: new Date(),
      paymentMethodId: 'payment-789',
      isEmailVerified: false
    };

    expect(user._id).toBeUndefined();
    expect(user.email).toBe('newuser@example.com');
    expect(user.status).toBe(UserStatus.BLOCKED);
  });
});