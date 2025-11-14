// Mock all dependencies
jest.mock('../../../application/controllers/products-controllers', () => ({
  createProduct: jest.fn((req: any, res: any) => res.json({ success: true }))
}));

jest.mock('../../../application/middlewares/product-middleware', () => ({
  validateProduct: jest.fn((req: any, res: any, next: any) => next())
}));

import productRouter from '../../../application/routes/product-router';

describe('Product Router (Simple)', () => {
  test('should be a valid router function', () => {
    expect(productRouter).toBeDefined();
    expect(typeof productRouter).toBe('function');
  });

  test('should have router stack with routes', () => {
    expect(productRouter.stack).toBeDefined();
    expect(productRouter.stack.length).toBeGreaterThan(0);
  });

  test('should have POST /product route', () => {
    const createRoute = productRouter.stack.find((layer: any) => 
      layer.route && layer.route.path === '/product' && layer.route.methods.post
    );
    expect(createRoute).toBeDefined();
  });
});