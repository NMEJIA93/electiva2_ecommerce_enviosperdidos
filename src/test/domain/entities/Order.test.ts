import { Order } from '../../../domain/entities/Order';
import { IOrder, IOrderProduct, OrderStatus } from '../../../domain/models/interfaces/IOrder';

describe('Order Entity', () => {
  const mockProduct: IOrderProduct = {
    productId: 'prod-123',
    name: 'Test Product',
    quantity: 2,
    price: 25000,
    categoryId: 'cat-123'
  };

  const mockOrderData: IOrder = {
    _id: 'order-123',
    orderNumber: 'ORD-2024-001',
    preorderId: 'preorder-123',
    userId: 'user-123',
    products: [mockProduct],
    shippingAddress: {
      country: 'Colombia',
      state: 'Cundinamarca',
      city: 'Bogotá',
      neighborhood: 'Chapinero',
      address: 'Calle 123 #45-67',
      postalCode: '110111'
    },
    paymentMethod: 'credit_card',
    shippingCost: 5000,
    total: 55000,
    status: OrderStatus.PENDING,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    confirmedAt: new Date('2024-01-01'),
    emailSent: true
  };

  test('should create an Order instance with all properties', () => {
    const order = new Order(mockOrderData);

    expect(order._id).toBe('order-123');
    expect(order.orderNumber).toBe('ORD-2024-001');
    expect(order.preorderId).toBe('preorder-123');
    expect(order.userId).toBe('user-123');
    expect(order.products).toEqual([mockProduct]);
    expect(order.shippingAddress.city).toBe('Bogotá');
    expect(order.paymentMethod).toBe('credit_card');
    expect(order.total).toBe(55000);
    expect(order.status).toBe(OrderStatus.PENDING);
    expect(order.emailSent).toBe(true);
  });

  test('should create an Order with default emailSent value', () => {
    const orderData = { ...mockOrderData };
    delete orderData.emailSent;

    const order = new Order(orderData);

    expect(order.emailSent).toBe(false);
    expect(order.orderNumber).toBe('ORD-2024-001');
  });

  test('should handle different order statuses', () => {
    const confirmedOrder = new Order({
      ...mockOrderData,
      status: OrderStatus.CONFIRMED
    });

    expect(confirmedOrder.status).toBe(OrderStatus.CONFIRMED);
  });

  test('should handle multiple products in order', () => {
    const secondProduct: IOrderProduct = {
      productId: 'prod-456',
      name: 'Second Product',
      quantity: 1,
      price: 15000,
      categoryId: 'cat-456'
    };

    const multiProductOrder = new Order({
      ...mockOrderData,
      products: [mockProduct, secondProduct],
      total: 65000
    });

    expect(multiProductOrder.products).toHaveLength(2);
    expect(multiProductOrder.products[1].name).toBe('Second Product');
    expect(multiProductOrder.total).toBe(65000);
  });

  test('should handle all order statuses', () => {
    const statuses = [
      OrderStatus.PENDING,
      OrderStatus.CONFIRMED,
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPED,
      OrderStatus.DELIVERED,
      OrderStatus.CANCELLED,
      OrderStatus.REFUNDED
    ];

    statuses.forEach(status => {
      const order = new Order({
        ...mockOrderData,
        status
      });
      expect(order.status).toBe(status);
    });
  });

  test('should handle zero shipping cost', () => {
    const freeShippingOrder = new Order({
      ...mockOrderData,
      shippingCost: 0,
      total: 50000
    });

    expect(freeShippingOrder.shippingCost).toBe(0);
    expect(freeShippingOrder.total).toBe(50000);
  });

  test('should handle order without confirmedAt date', () => {
    const orderData = { ...mockOrderData };
    delete orderData.confirmedAt;

    const order = new Order(orderData);

    expect(order.confirmedAt).toBeUndefined();
    expect(order.status).toBe(OrderStatus.PENDING);
  });

  test('should handle different payment methods', () => {
    const paymentMethods = ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash'];

    paymentMethods.forEach(method => {
      const order = new Order({
        ...mockOrderData,
        paymentMethod: method
      });
      expect(order.paymentMethod).toBe(method);
    });
  });

  test('should preserve complete shipping address', () => {
    const order = new Order(mockOrderData);

    expect(order.shippingAddress.country).toBe('Colombia');
    expect(order.shippingAddress.state).toBe('Cundinamarca');
    expect(order.shippingAddress.city).toBe('Bogotá');
    expect(order.shippingAddress.neighborhood).toBe('Chapinero');
    expect(order.shippingAddress.address).toBe('Calle 123 #45-67');
    expect(order.shippingAddress.postalCode).toBe('110111');
  });
});