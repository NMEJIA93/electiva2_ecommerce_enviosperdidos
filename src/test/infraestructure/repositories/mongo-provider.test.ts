import { MongoProviderReposiitory } from '../../../infraestructure/repositories/mongo-provider';

describe('MongoProviderReposiitory', () => {
    let repository: MongoProviderReposiitory;

    beforeEach(() => {
        repository = new MongoProviderReposiitory();
    });

    describe('constructor', () => {
        it('should create instance of MongoProviderReposiitory', () => {
            expect(repository).toBeInstanceOf(MongoProviderReposiitory);
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