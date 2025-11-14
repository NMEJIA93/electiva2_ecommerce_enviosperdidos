import { ICategories } from '../../../../domain/models/interfaces/ICategories';

describe('ICategories Interface', () => {
  test('should accept valid category object', () => {
    const category: ICategories = {
      id: 'cat-123',
      name: 'Electronics'
    };

    expect(category.id).toBe('cat-123');
    expect(category.name).toBe('Electronics');
  });

  test('should have required id property', () => {
    const category: ICategories = {
      id: 'cat-456',
      name: 'Books'
    };

    expect(category).toHaveProperty('id');
    expect(typeof category.id).toBe('string');
  });

  test('should have required name property', () => {
    const category: ICategories = {
      id: 'cat-789',
      name: 'Clothing'
    };

    expect(category).toHaveProperty('name');
    expect(typeof category.name).toBe('string');
  });

  test('should work with different category names', () => {
    const categories: ICategories[] = [
      { id: '1', name: 'Home & Garden' },
      { id: '2', name: 'Sports & Outdoors' },
      { id: '3', name: 'Health & Beauty' }
    ];

    categories.forEach(category => {
      expect(category.id).toBeDefined();
      expect(category.name).toBeDefined();
      expect(typeof category.id).toBe('string');
      expect(typeof category.name).toBe('string');
    });
  });
});