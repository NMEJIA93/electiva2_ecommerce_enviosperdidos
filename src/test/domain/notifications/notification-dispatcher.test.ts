import notificationDispatcher, { NotificationEvent, NotificationHandler } from '../../../domain/notifications/notification-dispatcher';

describe('NotificationDispatcher', () => {
  beforeEach(() => {
    // Clear handlers before each test
    (notificationDispatcher as any).handlers = [];
  });

  test('should register handlers', () => {
    const handler: NotificationHandler = jest.fn();
    
    notificationDispatcher.register(handler);
    
    expect((notificationDispatcher as any).handlers).toHaveLength(1);
    expect((notificationDispatcher as any).handlers[0]).toBe(handler);
  });

  test('should dispatch event to registered handlers', async () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const event: NotificationEvent = { type: 'test', payload: { data: 'test' } };

    notificationDispatcher.register(handler1);
    notificationDispatcher.register(handler2);

    await notificationDispatcher.dispatch(event);

    expect(handler1).toHaveBeenCalledWith(event);
    expect(handler2).toHaveBeenCalledWith(event);
  });

  test('should handle async handlers', async () => {
    const asyncHandler = jest.fn().mockResolvedValue(undefined);
    const event: NotificationEvent = { type: 'async', payload: {} };

    notificationDispatcher.register(asyncHandler);

    await notificationDispatcher.dispatch(event);

    expect(asyncHandler).toHaveBeenCalledWith(event);
  });

  test('should continue dispatching even if one handler fails', async () => {
    const failingHandler = jest.fn().mockRejectedValue(new Error('Handler failed'));
    const successHandler = jest.fn();
    const event: NotificationEvent = { type: 'error', payload: {} };

    notificationDispatcher.register(failingHandler);
    notificationDispatcher.register(successHandler);

    await notificationDispatcher.dispatch(event);

    expect(failingHandler).toHaveBeenCalledWith(event);
    expect(successHandler).toHaveBeenCalledWith(event);
  });

  test('should handle multiple events', async () => {
    const handler = jest.fn();
    const event1: NotificationEvent = { type: 'event1', payload: { id: 1 } };
    const event2: NotificationEvent = { type: 'event2', payload: { id: 2 } };

    notificationDispatcher.register(handler);

    await notificationDispatcher.dispatch(event1);
    await notificationDispatcher.dispatch(event2);

    expect(handler).toHaveBeenCalledTimes(2);
    expect(handler).toHaveBeenNthCalledWith(1, event1);
    expect(handler).toHaveBeenNthCalledWith(2, event2);
  });

  test('should work with no handlers registered', async () => {
    const event: NotificationEvent = { type: 'empty', payload: {} };

    await expect(notificationDispatcher.dispatch(event)).resolves.toBeUndefined();
  });
});
