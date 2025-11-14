import { IProduct } from '../../../../domain/models/interfaces/IProduct';

describe('IProduct Interface', () => {
  test('should accept valid product object with all properties', () => {
    const product: IProduct = {
      id: 'prod-123',
      name: 'Test Product',
      description: 'Test Description',
      cost: 20000,
      categoryId: 'cat-123',
      images: ['image1.jpg', 'image2.jpg'],
      providers: ['prov-1', 'prov-2'],
      isDiscontinued: false
    };

    expect(product.id).toBe('prod-123');
    expect(product.name).toBe('Test Product');
    expect(product.description).toBe('Test Description');
    expect(product.cost).toBe(20000);
    expect(product.categoryId).toBe('cat-123');
    expect(product.images).toEqual(['image1.jpg', 'image2.jpg']);
    expect(product.providers).toEqual(['prov-1', 'prov-2']);
    expect(product.isDiscontinued).toBe(false);
  });

  test('should accept product object with required properties only', () => {
    const product: IProduct = {
      name: 'Basic Product',
      description: 'Basic Description',
      cost: 15000,
      categoryId: 'cat-456',
      providers: ['prov-1']
    };

    expect(product.name).toBe('Basic Product');
    expect(product.description).toBe('Basic Description');
    expect(product.cost).toBe(15000);
    expect(product.categoryId).toBe('cat-456');
    expect(product.providers).toEqual(['prov-1']);
    expect(product.id).toBeUndefined();
    expect(product.images).toBeUndefined();
    expect(product.isDiscontinued).toBeUndefined();
  });

  test('should handle discontinued products', () => {
    const product: IProduct = {
      name: 'Discontinued Product',
      description: 'Old Product',
      cost: 0,
      categoryId: 'cat-789',
      providers: [],
      isDiscontinued: true
    };

    expect(product.isDiscontinued).toBe(true);
    expect(product.providers).toEqual([]);
  });

  test('should handle multiple providers', () => {
    const product: IProduct = {
      name: 'Multi Provider Product',
      description: 'Product with multiple providers',
      cost: 30000,
      categoryId: 'cat-multi',
      providers: ['prov-1', 'prov-2', 'prov-3']
    };

    expect(product.providers).toHaveLength(3);
    expect(product.providers).toContain('prov-1');
    expect(product.providers).toContain('prov-2');
    expect(product.providers).toContain('prov-3');
  });
});