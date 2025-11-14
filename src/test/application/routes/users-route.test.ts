// Mock all dependencies
jest.mock('../../../application/middlewares/users-validators', () => ({
  useParamValidation: jest.fn((req: any, res: any, next: any) => next())
}));

jest.mock('../../../infraestructure/services/nodemailer-email', () => ({
  NodemailerEmailService: jest.fn().mockImplementation(() => ({
    sendVerificationCode: jest.fn().mockResolvedValue({
      success: true,
      messageId: 'test-message-id'
    })
  }))
}));

jest.mock('../../../application/middlewares/auth-middleware', () => ({
  authenticateToken: jest.fn((req: any, res: any, next: any) => next()),
  authorizeProfileAccess: jest.fn((req: any, res: any, next: any) => next())
}));

jest.mock('../../../application/controllers/user-controller', () => ({
  createUser: jest.fn((req: any, res: any) => res.json({ success: true })),
  getUserProfile: jest.fn((req: any, res: any) => res.json({ success: true })),
  getAllUsers: jest.fn((req: any, res: any) => res.json({ success: true })),
  updateUser: jest.fn((req: any, res: any) => res.json({ success: true })),
  updatePartialUser: jest.fn((req: any, res: any) => res.json({ success: true }))
}));

import userRouter from '../../../application/routes/users-route';

describe('Users Router', () => {
  test('should be a valid router function', () => {
    expect(userRouter).toBeDefined();
    expect(typeof userRouter).toBe('function');
  });

  test('should have router stack with routes', () => {
    expect(userRouter.stack).toBeDefined();
    expect(userRouter.stack.length).toBeGreaterThan(0);
  });

  test('should have POST /user route', () => {
    const createRoute = userRouter.stack.find((layer: any) => 
      layer.route && layer.route.path === '/user' && layer.route.methods.post
    );
    expect(createRoute).toBeDefined();
  });

  test('should have PUT /user/profile/:id route', () => {
    const updateRoute = userRouter.stack.find((layer: any) => 
      layer.route && layer.route.path === '/user/profile/:id' && layer.route.methods.put
    );
    expect(updateRoute).toBeDefined();
  });

  test('should have PATCH /user/profile/:id route', () => {
    const patchRoute = userRouter.stack.find((layer: any) => 
      layer.route && layer.route.path === '/user/profile/:id' && layer.route.methods.patch
    );
    expect(patchRoute).toBeDefined();
  });

  test('should have GET /user/profile/:id route', () => {
    const getProfileRoute = userRouter.stack.find((layer: any) => 
      layer.route && layer.route.path === '/user/profile/:id' && layer.route.methods.get
    );
    expect(getProfileRoute).toBeDefined();
  });

  test('should have GET /users route', () => {
    const getAllRoute = userRouter.stack.find((layer: any) => 
      layer.route && layer.route.path === '/users' && layer.route.methods.get
    );
    expect(getAllRoute).toBeDefined();
  });

  test('should have POST /user/test-email route', () => {
    const testEmailRoute = userRouter.stack.find((layer: any) => 
      layer.route && layer.route.path === '/user/test-email' && layer.route.methods.post
    );
    expect(testEmailRoute).toBeDefined();
  });
});