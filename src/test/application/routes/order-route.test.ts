// Mock all dependencies
jest.mock('../../../application/controllers/order-controller', () => ({
  createOrder: jest.fn((req: any, res: any) => res.json({ success: true })),
  confirmOrderController: jest.fn((req: any, res: any) => res.json({ success: true })),
  getOrderByIdController: jest.fn((req: any, res: any) => res.json({ success: true })),
  getOrderByNumberController: jest.fn((req: any, res: any) => res.json({ success: true })),
  getUserOrdersController: jest.fn((req: any, res: any) => res.json({ success: true }))
}));

jest.mock('../../../application/middlewares/auth-middleware', () => ({
  authenticateToken: jest.fn((req: any, res: any, next: any) => next())
}));

import orderRouter from '../../../application/routes/order-route';

describe('Order Router', () => {
  test('should be a valid router function', () => {
    expect(orderRouter).toBeDefined();
    expect(typeof orderRouter).toBe('function');
  });

  test('should have router stack with routes', () => {
    expect(orderRouter.stack).toBeDefined();
    expect(orderRouter.stack.length).toBeGreaterThan(0);
  });

  test('should have POST /order route', () => {
    const createRoute = orderRouter.stack.find((layer: any) => 
      layer.route && layer.route.path === '/order' && layer.route.methods.post
    );
    expect(createRoute).toBeDefined();
  });

  test('should have POST /:orderId/confirm route', () => {
    const confirmRoute = orderRouter.stack.find((layer: any) => 
      layer.route && layer.route.path === '/:orderId/confirm' && layer.route.methods.post
    );
    expect(confirmRoute).toBeDefined();
  });

  test('should have GET /:orderId route', () => {
    const getByIdRoute = orderRouter.stack.find((layer: any) => 
      layer.route && layer.route.path === '/:orderId' && layer.route.methods.get
    );
    expect(getByIdRoute).toBeDefined();
  });

  test('should have GET /number/:orderNumber route', () => {
    const getByNumberRoute = orderRouter.stack.find((layer: any) => 
      layer.route && layer.route.path === '/number/:orderNumber' && layer.route.methods.get
    );
    expect(getByNumberRoute).toBeDefined();
  });

  test('should have GET /user/:userId route', () => {
    const getUserOrdersRoute = orderRouter.stack.find((layer: any) => 
      layer.route && layer.route.path === '/user/:userId' && layer.route.methods.get
    );
    expect(getUserOrdersRoute).toBeDefined();
  });
});