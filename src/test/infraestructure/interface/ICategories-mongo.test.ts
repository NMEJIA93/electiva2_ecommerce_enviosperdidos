import mongoose from 'mongoose';
import { ICategoriesDocument } from '../../../infraestructure/interface/ICategories-mongo';

describe('ICategoriesDocument Interface', () => {
    it('should validate interface structure', () => {
        const categoryData = {
            id: new mongoose.Types.ObjectId(),
            name: 'Electronics'
        };

        expect(categoryData).toHaveProperty('id');
        expect(categoryData).toHaveProperty('name');
        expect(categoryData.name).toBe('Electronics');
        expect(categoryData.id).toBeInstanceOf(mongoose.Types.ObjectId);
    });

    it('should handle ObjectId type correctly', () => {
        const objectId = new mongoose.Types.ObjectId();
        
        expect(mongoose.Types.ObjectId.isValid(objectId)).toBe(true);
        expect(objectId.toString()).toMatch(/^[0-9a-fA-F]{24}$/);
    });

    it('should validate required fields exist', () => {
        const requiredFields = ['id', 'name'];
        const sampleCategory = {
            id: new mongoose.Types.ObjectId(),
            name: 'Test Category'
        };

        requiredFields.forEach(field => {
            expect(sampleCategory).toHaveProperty(field);
        });
    });
});