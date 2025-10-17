import { transporter } from '../config/nodemailer-config';
import { IEmailService, EmailResult } from '../../domain/services/email-services';
import { Order } from '../../domain/entities/Order';

export class NodemailerEmailService implements IEmailService {
    async sendOrderConfirmationEmail(order: Order, userEmail: string): Promise<boolean> {
        try {
            await transporter.sendMail({
                from: `"Ecommerce" <${process.env.SMTP_USER}>`,
                to: userEmail,
                subject: `Confirmación de pedido ${order.orderNumber}`,
                text: `Gracias por tu compra. Total: $${order.total}`,
                html: `<b>Gracias por tu compra</b><br/>Pedido: ${order.orderNumber}<br/>Total: $${order.total}`
            });
            return true;
        } catch (error) {
            console.error(`[EMAIL SERVICE] - Error sending order confirmation email: ${error}`);
            return false;
        }
    }

    async sendTestEmail(to: string, subject: string, message: string, html?: string): Promise<EmailResult> {
        try {
            const info = await transporter.sendMail({
                from: `"Ecommerce Test" <${process.env.SMTP_USER}>`,
                to: to,
                subject: subject,
                text: message,
                html: html || `<p>${message}</p>`
            });
            
            console.log(`[EMAIL SERVICE] - Test email sent successfully. MessageId: ${info.messageId}`);
            return {
                success: true,
                messageId: info.messageId
            };
        } catch (error) {
            console.error(`[EMAIL SERVICE] - Error sending test email: ${error}`);
            return {
                success: false,
                error: (error as Error).message
            };
        }
    }

    async sendVerificationCode(userEmail: string, userName: string, code: string): Promise<EmailResult> {
        try {
            const info = await transporter.sendMail({
                from: `"Ecommerce" <${process.env.SMTP_USER}>`,
                to: userEmail,
                subject: `Código de verificación para ${userName}`,
                text: `Tu código de verificación es: ${code}`,
                html: `<b>Tu código de verificación es:</b><br/>${code}`
            });
            
            console.log(`[EMAIL SERVICE] - Verification code sent successfully. MessageId: ${info.messageId}`);
            return {
                success: true,
                messageId: info.messageId
            };
        } catch (error) {
            console.error(`[EMAIL SERVICE] - Error sending verification code: ${error}`);
            return {
                success: false,
                error: (error as Error).message
            };
        }
    }
    
}