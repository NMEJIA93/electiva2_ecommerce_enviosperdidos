import { Product } from '../../../domain/entities/Product';
import { IProduct } from '../../../domain/models/interfaces/IProduct';

describe('Product Entity', () => {
  test('should create a Product instance with all properties', () => {
    const productData: IProduct = {
      id: 'prod-123',
      name: 'Test Product',
      description: 'Test Description',
      cost: 20000,
      categoryId: 'cat-123',
      images: ['image1.jpg', 'image2.jpg'],
      providers: ['prov-1', 'prov-2'],
      isDiscontinued: false
    };

    const product = new Product(productData);

    expect(product.id).toBe('prod-123');
    expect(product.name).toBe('Test Product');
    expect(product.description).toBe('Test Description');
    expect(product.cost).toBe(20000);
    expect(product.categoryId).toBe('cat-123');
    expect(product.images).toEqual(['image1.jpg', 'image2.jpg']);
    expect(product.providers).toEqual(['prov-1', 'prov-2']);
    expect(product.isDiscontinued).toBe(false);
  });

  test('should create a Product with default values', () => {
    const productData: IProduct = {
      name: 'Basic Product',
      description: 'Basic Description',
      cost: 15000,
      categoryId: 'cat-456',
      providers: []
    };

    const product = new Product(productData);

    expect(product.id).toBe('');
    expect(product.name).toBe('Basic Product');
    expect(product.providers).toEqual([]);
    expect(product.isDiscontinued).toBe(false);
    expect(product.images).toBeUndefined();
  });

  test('should handle discontinued products', () => {
    const productData: IProduct = {
      name: 'Old Product',
      description: 'Discontinued item',
      cost: 0,
      categoryId: 'cat-789',
      providers: [],
      isDiscontinued: true
    };

    const product = new Product(productData);

    expect(product.isDiscontinued).toBe(true);
    expect(product.cost).toBe(0);
    expect(product.providers).toEqual([]);
  });

  test('should handle multiple providers', () => {
    const productData: IProduct = {
      name: 'Multi-Provider Product',
      description: 'Available from multiple sources',
      cost: 25000,
      categoryId: 'cat-multi',
      providers: ['prov-1', 'prov-2', 'prov-3', 'prov-4']
    };

    const product = new Product(productData);

    expect(product.providers).toHaveLength(4);
    expect(product.providers).toContain('prov-1');
    expect(product.providers).toContain('prov-4');
  });

  test('should handle multiple images', () => {
    const productData: IProduct = {
      name: 'Product with Images',
      description: 'Has multiple product images',
      cost: 35000,
      categoryId: 'cat-images',
      providers: ['prov-1'],
      images: ['img1.jpg', 'img2.png', 'img3.webp']
    };

    const product = new Product(productData);

    expect(product.images).toHaveLength(3);
    expect(product.images).toContain('img1.jpg');
    expect(product.images).toContain('img3.webp');
  });

  test('should handle high cost values', () => {
    const productData: IProduct = {
      name: 'Expensive Product',
      description: 'Premium high-cost item',
      cost: 9999999,
      categoryId: 'cat-premium',
      providers: ['prov-premium']
    };

    const product = new Product(productData);

    expect(product.cost).toBe(9999999);
    expect(product.name).toBe('Expensive Product');
  });

  test('should handle special characters in product data', () => {
    const productData: IProduct = {
      name: 'Producto Especial áéíóú ñ !@#$%',
      description: 'Descripción con caracteres especiales & símbolos',
      cost: 45000,
      categoryId: 'cat-special-ñ',
      providers: ['prov-español']
    };

    const product = new Product(productData);

    expect(product.name).toBe('Producto Especial áéíóú ñ !@#$%');
    expect(product.description).toBe('Descripción con caracteres especiales & símbolos');
    expect(product.providers[0]).toBe('prov-español');
  });

  test('should handle empty arrays for images and providers', () => {
    const productData: IProduct = {
      name: 'Minimal Product',
      description: 'Product with empty arrays',
      cost: 10000,
      categoryId: 'cat-minimal',
      providers: [],
      images: []
    };

    const product = new Product(productData);

    expect(product.providers).toEqual([]);
    expect(product.images).toEqual([]);
    expect(product.isDiscontinued).toBe(false);
  });
});