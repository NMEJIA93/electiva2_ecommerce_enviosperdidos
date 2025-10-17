import { ICatalog } from '../../../../domain/models/interfaces/ICatalog';

describe('ICatalog Interface', () => {
  test('should accept valid catalog object with all properties', () => {
    const catalog: ICatalog = {
      id: 'cat-123',
      name: 'Test Product',
      description: 'Test Description',
      categoryId: 'category-123',
      categoryName: 'Electronics',
      images: [],
      isDiscontinued: false,
      price: 25000,
      stock: 10,
      reservedStock: 2
    };

    expect(catalog.id).toBe('cat-123');
    expect(catalog.name).toBe('Test Product');
    expect(catalog.description).toBe('Test Description');
    expect(catalog.categoryId).toBe('category-123');
    expect(catalog.categoryName).toBe('Electronics');
    expect(catalog.images).toEqual([]);
    expect(catalog.isDiscontinued).toBe(false);
    expect(catalog.price).toBe(25000);
    expect(catalog.stock).toBe(10);
    expect(catalog.reservedStock).toBe(2);
  });

  test('should accept catalog object with required properties only', () => {
    const catalog: ICatalog = {
      id: 'cat-456',
      name: 'Basic Product',
      description: 'Basic Description',
      categoryId: 'category-456',
      categoryName: 'Books',
      price: 15000,
      stock: 5,
      reservedStock: 0
    };

    expect(catalog.id).toBe('cat-456');
    expect(catalog.name).toBe('Basic Product');
    expect(catalog.price).toBe(15000);
    expect(catalog.stock).toBe(5);
    expect(catalog.reservedStock).toBe(0);
    expect(catalog.images).toBeUndefined();
    expect(catalog.isDiscontinued).toBeUndefined();
  });

  test('should handle discontinued products', () => {
    const catalog: ICatalog = {
      id: 'cat-789',
      name: 'Discontinued Product',
      description: 'Old Product',
      categoryId: 'category-789',
      categoryName: 'Legacy',
      price: 0,
      stock: 0,
      reservedStock: 0,
      isDiscontinued: true
    };

    expect(catalog.isDiscontinued).toBe(true);
    expect(catalog.stock).toBe(0);
  });
});