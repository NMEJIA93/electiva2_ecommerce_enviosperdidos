import { Preorder } from '../../../domain/entities/Preorder';
import { IPreorder, IPreorderProduct } from '../../../domain/models/interfaces/IPreorder';
import { PreOrderStatus } from '../../../application/dtos/preorder-dtos';

describe('Preorder Entity', () => {
  const mockProduct: IPreorderProduct = {
    productId: 'prod-123',
    name: 'Test Product',
    description: 'Test Description',
    quantity: 2,
    price: 25000,
    categoryId: 'cat-123',
    categoryName: 'Electronics'
  };

  const mockPreorderData: IPreorder = {
    _id: 'preorder-123',
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
    status: PreOrderStatus.PENDING,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  };

  test('should create a Preorder instance with all properties', () => {
    const preorder = new Preorder(mockPreorderData);

    expect(preorder._id).toBe('preorder-123');
    expect(preorder.userId).toBe('user-123');
    expect(preorder.products).toEqual([mockProduct]);
    expect(preorder.shippingAddress).toEqual(mockPreorderData.shippingAddress);
    expect(preorder.paymentMethod).toBe('credit_card');
    expect(preorder.shippingCost).toBe(5000);
    expect(preorder.total).toBe(55000);
    expect(preorder.status).toBe(PreOrderStatus.PENDING);
    expect(preorder.createdAt).toEqual(new Date('2024-01-01'));
    expect(preorder.updatedAt).toEqual(new Date('2024-01-01'));
  });

  test('should create a Preorder without _id', () => {
    const dataWithoutId = { ...mockPreorderData };
    delete dataWithoutId._id;

    const preorder = new Preorder(dataWithoutId);

    expect(preorder._id).toBeUndefined();
    expect(preorder.userId).toBe('user-123');
    expect(preorder.products).toEqual([mockProduct]);
  });

  test('should handle multiple products', () => {
    const secondProduct: IPreorderProduct = {
      productId: 'prod-456',
      name: 'Second Product',
      quantity: 1,
      price: 15000,
      categoryId: 'cat-456'
    };

    const dataWithMultipleProducts = {
      ...mockPreorderData,
      products: [mockProduct, secondProduct]
    };

    const preorder = new Preorder(dataWithMultipleProducts);

    expect(preorder.products).toHaveLength(2);
    expect(preorder.products[0]).toEqual(mockProduct);
    expect(preorder.products[1]).toEqual(secondProduct);
  });

  test('should handle different status values', () => {
    const confirmedPreorder = new Preorder({
      ...mockPreorderData,
      status: PreOrderStatus.CONFIRMED
    });

    const expiredPreorder = new Preorder({
      ...mockPreorderData,
      status: PreOrderStatus.EXPIRED
    });

    expect(confirmedPreorder.status).toBe(PreOrderStatus.CONFIRMED);
    expect(expiredPreorder.status).toBe(PreOrderStatus.EXPIRED);
  });

  test('should preserve shipping address structure', () => {
    const preorder = new Preorder(mockPreorderData);

    expect(preorder.shippingAddress.country).toBe('Colombia');
    expect(preorder.shippingAddress.state).toBe('Cundinamarca');
    expect(preorder.shippingAddress.city).toBe('Bogotá');
    expect(preorder.shippingAddress.neighborhood).toBe('Chapinero');
    expect(preorder.shippingAddress.address).toBe('Calle 123 #45-67');
    expect(preorder.shippingAddress.postalCode).toBe('110111');
  });

  test('should handle zero shipping cost', () => {
    const freeShippingPreorder = new Preorder({
      ...mockPreorderData,
      shippingCost: 0,
      total: 50000
    });

    expect(freeShippingPreorder.shippingCost).toBe(0);
    expect(freeShippingPreorder.total).toBe(50000);
  });

  test('should handle products with optional fields', () => {
    const productWithOptionals: IPreorderProduct = {
      productId: 'prod-789',
      name: 'Product with Description',
      description: 'Detailed product description',
      quantity: 3,
      price: 30000,
      categoryId: 'cat-789',
      categoryName: 'Premium'
    };

    const preorder = new Preorder({
      ...mockPreorderData,
      products: [productWithOptionals]
    });

    expect(preorder.products[0].description).toBe('Detailed product description');
    expect(preorder.products[0].categoryName).toBe('Premium');
  });

  test('should handle different payment methods', () => {
    const paymentMethods = ['credit_card', 'debit_card', 'paypal', 'bank_transfer'];

    paymentMethods.forEach(method => {
      const preorder = new Preorder({
        ...mockPreorderData,
        paymentMethod: method
      });
      expect(preorder.paymentMethod).toBe(method);
    });
  });

  test('should handle large quantities and prices', () => {
    const largeOrderProduct: IPreorderProduct = {
      productId: 'prod-bulk',
      name: 'Bulk Product',
      quantity: 1000,
      price: 999999,
      categoryId: 'cat-bulk'
    };

    const preorder = new Preorder({
      ...mockPreorderData,
      products: [largeOrderProduct],
      total: 999999000
    });

    expect(preorder.products[0].quantity).toBe(1000);
    expect(preorder.products[0].price).toBe(999999);
    expect(preorder.total).toBe(999999000);
  });

  test('should handle empty products array', () => {
    const emptyPreorder = new Preorder({
      ...mockPreorderData,
      products: [],
      total: 0
    });

    expect(emptyPreorder.products).toHaveLength(0);
    expect(emptyPreorder.total).toBe(0);
  });
});