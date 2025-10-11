import { Order } from "../entities/Order";

/**
 * Email notification service for order confirmations
 * This is a placeholder implementation - in production, integrate with actual email service
 */

export interface IEmailService {
    sendOrderConfirmationEmail(order: Order, userEmail: string): Promise<boolean>;
}

export class EmailService implements IEmailService {
    async sendOrderConfirmationEmail(order: Order, userEmail: string): Promise<boolean> {
        try {
            // TODO: Integrate with actual email service (SendGrid, AWS SES, etc.)
            console.log(`[EMAIL SERVICE] - Sending order confirmation email to: ${userEmail}`);
            console.log(`[EMAIL SERVICE] - Order Number: ${order.orderNumber}`);
            console.log(`[EMAIL SERVICE] - Order Total: $${order.total}`);
            
            // Simulate email sending
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // In production, this would be:
            // const emailResult = await emailProvider.send({
            //     to: userEmail,
            //     subject: `Order Confirmation - ${order.orderNumber}`,
            //     template: 'order-confirmation',
            //     data: {
            //         orderNumber: order.orderNumber,
            //         total: order.total,
            //         products: order.products,
            //         shippingAddress: order.shippingAddress
            //     }
            // });
            
            console.log(`[EMAIL SERVICE] - Order confirmation email sent successfully for order: ${order.orderNumber}`);
            return true;
        } catch (error) {
            console.error(`[EMAIL SERVICE] - Error sending order confirmation email: ${error}`);
            return false;
        }
    }
}

/**
 * Mock email service for testing
 */
export class MockEmailService implements IEmailService {
    async sendOrderConfirmationEmail(order: Order, userEmail: string): Promise<boolean> {
        console.log(`[MOCK EMAIL] - Would send order confirmation to: ${userEmail} for order: ${order.orderNumber}`);
        return true;
    }
}
