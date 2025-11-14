import { Inventory } from '../../../domain/entities/Inventory';
import { IInventory } from '../../../domain/models/interfaces/IInventory';

describe('Inventory Entity', () => {
  test('should create an Inventory instance with all properties', () => {
    const inventoryData: IInventory = {
      id: 'inv-123',
      productId: 'prod-123',
      price: 25000,
      stock: 10,
      reservedStock: 2,
      reservations: [],
      action: 1
    };

    const inventory = new Inventory(inventoryData);

    expect(inventory.id).toBe('inv-123');
    expect(inventory.productId).toBe('prod-123');
    expect(inventory.price).toBe(25000);
    expect(inventory.stock).toBe(10);
    expect(inventory.reservedStock).toBe(2);
    expect(inventory.reservations).toEqual([]);
    expect(inventory.action).toBe(1);
  });

  test('should create an Inventory with default values', () => {
    const inventoryData: IInventory = {
      productId: 'prod-456',
      price: 15000
    };

    const inventory = new Inventory(inventoryData);

    expect(inventory.id).toBe('');
    expect(inventory.productId).toBe('prod-456');
    expect(inventory.price).toBe(15000);
    expect(inventory.stock).toBe(0);
    expect(inventory.reservedStock).toBe(0);
    expect(inventory.reservations).toEqual([]);
    expect(inventory.action).toBeUndefined();
  });

  test('should handle zero stock and reservations', () => {
    const inventoryData: IInventory = {
      productId: 'prod-789',
      price: 0,
      stock: 0,
      reservedStock: 0,
      reservations: []
    };

    const inventory = new Inventory(inventoryData);

    expect(inventory.stock).toBe(0);
    expect(inventory.reservedStock).toBe(0);
    expect(inventory.price).toBe(0);
  });

  test('should handle high stock values', () => {
    const inventoryData: IInventory = {
      productId: 'prod-high',
      price: 999999,
      stock: 10000,
      reservedStock: 500,
      reservations: []
    };

    const inventory = new Inventory(inventoryData);

    expect(inventory.stock).toBe(10000);
    expect(inventory.reservedStock).toBe(500);
    expect(inventory.price).toBe(999999);
  });

  test('should handle different action values', () => {
    const inventoryData: IInventory = {
      productId: 'prod-action',
      price: 50000,
      action: 2
    };

    const inventory = new Inventory(inventoryData);

    expect(inventory.action).toBe(2);
    expect(inventory.stock).toBe(0);
    expect(inventory.reservedStock).toBe(0);
  });

  test('should handle missing optional fields correctly', () => {
    const inventoryData: IInventory = {
      productId: 'prod-minimal',
      price: 25000
    };

    const inventory = new Inventory(inventoryData);

    expect(inventory.id).toBe('');
    expect(inventory.stock).toBe(0);
    expect(inventory.reservedStock).toBe(0);
    expect(inventory.reservations).toEqual([]);
    expect(inventory.action).toBeUndefined();
  });

  test('should preserve productId correctly', () => {
    const specialProductId = 'prod-special-chars-123!@#';
    const inventoryData: IInventory = {
      productId: specialProductId,
      price: 15000
    };

    const inventory = new Inventory(inventoryData);

    expect(inventory.productId).toBe(specialProductId);
  });
});