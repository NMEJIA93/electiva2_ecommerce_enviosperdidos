// Mock all dependencies
jest.mock('../../../application/controllers/catalog-controller', () => ({
  getCatalog: jest.fn((req: any, res: any) => res.json({ success: true }))
}));

jest.mock('../../../application/middlewares/auth-middleware', () => ({
  authenticateToken: jest.fn((req: any, res: any, next: any) => next()),
  authorizeRole: jest.fn(() => (req: any, res: any, next: any) => next())
}));

import catalogRouter from '../../../application/routes/catalog-route';

describe('Catalog Router', () => {
  test('should be a valid router function', () => {
    expect(catalogRouter).toBeDefined();
    expect(typeof catalogRouter).toBe('function');
  });

  test('should have router stack with routes', () => {
    expect(catalogRouter.stack).toBeDefined();
    expect(catalogRouter.stack.length).toBeGreaterThan(0);
  });

  test('should have GET /catalog route', () => {
    const catalogRoute = catalogRouter.stack.find((layer: any) => 
      layer.route && layer.route.path === '/catalog' && layer.route.methods.get
    );
    expect(catalogRoute).toBeDefined();
  });
});