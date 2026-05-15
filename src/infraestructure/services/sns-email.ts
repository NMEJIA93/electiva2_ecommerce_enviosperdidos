import { PublishCommand } from '@aws-sdk/client-sns';
import { IEmailService, EmailResult } from '../../domain/services/email-services';
import { Order } from '../../domain/entities/Order';
import { snsClient } from '../config/sns-config';

export class SnsEmailService implements IEmailService {
    private readonly topicArn: string;

    constructor() {
        this.topicArn = process.env.AWS_SNS_TOPIC_ARN!;
    }

    async sendOrderConfirmationEmail(order: Order, userEmail: string): Promise<boolean> {
        try {
            const message = [
                `Confirmacion de pedido`,
                ``,
                `Pedido:      ${order.orderNumber}`,
                `Destinatario: ${userEmail}`,
                `Total:       $${order.total}`,
                ``,
                `Gracias por tu compra.`
            ].join('\n');

            await snsClient.send(new PublishCommand({
                TopicArn: this.topicArn,
                Subject: `Confirmacion de pedido ${order.orderNumber}`,
                Message: message
            }));

            console.log(`[SNS EMAIL] Order confirmation sent for order: ${order.orderNumber}`);
            return true;
        } catch (error) {
            console.error(`[SNS EMAIL] Error sending order confirmation: ${error}`);
            return false;
        }
    }

    async sendTestEmail(to: string, subject: string, message: string, html?: string): Promise<EmailResult> {
        try {
            const result = await snsClient.send(new PublishCommand({
                TopicArn: this.topicArn,
                Subject: subject,
                Message: `Para: ${to}\n\n${message}`
            }));

            console.log(`[SNS EMAIL] Test email sent. MessageId: ${result.MessageId}`);
            return {
                success: true,
                messageId: result.MessageId
            };
        } catch (error) {
            console.error(`[SNS EMAIL] Error sending test email: ${error}`);
            return {
                success: false,
                error: (error as Error).message
            };
        }
    }

    async sendVerificationCode(userEmail: string, userName: string, code: string): Promise<EmailResult> {
        try {
            const message = [
                `Hola ${userName},`,
                ``,
                `Tu codigo de verificacion es: ${code}`,
                ``,
                `Este codigo expira en 24 horas.`,
                `No compartas este codigo con nadie.`
            ].join('\n');

            const result = await snsClient.send(new PublishCommand({
                TopicArn: this.topicArn,
                Subject: `Codigo de verificacion`,
                Message: message
            }));

            console.log(`[SNS EMAIL] Verification code sent to ${userEmail}. MessageId: ${result.MessageId}`);
            return {
                success: true,
                messageId: result.MessageId
            };
        } catch (error) {
            console.error(`[SNS EMAIL] Error sending verification code: ${error}`);
            return {
                success: false,
                error: (error as Error).message
            };
        }
    }
}
