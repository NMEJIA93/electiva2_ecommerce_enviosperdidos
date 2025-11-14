import { buildCategoriesRequest } from '../../../application/dtos/categories';

describe('Categories DTOs', () => {
  describe('buildCategoriesRequest', () => {
    it('should build categories request correctly', () => {
      const dto = { name: 'Electronics' };
      const result = buildCategoriesRequest(dto);
      
      expect(result.id).toBe('');
      expect(result.name).toBe('Electronics');
    });
  });
});