import { buildProductRequest } from '../../../application/dtos/product-dtos';

describe('Product DTOs', () => {
  describe('buildProductRequest', () => {
    it('should build product request correctly with all fields', () => {
      const dto = {
        name: 'Test Product',
        description: 'Test Description',
        cost: 100,
        stock: 50,
        categoryId: 'cat123',
        images: ['image1.jpg', 'image2.jpg'],
        providers: ['prov1', 'prov2'],
        isDiscontinued: false
      };
      const result = buildProductRequest(dto);
      
      expect(result.id).toBe('');
      expect(result.name).toBe('Test Product');
      expect(result.description).toBe('Test Description');
      expect(result.cost).toBe(100);
      expect(result.categoryId).toBe('cat123');
      expect(result.images).toEqual(['image1.jpg', 'image2.jpg']);
      expect(result.providers).toEqual(['prov1', 'prov2']);
      expect(result.isDiscontinued).toBe(false);
    });

    it('should build product request with default values', () => {
      const dto = {
        name: 'Test Product',
        description: 'Test Description',
        cost: 100,
        stock: 50,
        categoryId: 'cat123',
        providers: ['prov1']
      };
      const result = buildProductRequest(dto);
      
      expect(result.images).toEqual([]);
      expect(result.providers).toEqual(['prov1']);
      expect(result.isDiscontinued).toBeUndefined();
    });
  });
});