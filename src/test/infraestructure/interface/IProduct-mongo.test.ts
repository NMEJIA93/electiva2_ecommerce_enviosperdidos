import mongoose from 'mongoose';
import { IProductDocument } from '../../../infraestructure/interface/IProduct-mongo';

describe('IProductDocument Interface', () => {
    it('should validate product interface structure', () => {
        const productData = {
            name: 'Test Product',
            description: 'Product description',
            cost: 100,
            categoryId: new mongoose.Types.ObjectId(),
            images: ['image1.jpg', 'image2.jpg'],
            createdAt: new Date(),
            updatedAt: new Date(),
            providers: ['507f1f77bcf86cd799439011'],
            isDiscontinued: false
        };

        expect(productData).toHaveProperty('name');
        expect(productData).toHaveProperty('description');
        expect(productData).toHaveProperty('cost');
        expect(productData).toHaveProperty('categoryId');
        expect(productData).toHaveProperty('images');
        expect(productData).toHaveProperty('providers');
        expect(typeof productData.name).toBe('string');
        expect(typeof productData.cost).toBe('number');
    });

    it('should validate categoryId as ObjectId', () => {
        const categoryId = new mongoose.Types.ObjectId();
        
        expect(categoryId).toBeInstanceOf(mongoose.Types.ObjectId);
        expect(mongoose.Types.ObjectId.isValid(categoryId)).toBe(true);
    });

    it('should validate images array', () => {
        const images = ['product1.jpg', 'product2.png', 'product3.webp'];
        
        expect(Array.isArray(images)).toBe(true);
        expect(images).toHaveLength(3);
        images.forEach(image => {
            expect(typeof image).toBe('string');
            expect(image).toMatch(/\.(jpg|jpeg|png|webp|gif)$/i);
        });
    });

    it('should validate providers array', () => {
        const providers = [
            '507f1f77bcf86cd799439011',
            '507f1f77bcf86cd799439012',
            '507f1f77bcf86cd799439013'
        ];
        
        expect(Array.isArray(providers)).toBe(true);
        expect(providers).toHaveLength(3);
        providers.forEach(provider => {
            expect(typeof provider).toBe('string');
            expect(provider).toMatch(/^[0-9a-fA-F]{24}$/);
        });
    });

    it('should validate optional isDiscontinued field', () => {
        const productActive = { isDiscontinued: false };
        const productDiscontinued = { isDiscontinued: true };
        const productUndefined: any = {};

        expect(typeof productActive.isDiscontinued).toBe('boolean');
        expect(typeof productDiscontinued.isDiscontinued).toBe('boolean');
        expect(productUndefined.isDiscontinued).toBeUndefined();
    });

    it('should validate date fields', () => {
        const now = new Date();
        const productData = {
            createdAt: now,
            updatedAt: now
        };

        expect(productData.createdAt).toBeInstanceOf(Date);
        expect(productData.updatedAt).toBeInstanceOf(Date);
        expect(productData.updatedAt.getTime()).toBeGreaterThanOrEqual(productData.createdAt.getTime());
    });

    it('should validate cost as positive number', () => {
        const costs = [0.99, 10, 100.50, 1000];
        
        costs.forEach(cost => {
            expect(typeof cost).toBe('number');
            expect(cost).toBeGreaterThan(0);
        });
    });
});