import { buildOrderRequest, buildOrderResponse } from '../../../application/dtos/order-dtos';
import { OrderStatus } from '../../../domain/models/interfaces/IOrder';

describe('Order DTOs', () => {
  describe('buildOrderRequest', () => {
    it('should build order request correctly', () => {
      const dto = {
        preorderId: 'pre123',
        userId: 'user123',
        products: [{ productId: 'prod1', name: 'Product 1', quantity: 2, price: 100, categoryId: 'cat1' }],
        shippingAddress: { country: 'CO', state: 'Cundinamarca', city: 'Bogota', neighborhood: 'Centro', address: 'Calle 1', postalCode: '110111' },
        paymentMethod: 'credit_card',
        shippingCost: 10,
        total: 210
      };
      const result = buildOrderRequest(dto);
      
      expect(result.orderNumber).toBe('');
      expect(result.preorderId).toBe('pre123');
      expect(result.userId).toBe('user123');
      expect(result.products).toEqual(dto.products);
      expect(result.shippingAddress).toEqual(dto.shippingAddress);
      expect(result.paymentMethod).toBe('credit_card');
      expect(result.shippingCost).toBe(10);
      expect(result.total).toBe(210);
      expect(result.status).toBe(OrderStatus.PENDING);
      expect(result.emailSent).toBe(false);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('buildOrderResponse', () => {
    it('should build order response correctly', () => {
      const order = {
        _id: 'order123',
        orderNumber: 'ORD-001',
        preorderId: 'pre123',
        userId: 'user123',
        products: [{ productId: 'prod1', name: 'Product 1', quantity: 2, price: 100, categoryId: 'cat1' }],
        shippingAddress: { country: 'CO', state: 'Cundinamarca', city: 'Bogota', neighborhood: 'Centro', address: 'Calle 1', postalCode: '110111' },
        paymentMethod: 'credit_card',
        shippingCost: 10,
        total: 210,
        status: OrderStatus.CONFIRMED,
        createdAt: new Date(),
        updatedAt: new Date(),
        confirmedAt: new Date(),
        emailSent: true
      };
      const result = buildOrderResponse(order);
      
      expect(result.id).toBe('order123');
      expect(result.orderNumber).toBe('ORD-001');
      expect(result.preorderId).toBe('pre123');
      expect(result.userId).toBe('user123');
      expect(result.products).toEqual(order.products);
      expect(result.shippingAddress).toEqual(order.shippingAddress);
      expect(result.paymentMethod).toBe('credit_card');
      expect(result.shippingCost).toBe(10);
      expect(result.total).toBe(210);
      expect(result.status).toBe(OrderStatus.CONFIRMED);
      expect(result.emailSent).toBe(true);
    });
  });
});