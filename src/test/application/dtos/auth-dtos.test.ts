import { buildLoginRequest, buildAuthResponse, buildErrorResponse } from '../../../application/dtos/auth-dtos';

describe('Auth DTOs', () => {
  describe('buildLoginRequest', () => {
    it('should build login request correctly', () => {
      const body = { email: 'test@test.com', password: 'password123' };
      const result = buildLoginRequest(body);
      
      expect(result.email).toBe('test@test.com');
      expect(result.password).toBe('password123');
    });
  });

  describe('buildAuthResponse', () => {
    it('should build auth response with token and user', () => {
      const user = { id: '1', email: 'test@test.com', name: 'Test', phone: '123' };
      const result = buildAuthResponse('Success', 'token123', user);
      
      expect(result.msg).toBe('Success');
      expect(result.token).toBe('token123');
      expect(result.user).toEqual(user);
    });

    it('should build auth response without token and user', () => {
      const result = buildAuthResponse('Error');
      
      expect(result.msg).toBe('Error');
      expect(result.token).toBeUndefined();
      expect(result.user).toBeUndefined();
    });
  });

  describe('buildErrorResponse', () => {
    it('should build error response correctly', () => {
      const result = buildErrorResponse('validation', 'Invalid data');
      
      expect(result.type).toBe('validation');
      expect(result.msg).toBe('Invalid data');
    });
  });
});