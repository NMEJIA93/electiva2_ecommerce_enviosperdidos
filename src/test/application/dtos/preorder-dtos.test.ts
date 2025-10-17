import { buildPreOrder, PreOrderStatus } from '../../../application/dtos/preorder-dtos';

describe('Preorder DTOs', () => {
  describe('buildPreOrder', () => {
    it('should build preorder correctly', () => {
      const dto = {
        userId: 'user123',
        products: [{ productId: 'prod1', name: 'Product 1', quantity: 2, price: 100, categoryId: 'cat1' }],
        shippingAddress: { country: 'CO', state: 'Cundinamarca', city: 'Bogota', neighborhood: 'Centro', address: 'Calle 1', postalCode: '110111' },
        paymentMethod: 'credit_card'
      };
      const result = buildPreOrder(dto);
      
      expect(result.userId).toBe('user123');
      expect(result.products).toEqual(dto.products);
      expect(result.shippingAddress).toEqual(dto.shippingAddress);
      expect(result.paymentMethod).toBe('credit_card');
      expect(result.shippingCost).toBe(0);
      expect(result.total).toBe(0);
      expect(result.status).toBe(PreOrderStatus.PENDING);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });
  });
});