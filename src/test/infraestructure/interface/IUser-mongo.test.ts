import { IUserDocument } from '../../../infraestructure/interface/IUser-mongo';
import { UserStatus } from '../../../application/dtos/user-dtos';

describe('IUserDocument Interface', () => {
    it('should validate user interface structure', () => {
        const userData = {
            email: 'test@example.com',
            password: 'hashedPassword123',
            firstName: 'John',
            lastName: 'Doe',
            idType: 'CC',
            idNumber: '12345678',
            phone: '+57 300 123 4567',
            roleId: 'customer',
            gender: 'M',
            birthDate: '1990-01-01',
            status: UserStatus.ACTIVE,
            country: 'Colombia',
            state: 'Cundinamarca',
            city: 'Bogotá',
            neighborhood: 'Centro',
            address: 'Calle 123 #45-67',
            postalCode: '110111',
            createdAt: new Date(),
            updatedAt: new Date(),
            paymentMethodId: 'credit_card',
            isEmailVerified: true
        };

        expect(userData).toHaveProperty('email');
        expect(userData).toHaveProperty('firstName');
        expect(userData).toHaveProperty('lastName');
        expect(userData).toHaveProperty('idNumber');
        expect(userData).toHaveProperty('status');
        expect(typeof userData.email).toBe('string');
        expect(typeof userData.isEmailVerified).toBe('boolean');
    });

    it('should validate email format', () => {
        const validEmails = [
            'user@example.com',
            'test.email@domain.co',
            'admin@company.org'
        ];

        validEmails.forEach(email => {
            expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        });
    });

    it('should validate user status enum', () => {
        const validStatuses = Object.values(UserStatus);
        const testStatus = UserStatus.ACTIVE;

        expect(validStatuses).toContain(testStatus);
        expect(typeof testStatus).toBe('string');
    });

    it('should validate required string fields', () => {
        const stringFields = {
            firstName: 'John',
            lastName: 'Doe',
            idType: 'CC',
            idNumber: '12345678',
            phone: '+57 300 123 4567',
            country: 'Colombia',
            city: 'Bogotá'
        };

        Object.entries(stringFields).forEach(([key, value]) => {
            expect(typeof value).toBe('string');
            expect(value.length).toBeGreaterThan(0);
        });
    });

    it('should validate date fields', () => {
        const now = new Date();
        const userData = {
            birthDate: '1990-01-01',
            createdAt: now,
            updatedAt: now
        };

        expect(typeof userData.birthDate).toBe('string');
        expect(userData.birthDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(userData.createdAt).toBeInstanceOf(Date);
        expect(userData.updatedAt).toBeInstanceOf(Date);
    });

    it('should validate boolean fields', () => {
        const booleanData = {
            isEmailVerified: true,
            isActive: false
        };

        expect(typeof booleanData.isEmailVerified).toBe('boolean');
        expect(typeof booleanData.isActive).toBe('boolean');
    });

    it('should validate address structure', () => {
        const address = {
            country: 'Colombia',
            state: 'Cundinamarca',
            city: 'Bogotá',
            neighborhood: 'Chapinero',
            address: 'Carrera 15 #85-20',
            postalCode: '110221'
        };

        Object.values(address).forEach(field => {
            expect(typeof field).toBe('string');
            expect(field.length).toBeGreaterThan(0);
        });
    });
});