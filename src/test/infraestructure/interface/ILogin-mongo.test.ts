import { ILoginDocument } from '../../../infraestructure/interface/ILogin-mongo';

describe('ILoginDocument Interface', () => {
    it('should validate interface structure', () => {
        const loginData: ILoginDocument = {
            idNumber: '12345678',
            token: 'jwt-token-example',
            retries: 0,
            updatedAt: new Date(),
            createdAt: new Date(),
            email: 'test@example.com'
        };

        expect(loginData).toHaveProperty('idNumber');
        expect(loginData).toHaveProperty('retries');
        expect(typeof loginData.idNumber).toBe('string');
        expect(typeof loginData.retries).toBe('number');
    });

    it('should handle optional fields', () => {
        const minimalLogin: ILoginDocument = {
            idNumber: '87654321',
            retries: 1
        };

        expect(minimalLogin).toHaveProperty('idNumber');
        expect(minimalLogin).toHaveProperty('retries');
        expect(minimalLogin.token).toBeUndefined();
        expect(minimalLogin.email).toBeUndefined();
    });

    it('should validate retries counter', () => {
        const loginAttempts = [
            { idNumber: '123', retries: 0 },
            { idNumber: '456', retries: 3 },
            { idNumber: '789', retries: 5 }
        ];

        loginAttempts.forEach(attempt => {
            expect(attempt.retries).toBeGreaterThanOrEqual(0);
            expect(typeof attempt.retries).toBe('number');
        });
    });

    it('should validate date fields', () => {
        const loginData: ILoginDocument = {
            idNumber: '11111111',
            retries: 2,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        if (loginData.createdAt) {
            expect(loginData.createdAt).toBeInstanceOf(Date);
        }
        if (loginData.updatedAt) {
            expect(loginData.updatedAt).toBeInstanceOf(Date);
        }
    });

    it('should validate email format when present', () => {
        const loginWithEmail: ILoginDocument = {
            idNumber: '99999999',
            retries: 0,
            email: 'user@domain.com'
        };

        if (loginWithEmail.email) {
            expect(loginWithEmail.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        }
    });
});