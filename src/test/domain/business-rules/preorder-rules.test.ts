import { validateshippingAddress, isFreeShipping } from '../../../domain/business-rules/preorder-rules';

describe('Preorder Business Rules', () => {
    describe('validateshippingAddress', () => {
        const validAddress = {
            country: 'Colombia',
            state: 'Antioquia',
            city: 'Medellin',
            neighborhood: 'Poblado',
            address: 'Calle 123 #45-67',
            postalCode: '050001'
        };

        it('should validate correct shipping address', () => {
            expect(() => validateshippingAddress(validAddress)).not.toThrow();
        });

        it('should throw error when country is missing', () => {
            const invalidAddress = { ...validAddress, country: '' };
            expect(() => validateshippingAddress(invalidAddress))
                .toThrow("El campo 'country' de la dirección de envío es obligatorio");
        });

        it('should throw error when state is missing', () => {
            const invalidAddress = { ...validAddress, state: '' };
            expect(() => validateshippingAddress(invalidAddress))
                .toThrow("El campo 'state' de la dirección de envío es obligatorio");
        });

        it('should throw error when city is missing', () => {
            const invalidAddress = { ...validAddress, city: '' };
            expect(() => validateshippingAddress(invalidAddress))
                .toThrow("El campo 'city' de la dirección de envío es obligatorio");
        });

        it('should throw error when neighborhood is missing', () => {
            const invalidAddress = { ...validAddress, neighborhood: '' };
            expect(() => validateshippingAddress(invalidAddress))
                .toThrow("El campo 'neighborhood' de la dirección de envío es obligatorio");
        });

        it('should throw error when address is missing', () => {
            const invalidAddress = { ...validAddress, address: '' };
            expect(() => validateshippingAddress(invalidAddress))
                .toThrow("El campo 'address' de la dirección de envío es obligatorio");
        });

        it('should throw error when postalCode is missing', () => {
            const invalidAddress = { ...validAddress, postalCode: '' };
            expect(() => validateshippingAddress(invalidAddress))
                .toThrow("El campo 'postalCode' de la dirección de envío es obligatorio");
        });

        it('should throw error when postalCode is too short', () => {
            const invalidAddress = { ...validAddress, postalCode: '123' };
            expect(() => validateshippingAddress(invalidAddress))
                .toThrow('El código postal debe tener al menos 5 caracteres');
        });

        it('should throw error when field is not a string', () => {
            const invalidAddress = { ...validAddress, country: null };
            expect(() => validateshippingAddress(invalidAddress))
                .toThrow("El campo 'country' de la dirección de envío es obligatorio");
        });

        it('should throw error when field is only whitespace', () => {
            const invalidAddress = { ...validAddress, city: '   ' };
            expect(() => validateshippingAddress(invalidAddress))
                .toThrow("El campo 'city' de la dirección de envío es obligatorio");
        });
    });

    describe('isFreeShipping', () => {
        it('should return true for orders over 50000 COP', () => {
            expect(isFreeShipping(50000)).toBe(true);
            expect(isFreeShipping(75000)).toBe(true);
            expect(isFreeShipping(100000)).toBe(true);
        });

        it('should return true for orders exactly 50000 COP', () => {
            expect(isFreeShipping(50000)).toBe(true);
        });

        it('should return false for orders under 50000 COP', () => {
            expect(isFreeShipping(49999)).toBe(false);
            expect(isFreeShipping(25000)).toBe(false);
            expect(isFreeShipping(10000)).toBe(false);
        });

        it('should return false for zero amount', () => {
            expect(isFreeShipping(0)).toBe(false);
        });

        it('should return false for negative amounts', () => {
            expect(isFreeShipping(-1000)).toBe(false);
        });
    });
});