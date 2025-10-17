// Mock all dependencies
jest.mock('../../../application/controllers/categories-controller', () => ({
  createCategory: jest.fn((req: any, res: any) => res.json({ success: true })),
  getCategoryById: jest.fn((req: any, res: any) => res.json({ success: true })),
  getCategories: jest.fn((req: any, res: any) => res.json({ success: true })),
  updateCategory: jest.fn((req: any, res: any) => res.json({ success: true })),
  deleteCategoryById: jest.fn((req: any, res: any) => res.json({ success: true }))
}));

jest.mock('../../../application/middlewares/auth-middleware', () => ({
  authenticateToken: jest.fn((req: any, res: any, next: any) => next()),
  authorizeRole: jest.fn(() => (req: any, res: any, next: any) => next())
}));

import categoryRouter from '../../../application/routes/categories-route';

describe('Categories Router', () => {
  test('should be a valid router function', () => {
    expect(categoryRouter).toBeDefined();
    expect(typeof categoryRouter).toBe('function');
  });

  test('should have router stack with routes', () => {
    expect(categoryRouter.stack).toBeDefined();
    expect(categoryRouter.stack.length).toBeGreaterThan(0);
  });

  test('should have POST /admin/product/categories route', () => {
    const createRoute = categoryRouter.stack.find((layer: any) => 
      layer.route && layer.route.path === '/admin/product/categories' && layer.route.methods.post
    );
    expect(createRoute).toBeDefined();
  });

  test('should have GET /admin/product/categories route', () => {
    const getRoute = categoryRouter.stack.find((layer: any) => 
      layer.route && layer.route.path === '/admin/product/categories' && layer.route.methods.get
    );
    expect(getRoute).toBeDefined();
  });

  test('should have GET /admin/product/categories/:id route', () => {
    const getByIdRoute = categoryRouter.stack.find((layer: any) => 
      layer.route && layer.route.path === '/admin/product/categories/:id' && layer.route.methods.get
    );
    expect(getByIdRoute).toBeDefined();
  });

  test('should have PUT /admin/product/categories/:id route', () => {
    const updateRoute = categoryRouter.stack.find((layer: any) => 
      layer.route && layer.route.path === '/admin/product/categories/:id' && layer.route.methods.put
    );
    expect(updateRoute).toBeDefined();
  });

  test('should have DELETE /admin/product/categories/:id route', () => {
    const deleteRoute = categoryRouter.stack.find((layer: any) => 
      layer.route && layer.route.path === '/admin/product/categories/:id' && layer.route.methods.delete
    );
    expect(deleteRoute).toBeDefined();
  });
});