import { buildInventoryRequest } from '../../../application/dtos/inventory-dtos';

describe('Inventory DTOs', () => {
  describe('buildInventoryRequest', () => {
    it('should build inventory request correctly', () => {
      const dto = {
        productId: 'prod123',
        price: 100,
        stock: 50,
        reservedStock: 5,
        action: 1
      };
      const result = buildInventoryRequest(dto);
      
      expect(result.id).toBe('');
      expect(result.productId).toBe('prod123');
      expect(result.price).toBe(100);
      expect(result.stock).toBe(50);
      expect(result.reservedStock).toBe(5);
      expect(result.action).toBe(1);
    });

    it('should build inventory request without action', () => {
      const dto = {
        productId: 'prod123',
        price: 100,
        stock: 50,
        reservedStock: 5
      };
      const result = buildInventoryRequest(dto);
      
      expect(result.action).toBeUndefined();
    });
  });
});