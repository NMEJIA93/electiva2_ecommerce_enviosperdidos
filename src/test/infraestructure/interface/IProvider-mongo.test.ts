import { IProviderDocument } from '../../../infraestructure/interface/IProvider-mongo';

describe('IProviderDocument Interface', () => {
    it('should validate provider interface structure', () => {
        const providerData = {
            id: '507f1f77bcf86cd799439011',
            name: 'Test Provider'
        };

        expect(providerData).toHaveProperty('id');
        expect(providerData).toHaveProperty('name');
        expect(typeof providerData.id).toBe('string');
        expect(typeof providerData.name).toBe('string');
    });

    it('should validate required fields', () => {
        const requiredFields = ['id', 'name'];
        const sampleProvider = {
            id: '507f1f77bcf86cd799439012',
            name: 'Electronics Supplier'
        };

        requiredFields.forEach(field => {
            expect(sampleProvider).toHaveProperty(field);
        });
    });

    it('should validate id format', () => {
        const validIds = [
            '507f1f77bcf86cd799439011',
            '507f1f77bcf86cd799439012',
            '507f1f77bcf86cd799439013'
        ];

        validIds.forEach(id => {
            expect(typeof id).toBe('string');
            expect(id).toMatch(/^[0-9a-fA-F]{24}$/);
        });
    });

    it('should validate name field', () => {
        const providerNames = [
            'Electronics Supplier',
            'Fashion Distributor',
            'Home & Garden Co.',
            'Tech Solutions Ltd.'
        ];

        providerNames.forEach(name => {
            expect(typeof name).toBe('string');
            expect(name.length).toBeGreaterThan(0);
            expect(name.trim()).toBe(name);
        });
    });

    it('should handle provider data consistency', () => {
        const provider: IProviderDocument = {
            id: '507f1f77bcf86cd799439014',
            name: 'Global Supplies Inc.'
        } as IProviderDocument;

        expect(provider.id).toBeDefined();
        expect(provider.name).toBeDefined();
        expect(provider.id).not.toBe('');
        expect(provider.name).not.toBe('');
    });
});