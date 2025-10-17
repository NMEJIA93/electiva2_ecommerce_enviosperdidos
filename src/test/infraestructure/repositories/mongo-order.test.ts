import { MongoOrderRepository } from '../../../infraestructure/repositories/mongo-order';

describe('MongoOrderRepository', () => {
    let repository: MongoOrderRepository;

    beforeEach(() => {
        repository = new MongoOrderRepository();
    });

    describe('constructor', () => {
        it('should create instance of MongoOrderRepository', () => {
            expect(repository).toBeInstanceOf(MongoOrderRepository);
        });
    });

    describe('methods', () => {
        it('should have save method', () => {
            expect(typeof repository.save).toBe('function');
        });

        it('should have findById method', () => {
            expect(typeof repository.findById).toBe('function');
        });

        it('should have findByOrderNumber method', () => {
            expect(typeof repository.findByOrderNumber).toBe('function');
        });

        it('should have findByPreorderId method', () => {
            expect(typeof repository.findByPreorderId).toBe('function');
        });

        it('should have findByUserId method', () => {
            expect(typeof repository.findByUserId).toBe('function');
        });

        it('should have update method', () => {
            expect(typeof repository.update).toBe('function');
        });

        it('should have delete method', () => {
            expect(typeof repository.delete).toBe('function');
        });

        it('should have findAll method', () => {
            expect(typeof repository.findAll).toBe('function');
        });
    });
});