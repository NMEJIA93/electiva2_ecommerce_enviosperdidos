// Mock all dependencies
jest.mock('../../../application/middlewares/auth-validators', () => ({
  validateLogin: jest.fn((req: any, res: any, next: any) => next())
}));

jest.mock('../../../application/controllers/auth-controller', () => ({
  login: jest.fn((req: any, res: any) => res.json({ success: true })),
  getLogin: jest.fn((req: any, res: any) => res.json({ success: true })),
  verifyEmail: jest.fn((req: any, res: any) => res.json({ success: true })),
  resendCode: jest.fn((req: any, res: any) => res.json({ success: true })),
  logout: jest.fn((req: any, res: any) => res.json({ success: true }))
}));

jest.mock('../../../application/middlewares/auth-middleware', () => ({
  authenticateToken: jest.fn((req: any, res: any, next: any) => next())
}));

jest.mock('../../../application/middlewares/users-validators', () => ({
  useParamValidation: jest.fn((req: any, res: any, next: any) => next()),
  validateEmailVerification: jest.fn((req: any, res: any, next: any) => next()),
  validateResendCode: jest.fn((req: any, res: any, next: any) => next())
}));

jest.mock('../../../application/controllers/user-controller', () => ({
  createUser: jest.fn((req: any, res: any) => res.json({ success: true }))
}));

import authRouter from '../../../application/routes/auth-route';

describe('Auth Router', () => {
  test('should be a valid router function', () => {
    expect(authRouter).toBeDefined();
    expect(typeof authRouter).toBe('function');
  });

  test('should have router stack with routes', () => {
    expect(authRouter.stack).toBeDefined();
    expect(authRouter.stack.length).toBeGreaterThan(0);
  });

  test('should have POST /auth/login route', () => {
    const loginRoute = authRouter.stack.find((layer: any) => 
      layer.route && layer.route.path === '/auth/login' && layer.route.methods.post
    );
    expect(loginRoute).toBeDefined();
  });

  test('should have GET /auth/session route', () => {
    const sessionRoute = authRouter.stack.find((layer: any) => 
      layer.route && layer.route.path === '/auth/session' && layer.route.methods.get
    );
    expect(sessionRoute).toBeDefined();
  });

  test('should have POST /auth/register route', () => {
    const registerRoute = authRouter.stack.find((layer: any) => 
      layer.route && layer.route.path === '/auth/register' && layer.route.methods.post
    );
    expect(registerRoute).toBeDefined();
  });
});