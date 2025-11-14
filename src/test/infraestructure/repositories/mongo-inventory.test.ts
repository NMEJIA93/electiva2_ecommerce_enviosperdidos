import { MongoInventoryRepository } from '../../../infraestructure/repositories/mongo-inventory';

describe('MongoInventoryRepository', () => {
    let repository: MongoInventoryRepository;

    beforeEach(() => {
        repository = new MongoInventoryRepository();
    });

    describe('constructor', () => {
        it('should create instance of MongoInventoryRepository', () => {
            expect(repository).toBeInstanceOf(MongoInventoryRepository);
        });
    });

    describe('methods', () => {
        it('should have update method', () => {
            expect(typeof repository.update).toBe('function');
        });

        it('should have updateReservedStock method', () => {
            expect(typeof repository.updateReservedStock).toBe('function');
        });

        it('should have getInventoryById method', () => {
            expect(typeof repository.getInventoryById).toBe('function');
        });

        it('should have getInventoryByProductId method', () => {
            expect(typeof repository.getInventoryByProductId).toBe('function');
        });
    });
});