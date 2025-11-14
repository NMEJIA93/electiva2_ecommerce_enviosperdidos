// Mock all dependencies
jest.mock('../../../application/controllers/products-controllers', () => ({
  createProduct: jest.fn((req: any, res: any) => res.json({ success: true })),
  getProducts: jest.fn((req: any, res: any) => res.json({ success: true })),
  getProductById: jest.fn((req: any, res: any) => res.json({ success: true })),
  updateProduct: jest.fn((req: any, res: any) => res.json({ success: true })),
  deleteProduct: jest.fn((req: any, res: any) => res.json({ success: true }))
}));

jest.mock('../../../application/middlewares/product-middleware', () => ({
  validateProduct: jest.fn((req: any, res: any, next: any) => next())
}));

jest.mock('../../../application/middlewares/auth-middleware', () => ({
  authenticateToken: jest.fn((req: any, res: any, next: any) => next()),
  authorizeRole: jest.fn(() => (req: any, res: any, next: any) => next())
}));

import productRouter from '../../../application/routes/product-route';

describe('Product Router', () => {
  test('should be a valid router function', () => {
    expect(productRouter).toBeDefined();
    expect(typeof productRouter).toBe('function');
  });

  test('should have router stack with routes', () => {
    expect(productRouter.stack).toBeDefined();
    expect(productRouter.stack.length).toBeGreaterThan(0);
  });

  test('should have POST /admin/product route', () => {
    const createRoute = productRouter.stack.find((layer: any) => 
      layer.route && layer.route.path === '/admin/product' && layer.route.methods.post
    );
    expect(createRoute).toBeDefined();
  });

  test('should have GET /admin/product route', () => {
    const getRoute = productRouter.stack.find((layer: any) => 
      layer.route && layer.route.path === '/admin/product' && layer.route.methods.get
    );
    expect(getRoute).toBeDefined();
  });

  test('should have GET /admin/product/:id route', () => {
    const getByIdRoute = productRouter.stack.find((layer: any) => 
      layer.route && layer.route.path === '/admin/product/:id' && layer.route.methods.get
    );
    expect(getByIdRoute).toBeDefined();
  });

  test('should have PUT /admin/product/:id route', () => {
    const updateRoute = productRouter.stack.find((layer: any) => 
      layer.route && layer.route.path === '/admin/product/:id' && layer.route.methods.put
    );
    expect(updateRoute).toBeDefined();
  });

  test('should have DELETE /product/:id route', () => {
    const deleteRoute = productRouter.stack.find((layer: any) => 
      layer.route && layer.route.path === '/product/:id' && layer.route.methods.delete
    );
    expect(deleteRoute).toBeDefined();
  });
});