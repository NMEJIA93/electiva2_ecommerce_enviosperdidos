// Mock all external dependencies
jest.mock('yamljs', () => ({
  load: jest.fn().mockReturnValue({})
}));

jest.mock('swagger-ui-express', () => ({
  serve: jest.fn((req: any, res: any, next: any) => next()),
  setup: jest.fn(() => (req: any, res: any) => res.send('Swagger UI'))
}));

// Mock all route modules
jest.mock('../../../application/routes/users-route', () => jest.fn());
jest.mock('../../../application/routes/auth-route', () => jest.fn());
jest.mock('../../../application/routes/tracking-route', () => jest.fn());
jest.mock('../../../application/routes/product-route', () => jest.fn());
jest.mock('../../../application/routes/inventory-route', () => jest.fn());
jest.mock('../../../application/routes/provider-route', () => jest.fn());
jest.mock('../../../application/routes/categories-route', () => jest.fn());
jest.mock('../../../application/routes/preorder-router', () => jest.fn());
jest.mock('../../../application/routes/order-route', () => jest.fn());
jest.mock('../../../application/routes/catalog-route', () => jest.fn());

import appRouter from '../../../application/routes/app-router';

describe('App Router', () => {
  test('should be a valid router function', () => {
    expect(appRouter).toBeDefined();
    expect(typeof appRouter).toBe('function');
  });

  test('should have router properties', () => {
    expect(appRouter.stack).toBeDefined();
  });
});