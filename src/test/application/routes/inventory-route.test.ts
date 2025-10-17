// Mock all dependencies
jest.mock('../../../application/controllers/inventory-controller', () => ({
  updateInventory: jest.fn((req: any, res: any) => res.json({ success: true })),
  updateReserved: jest.fn((req: any, res: any) => res.json({ success: true })),
  getInventoryById: jest.fn((req: any, res: any) => res.json({ success: true }))
}));

jest.mock('../../../application/middlewares/auth-middleware', () => ({
  authenticateToken: jest.fn((req: any, res: any, next: any) => next()),
  authorizeRole: jest.fn(() => (req: any, res: any, next: any) => next())
}));

jest.mock('../../../application/middlewares/inventory-middleware', () => ({
  validateInventory: jest.fn((req: any, res: any, next: any) => next())
}));

import inventoryRouter from '../../../application/routes/inventory-route';

describe('Inventory Router', () => {
  test('should be a valid router function', () => {
    expect(inventoryRouter).toBeDefined();
    expect(typeof inventoryRouter).toBe('function');
  });

  test('should have router stack with routes', () => {
    expect(inventoryRouter.stack).toBeDefined();
    expect(inventoryRouter.stack.length).toBeGreaterThan(0);
  });

  test('should have PUT /admin/product/inventory/:id route', () => {
    const updateRoute = inventoryRouter.stack.find((layer: any) => 
      layer.route && layer.route.path === '/admin/product/inventory/:id' && layer.route.methods.put
    );
    expect(updateRoute).toBeDefined();
  });

  test('should have PATCH /user/cart/product/inventory/hold/:id route', () => {
    const holdRoute = inventoryRouter.stack.find((layer: any) => 
      layer.route && layer.route.path === '/user/cart/product/inventory/hold/:id' && layer.route.methods.patch
    );
    expect(holdRoute).toBeDefined();
  });

  test('should have GET /user/product/inventory/:id route', () => {
    const getRoute = inventoryRouter.stack.find((layer: any) => 
      layer.route && layer.route.path === '/user/product/inventory/:id' && layer.route.methods.get
    );
    expect(getRoute).toBeDefined();
  });
});