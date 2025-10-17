import { buildProviderRequest } from '../../../application/dtos/provider-dtos';

describe('Provider DTOs', () => {
  describe('buildProviderRequest', () => {
    it('should build provider request correctly', () => {
      const dto = { name: 'Test Provider' };
      const result = buildProviderRequest(dto);
      
      expect(result.id).toBe('');
      expect(result.name).toBe('Test Provider');
    });
  });
});