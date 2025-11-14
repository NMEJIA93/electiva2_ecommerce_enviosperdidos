import { buildUserRequest, buildUserResponse, buildVerificationRequest, buildResendCodeRequest, UserStatus } from '../../../application/dtos/user-dtos';

describe('User DTOs', () => {
  describe('buildUserRequest', () => {
    it('should build user request correctly', () => {
      const dto = {
        email: 'test@test.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        idType: 'CC',
        idNumber: '12345678',
        phone: '1234567890',
        roleId: 'role123',
        status: UserStatus.ACTIVE
      };
      const result = buildUserRequest(dto);
      
      expect(result.email).toBe('test@test.com');
      expect(result.password).toBe('password123');
      expect(result.firstName).toBe('John');
      expect(result.lastName).toBe('Doe');
      expect(result.idType).toBe('CC');
      expect(result.idNumber).toBe('12345678');
      expect(result.phone).toBe('1234567890');
      expect(result.roleId).toBe('role123');
      expect(result.status).toBe(UserStatus.ACTIVE);
    });
  });

  describe('buildUserResponse', () => {
    it('should build user response correctly', () => {
      const user = {
        _id: 'user123',
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        idType: 'CC',
        idNumber: '12345678',
        phone: '1234567890',
        roleId: 'role123',
        status: 'ACTIVE',
        isEmailVerified: true
      };
      const result = buildUserResponse(user);
      
      expect(result.id).toBe('user123');
      expect(result.email).toBe('test@test.com');
      expect(result.firstName).toBe('John');
      expect(result.lastName).toBe('Doe');
      expect(result.idType).toBe('CC');
      expect(result.idNumber).toBe('12345678');
      expect(result.phone).toBe('1234567890');
      expect(result.roleId).toBe('role123');
      expect(result.status).toBe('ACTIVE');
      expect(result.isEmailVerified).toBe(true);
    });
  });

  describe('buildVerificationRequest', () => {
    it('should build verification request correctly', () => {
      const dto = { email: 'test@test.com', code: '123456' };
      const result = buildVerificationRequest(dto);
      
      expect(result.email).toBe('test@test.com');
      expect(result.code).toBe('123456');
    });
  });

  describe('buildResendCodeRequest', () => {
    it('should build resend code request correctly', () => {
      const dto = { email: 'test@test.com' };
      const result = buildResendCodeRequest(dto);
      
      expect(result.email).toBe('test@test.com');
    });
  });
});