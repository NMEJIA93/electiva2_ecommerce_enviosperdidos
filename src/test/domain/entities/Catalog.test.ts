import { Catalog } from '../../../domain/entities/Catalog';
import { ICatalog } from '../../../domain/models/interfaces/ICatalog';

describe('Catalog Entity', () => {
  const mockCatalogData: ICatalog = {
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

  test('should create a Catalog instance with all properties', () => {
    const catalog = new Catalog(mockCatalogData);

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

  test('should create a Catalog without optional properties', () => {
    const minimalData: ICatalog = {
      id: 'cat-456',
      name: 'Basic Product',
      description: 'Basic Description',
      categoryId: 'category-456',
      categoryName: 'Books',
      price: 15000,
      stock: 5,
      reservedStock: 0
    };

    const catalog = new Catalog(minimalData);

    expect(catalog.id).toBe('cat-456');
    expect(catalog.name).toBe('Basic Product');
    expect(catalog.price).toBe(15000);
    expect(catalog.images).toBeUndefined();
    expect(catalog.isDiscontinued).toBeUndefined();
  });

  test('should handle discontinued products', () => {
    const discontinuedData: ICatalog = {
      id: 'cat-789',
      name: 'Old Product',
      description: 'Discontinued item',
      categoryId: 'category-789',
      categoryName: 'Legacy',
      price: 0,
      stock: 0,
      reservedStock: 0,
      isDiscontinued: true
    };

    const catalog = new Catalog(discontinuedData);

    expect(catalog.isDiscontinued).toBe(true);
    expect(catalog.stock).toBe(0);
    expect(catalog.price).toBe(0);
  });

  test('should handle zero price and stock', () => {
    const zeroData: ICatalog = {
      id: 'cat-000',
      name: 'Free Product',
      description: 'No cost item',
      categoryId: 'category-000',
      categoryName: 'Free',
      price: 0,
      stock: 0,
      reservedStock: 0
    };

    const catalog = new Catalog(zeroData);

    expect(catalog.price).toBe(0);
    expect(catalog.stock).toBe(0);
    expect(catalog.reservedStock).toBe(0);
  });

  test('should handle high stock and reserved stock values', () => {
    const highStockData: ICatalog = {
      id: 'cat-999',
      name: 'Popular Product',
      description: 'High demand item',
      categoryId: 'category-999',
      categoryName: 'Popular',
      price: 100000,
      stock: 9999,
      reservedStock: 500
    };

    const catalog = new Catalog(highStockData);

    expect(catalog.stock).toBe(9999);
    expect(catalog.reservedStock).toBe(500);
    expect(catalog.price).toBe(100000);
  });

  test('should preserve all string properties correctly', () => {
    const stringTestData: ICatalog = {
      id: 'special-chars-123!@#',
      name: 'Product with Special Characters !@#$%',
      description: 'Description with unicode: áéíóú ñ',
      categoryId: 'cat-unicode-ñ',
      categoryName: 'Categoría Especial',
      price: 50000,
      stock: 15,
      reservedStock: 3
    };

    const catalog = new Catalog(stringTestData);

    expect(catalog.id).toBe('special-chars-123!@#');
    expect(catalog.name).toBe('Product with Special Characters !@#$%');
    expect(catalog.description).toBe('Description with unicode: áéíóú ñ');
    expect(catalog.categoryName).toBe('Categoría Especial');
  });
});