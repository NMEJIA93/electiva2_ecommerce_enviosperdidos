export type NotificationEvent = {
  type: string;
  payload: any;
};

export type NotificationHandler = (event: NotificationEvent) => Promise<void> | void;

class NotificationDispatcher {
  private handlers: NotificationHandler[] = [];

  register(handler: NotificationHandler) {
    this.handlers.push(handler);
  }

  async dispatch(event: NotificationEvent) {
    for (const h of this.handlers) {
      try {
        await Promise.resolve(h(event));
      } catch (err) {
        // no detener el dispatch por un handler que falle
        console.error('[NOTIFICATION DISPATCHER] handler error', err);
      }
    }
  }
}

export const notificationDispatcher = new NotificationDispatcher();

export default notificationDispatcher;
