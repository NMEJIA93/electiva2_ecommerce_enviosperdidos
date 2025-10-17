import { IPreorder, IPreorderProduct, IShippingAddress } from '../../../../domain/models/interfaces/IPreorder';
import { PreOrderStatus } from '../../../../application/dtos/preorder-dtos';

describe('IPreorder Interface', () => {
  const mockProduct: IPreorderProduct = {
    productId: 'prod-123',
    name: 'Test Product',
    description: 'Test Description',
    quantity: 2,
    price: 25000,
    categoryId: 'cat-123',
    categoryName: 'Electronics'
  };

  const mockShippingAddress: IShippingAddress = {
    country: 'Colombia',
    state: 'Cundinamarca',
    city: 'Bogotá',
    neighborhood: 'Chapinero',
    address: 'Calle 123 #45-67',
    postalCode: '110111'
  };

  test('should accept valid preorder object with all properties', () => {
    const preorder: IPreorder = {
      _id: 'preorder-123',
      userId: 'user-123',
      products: [mockProduct],
      shippingAddress: mockShippingAddress,
      paymentMethod: 'credit_card',
      shippingCost: 5000,
      total: 55000,
      status: PreOrderStatus.PENDING,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    };

    expect(preorder._id).toBe('preorder-123');
    expect(preorder.userId).toBe('user-123');
    expect(preorder.products).toEqual([mockProduct]);
    expect(preorder.shippingAddress).toEqual(mockShippingAddress);
    expect(preorder.paymentMethod).toBe('credit_card');
    expect(preorder.shippingCost).toBe(5000);
    expect(preorder.total).toBe(55000);
    expect(preorder.status).toBe(PreOrderStatus.PENDING);
  });

  test('should handle different preorder statuses', () => {
    const statuses = [
      PreOrderStatus.PENDING,
      PreOrderStatus.EXPIRED,
      PreOrderStatus.CANCELLED,
      PreOrderStatus.CONFIRMED
    ];

    statuses.forEach(status => {
      const preorder: IPreorder = {
        userId: 'user-test',
        products: [mockProduct],
        shippingAddress: mockShippingAddress,
        paymentMethod: 'cash',
        shippingCost: 0,
        total: 25000,
        status: status,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      expect(preorder.status).toBe(status);
    });
  });

  test('should handle multiple products', () => {
    const secondProduct: IPreorderProduct = {
      productId: 'prod-456',
      name: 'Second Product',
      quantity: 1,
      price: 15000,
      categoryId: 'cat-456'
    };

    const preorder: IPreorder = {
      userId: 'user-multi',
      products: [mockProduct, secondProduct],
      shippingAddress: mockShippingAddress,
      paymentMethod: 'debit_card',
      shippingCost: 3000,
      total: 43000,
      status: PreOrderStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    expect(preorder.products).toHaveLength(2);
    expect(preorder.products[0]).toEqual(mockProduct);
    expect(preorder.products[1]).toEqual(secondProduct);
  });
});