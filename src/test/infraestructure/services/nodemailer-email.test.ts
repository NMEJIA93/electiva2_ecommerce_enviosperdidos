// src/test/infraestructure/services/nodemailer-email.test.ts

import { NodemailerEmailService } from '../../../infraestructure/services/nodemailer-email';
import { Order } from '../../../domain/entities/Order';
import { IOrder, OrderStatus } from '../../../domain/models/interfaces/IOrder';

// Mock the nodemailer config
jest.mock('../../../infraestructure/config/nodemailer-config', () => ({
    transporter: {
        sendMail: jest.fn()
    }
}));

// Mock console methods
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

describe('NodemailerEmailService', () => {
    let emailService: NodemailerEmailService;
    let mockTransporter: any;

    beforeEach(() => {
        emailService = new NodemailerEmailService();
        mockTransporter = require('../../../infraestructure/config/nodemailer-config').transporter;
        jest.clearAllMocks();
    });

    afterAll(() => {
        mockConsoleLog.mockRestore();
        mockConsoleError.mockRestore();
    });

    describe('sendOrderConfirmationEmail', () => {
        it('should send order confirmation email successfully', async () => {
            const orderData: IOrder = {
                orderNumber: 'ORD-001',
                preorderId: 'preorder1',
                userId: 'user1',
                products: [],
                shippingAddress: {
                    country: 'Colombia',
                    state: 'Cundinamarca',
                    city: 'Bogotá',
                    neighborhood: 'Centro',
                    address: 'Calle 123 #45-67',
                    postalCode: '110111'
                },
                paymentMethod: 'credit_card',
                shippingCost: 10.00,
                total: 150.00,
                status: OrderStatus.CONFIRMED,
                createdAt: new Date(),
                updatedAt: new Date(),
                emailSent: false
            };

            const order = new Order(orderData);
            const userEmail = 'test@example.com';

            mockTransporter.sendMail.mockResolvedValue({ messageId: 'test-message-id' });

            const result = await emailService.sendOrderConfirmationEmail(order, userEmail);

            expect(result).toBe(true);
            expect(mockTransporter.sendMail).toHaveBeenCalledWith({
                from: `"Ecommerce" <${process.env.SMTP_USER}>`,
                to: userEmail,
                subject: `Confirmación de pedido ${order.orderNumber}`,
                text: `Gracias por tu compra. Total: $${order.total}`,
                html: `<b>Gracias por tu compra</b><br/>Pedido: ${order.orderNumber}<br/>Total: $${order.total}`
            });
        });

        it('should handle email sending error', async () => {
            const orderData: IOrder = {
                orderNumber: 'ORD-001',
                preorderId: 'preorder1',
                userId: 'user1',
                products: [],
                shippingAddress: {
                    country: 'Colombia',
                    state: 'Cundinamarca',
                    city: 'Bogotá',
                    neighborhood: 'Centro',
                    address: 'Calle 123 #45-67',
                    postalCode: '110111'
                },
                paymentMethod: 'credit_card',
                shippingCost: 10.00,
                total: 150.00,
                status: OrderStatus.CONFIRMED,
                createdAt: new Date(),
                updatedAt: new Date(),
                emailSent: false
            };

            const order = new Order(orderData);
            const userEmail = 'test@example.com';
            const error = new Error('SMTP Error');

            mockTransporter.sendMail.mockRejectedValue(error);

            const result = await emailService.sendOrderConfirmationEmail(order, userEmail);

            expect(result).toBe(false);
            expect(mockConsoleError).toHaveBeenCalledWith(
                '[EMAIL SERVICE] - Error sending order confirmation email: Error: SMTP Error'
            );
        });
    });

    describe('sendTestEmail', () => {
        it('should send test email successfully', async () => {
            const to = 'test@example.com';
            const subject = 'Test Subject';
            const message = 'Test Message';
            const html = '<p>Test HTML</p>';

            mockTransporter.sendMail.mockResolvedValue({ messageId: 'test-message-id' });

            const result = await emailService.sendTestEmail(to, subject, message, html);

            expect(result).toEqual({
                success: true,
                messageId: 'test-message-id'
            });

            expect(mockTransporter.sendMail).toHaveBeenCalledWith({
                from: `"Ecommerce Test" <${process.env.SMTP_USER}>`,
                to: to,
                subject: subject,
                text: message,
                html: html
            });

            expect(mockConsoleLog).toHaveBeenCalledWith(
                '[EMAIL SERVICE] - Test email sent successfully. MessageId: test-message-id'
            );
        });

        it('should send test email with default HTML', async () => {
            const to = 'test@example.com';
            const subject = 'Test Subject';
            const message = 'Test Message';

            mockTransporter.sendMail.mockResolvedValue({ messageId: 'test-message-id' });

            const result = await emailService.sendTestEmail(to, subject, message);

            expect(result.success).toBe(true);
            expect(mockTransporter.sendMail).toHaveBeenCalledWith({
                from: `"Ecommerce Test" <${process.env.SMTP_USER}>`,
                to: to,
                subject: subject,
                text: message,
                html: `<p>${message}</p>`
            });
        });

        it('should handle test email sending error', async () => {
            const to = 'test@example.com';
            const subject = 'Test Subject';
            const message = 'Test Message';
            const error = new Error('SMTP Error');

            mockTransporter.sendMail.mockRejectedValue(error);

            const result = await emailService.sendTestEmail(to, subject, message);

            expect(result).toEqual({
                success: false,
                error: 'SMTP Error'
            });

            expect(mockConsoleError).toHaveBeenCalledWith(
                '[EMAIL SERVICE] - Error sending test email: Error: SMTP Error'
            );
        });
    });

    describe('sendVerificationCode', () => {
        it('should send verification code email successfully', async () => {
            const userEmail = 'test@example.com';
            const userName = 'Test User';
            const code = '123456';

            mockTransporter.sendMail.mockResolvedValue({ messageId: 'verification-message-id' });

            const result = await emailService.sendVerificationCode(userEmail, userName, code);

            expect(result).toEqual({
                success: true,
                messageId: 'verification-message-id'
            });

            expect(mockTransporter.sendMail).toHaveBeenCalledWith({
                from: `"Ecommerce" <${process.env.SMTP_USER}>`,
                to: userEmail,
                subject: `Código de verificación para ${userName}`,
                text: `Tu código de verificación es: ${code}`,
                html: `<b>Tu código de verificación es:</b><br/>${code}`
            });
        });

        it('should handle verification code email error', async () => {
            const userEmail = 'test@example.com';
            const userName = 'Test User';
            const code = '123456';
            const error = new Error('SMTP Error');

            mockTransporter.sendMail.mockRejectedValue(error);

            const result = await emailService.sendVerificationCode(userEmail, userName, code);

            expect(result).toEqual({
                success: false,
                error: 'SMTP Error'
            });

            expect(mockConsoleError).toHaveBeenCalledWith(
                '[EMAIL SERVICE] - Error sending verification code: Error: SMTP Error'
            );
        });
    });
});
