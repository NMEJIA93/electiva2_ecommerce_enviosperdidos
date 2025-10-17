// Mock all dependencies
jest.mock('../../../application/controllers/provider-controller', () => ({
  createProvider: jest.fn((req: any, res: any) => res.json({ success: true })),
  deleteProvider: jest.fn((req: any, res: any) => res.json({ success: true })),
  getProviderById: jest.fn((req: any, res: any) => res.json({ success: true })),
  getProviders: jest.fn((req: any, res: any) => res.json({ success: true })),
  updateProvider: jest.fn((req: any, res: any) => res.json({ success: true }))
}));

jest.mock('../../../application/middlewares/auth-middleware', () => ({
  authenticateToken: jest.fn((req: any, res: any, next: any) => next()),
  authorizeRole: jest.fn(() => (req: any, res: any, next: any) => next())
}));

import providerRouter from '../../../application/routes/provider-route';

describe('Provider Router', () => {
  test('should be a valid router function', () => {
    expect(providerRouter).toBeDefined();
    expect(typeof providerRouter).toBe('function');
  });

  test('should have router stack with routes', () => {
    expect(providerRouter.stack).toBeDefined();
    expect(providerRouter.stack.length).toBeGreaterThan(0);
  });

  test('should have POST /admin/product/provider route', () => {
    const createRoute = providerRouter.stack.find((layer: any) => 
      layer.route && layer.route.path === '/admin/product/provider' && layer.route.methods.post
    );
    expect(createRoute).toBeDefined();
  });

  test('should have GET /admin/product//provider route', () => {
    const getRoute = providerRouter.stack.find((layer: any) => 
      layer.route && layer.route.path === '/admin/product//provider' && layer.route.methods.get
    );
    expect(getRoute).toBeDefined();
  });

  test('should have GET /admin/product/provider/:id route', () => {
    const getByIdRoute = providerRouter.stack.find((layer: any) => 
      layer.route && layer.route.path === '/admin/product/provider/:id' && layer.route.methods.get
    );
    expect(getByIdRoute).toBeDefined();
  });

  test('should have PUT /admin/product/provider/:id route', () => {
    const updateRoute = providerRouter.stack.find((layer: any) => 
      layer.route && layer.route.path === '/admin/product/provider/:id' && layer.route.methods.put
    );
    expect(updateRoute).toBeDefined();
  });

  test('should have DELETE /admin/product/provider/:id route', () => {
    const deleteRoute = providerRouter.stack.find((layer: any) => 
      layer.route && layer.route.path === '/admin/product/provider/:id' && layer.route.methods.delete
    );
    expect(deleteRoute).toBeDefined();
  });
});