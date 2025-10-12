import { Order } from "../entities/Order";

export interface EmailResult {
    success: boolean;
    messageId?: string;
    error?: string;
}

export interface IEmailService {
    sendOrderConfirmationEmail(order: Order, userEmail: string): Promise<boolean>;
    sendTestEmail(to: string, subject: string, message: string, html?: string): Promise<EmailResult>;
}


export class MockEmailService implements IEmailService {
    async sendOrderConfirmationEmail(order: Order, userEmail: string): Promise<boolean> {
        console.log(`[MOCK EMAIL] - Would send order confirmation to: ${userEmail} for order: ${order.orderNumber}`);
        return true;
    }

    async sendTestEmail(to: string, subject: string, message: string, html?: string): Promise<EmailResult> {
        console.log(`[MOCK EMAIL] - Would send test email to: ${to}, subject: ${subject}`);
        return {
            success: true,
            messageId: `mock-${Date.now()}`
        };
    }
}
