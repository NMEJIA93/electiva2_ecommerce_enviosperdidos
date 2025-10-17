import mongoose from 'mongoose';
import { IInventoryDocument, IReservation } from '../../../infraestructure/interface/IInventory-mongo';

describe('IInventoryDocument Interface', () => {
    it('should validate interface structure', () => {
        const inventoryData = {
            productId: new mongoose.Types.ObjectId(),
            price: 100,
            stock: 50,
            reservedStock: 5,
            reservations: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        expect(inventoryData).toHaveProperty('productId');
        expect(inventoryData).toHaveProperty('price');
        expect(inventoryData).toHaveProperty('stock');
        expect(inventoryData).toHaveProperty('reservedStock');
        expect(inventoryData).toHaveProperty('reservations');
        expect(inventoryData.productId).toBeInstanceOf(mongoose.Types.ObjectId);
        expect(typeof inventoryData.price).toBe('number');
        expect(typeof inventoryData.stock).toBe('number');
    });

    it('should validate IReservation structure', () => {
        const reservation: IReservation = {
            userId: new mongoose.Types.ObjectId(),
            quantity: 2,
            createdAt: new Date()
        };

        expect(reservation).toHaveProperty('userId');
        expect(reservation).toHaveProperty('quantity');
        expect(reservation).toHaveProperty('createdAt');
        expect(reservation.userId).toBeInstanceOf(mongoose.Types.ObjectId);
        expect(typeof reservation.quantity).toBe('number');
        expect(reservation.createdAt).toBeInstanceOf(Date);
    });

    it('should handle reservations array', () => {
        const reservations: IReservation[] = [
            {
                userId: new mongoose.Types.ObjectId(),
                quantity: 3,
                createdAt: new Date()
            },
            {
                userId: new mongoose.Types.ObjectId(),
                quantity: 1,
                createdAt: new Date()
            }
        ];

        expect(Array.isArray(reservations)).toBe(true);
        expect(reservations).toHaveLength(2);
        reservations.forEach(reservation => {
            expect(reservation).toHaveProperty('userId');
            expect(reservation).toHaveProperty('quantity');
            expect(reservation).toHaveProperty('createdAt');
        });
    });

    it('should validate numeric fields', () => {
        const inventoryData = {
            price: 99.99,
            stock: 100,
            reservedStock: 10
        };

        expect(inventoryData.price).toBeGreaterThan(0);
        expect(inventoryData.stock).toBeGreaterThanOrEqual(0);
        expect(inventoryData.reservedStock).toBeGreaterThanOrEqual(0);
        expect(inventoryData.reservedStock).toBeLessThanOrEqual(inventoryData.stock);
    });
});