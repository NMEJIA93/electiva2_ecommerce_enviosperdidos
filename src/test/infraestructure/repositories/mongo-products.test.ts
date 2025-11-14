import { MongoProductRepository } from '../../../infraestructure/repositories/mongo-products';

describe('MongoProductRepository', () => {
    let repository: MongoProductRepository;

    beforeEach(() => {
        repository = new MongoProductRepository();
    });

    describe('constructor', () => {
        it('should create instance of MongoProductRepository', () => {
            expect(repository).toBeInstanceOf(MongoProductRepository);
        });
    });

    describe('methods', () => {
        it('should have save method', () => {
            expect(typeof repository.save).toBe('function');
        });

        it('should have findAll method', () => {
            expect(typeof repository.findAll).toBe('function');
        });

        it('should have findById method', () => {
            expect(typeof repository.findById).toBe('function');
        });

        it('should have update method', () => {
            expect(typeof repository.update).toBe('function');
        });

        it('should have delete method', () => {
            expect(typeof repository.delete).toBe('function');
        });
    });
});