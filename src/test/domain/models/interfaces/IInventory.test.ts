import { IInventory } from '../../../../domain/models/interfaces/IInventory';

describe('IInventory Interface', () => {
  test('should accept valid inventory object with all properties', () => {
    const inventory: IInventory = {
      id: 'inv-123',
      productId: 'prod-123',
      name: 'Test Product',
      description: 'Test Description',
      cost: 20000,
      price: 25000,
      stock: 10,
      reservedStock: 2,
      reservations: [],
      category: {
        id: 'cat-123',
        name: 'Electronics'
      },
      provider: {
        id: 'prov-123',
        name: 'Test Provider'
      },
      images: ['image1.jpg', 'image2.jpg'],
      isDiscontinued: false,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      action: 1
    };

    expect(inventory.id).toBe('inv-123');
    expect(inventory.productId).toBe('prod-123');
    expect(inventory.name).toBe('Test Product');
    expect(inventory.cost).toBe(20000);
    expect(inventory.price).toBe(25000);
    expect(inventory.stock).toBe(10);
    expect(inventory.reservedStock).toBe(2);
    expect(inventory.category?.id).toBe('cat-123');
    expect(inventory.provider?.name).toBe('Test Provider');
    expect(inventory.images).toEqual(['image1.jpg', 'image2.jpg']);
    expect(inventory.isDiscontinued).toBe(false);
    expect(inventory.action).toBe(1);
  });

  test('should accept inventory object with minimal properties', () => {
    const inventory: IInventory = {
      stock: 5,
      reservedStock: 0
    };

    expect(inventory.stock).toBe(5);
    expect(inventory.reservedStock).toBe(0);
    expect(inventory.id).toBeUndefined();
    expect(inventory.productId).toBeUndefined();
  });

  test('should handle discontinued inventory', () => {
    const inventory: IInventory = {
      id: 'inv-456',
      stock: 0,
      reservedStock: 0,
      isDiscontinued: true
    };

    expect(inventory.isDiscontinued).toBe(true);
    expect(inventory.stock).toBe(0);
  });

  test('should handle nested category and provider objects', () => {
    const inventory: IInventory = {
      category: {
        id: 'cat-789',
        name: 'Books'
      },
      provider: {
        id: 'prov-789',
        name: 'Book Publisher'
      }
    };

    expect(inventory.category?.id).toBe('cat-789');
    expect(inventory.category?.name).toBe('Books');
    expect(inventory.provider?.id).toBe('prov-789');
    expect(inventory.provider?.name).toBe('Book Publisher');
  });
});