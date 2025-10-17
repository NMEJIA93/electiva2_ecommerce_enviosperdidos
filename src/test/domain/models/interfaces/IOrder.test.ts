import { IOrder, IOrderProduct, IOrderShippingAddress, OrderStatus } from '../../../../domain/models/interfaces/IOrder';

describe('IOrder Interface', () => {
  const mockProduct: IOrderProduct = {
    productId: 'prod-123',
    name: 'Test Product',
    description: 'Test Description',
    quantity: 2,
    price: 25000,
    categoryId: 'cat-123',
    categoryName: 'Electronics'
  };

  const mockShippingAddress: IOrderShippingAddress = {
    country: 'Colombia',
    state: 'Cundinamarca',
    city: 'Bogotá',
    neighborhood: 'Chapinero',
    address: 'Calle 123 #45-67',
    postalCode: '110111'
  };

  test('should accept valid order object with all properties', () => {
    const order: IOrder = {
      _id: 'order-123',
      orderNumber: 'ORD-2024-001',
      preorderId: 'preorder-123',
      userId: 'user-123',
      products: [mockProduct],
      shippingAddress: mockShippingAddress,
      paymentMethod: 'credit_card',
      shippingCost: 5000,
      total: 55000,
      status: OrderStatus.PENDING,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      confirmedAt: new Date('2024-01-01'),
      emailSent: true
    };

    expect(order._id).toBe('order-123');
    expect(order.orderNumber).toBe('ORD-2024-001');
    expect(order.preorderId).toBe('preorder-123');
    expect(order.userId).toBe('user-123');
    expect(order.products).toEqual([mockProduct]);
    expect(order.shippingAddress).toEqual(mockShippingAddress);
    expect(order.paymentMethod).toBe('credit_card');
    expect(order.shippingCost).toBe(5000);
    expect(order.total).toBe(55000);
    expect(order.status).toBe(OrderStatus.PENDING);
    expect(order.emailSent).toBe(true);
  });

  test('should handle different order statuses', () => {
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
      const order: IOrder = {
        orderNumber: 'ORD-TEST',
        preorderId: 'preorder-test',
        userId: 'user-test',
        products: [mockProduct],
        shippingAddress: mockShippingAddress,
        paymentMethod: 'cash',
        shippingCost: 0,
        total: 25000,
        status: status,
        createdAt: new Date(),
        updatedAt: new Date(),
        emailSent: false
      };

      expect(order.status).toBe(status);
    });
  });

  test('should handle multiple products', () => {
    const secondProduct: IOrderProduct = {
      productId: 'prod-456',
      name: 'Second Product',
      quantity: 1,
      price: 15000,
      categoryId: 'cat-456'
    };

    const order: IOrder = {
      orderNumber: 'ORD-MULTI',
      preorderId: 'preorder-multi',
      userId: 'user-multi',
      products: [mockProduct, secondProduct],
      shippingAddress: mockShippingAddress,
      paymentMethod: 'debit_card',
      shippingCost: 3000,
      total: 43000,
      status: OrderStatus.CONFIRMED,
      createdAt: new Date(),
      updatedAt: new Date(),
      emailSent: false
    };

    expect(order.products).toHaveLength(2);
    expect(order.products[0]).toEqual(mockProduct);
    expect(order.products[1]).toEqual(secondProduct);
  });
});