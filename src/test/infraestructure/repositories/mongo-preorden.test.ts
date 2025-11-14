import { MongoPreorderRepository } from '../../../infraestructure/repositories/mongo-preorden';

describe('MongoPreorderRepository', () => {
    let repository: MongoPreorderRepository;

    beforeEach(() => {
        repository = new MongoPreorderRepository();
    });

    describe('constructor', () => {
        it('should create instance of MongoPreorderRepository', () => {
            expect(repository).toBeInstanceOf(MongoPreorderRepository);
        });
    });

    describe('methods', () => {
        it('should have save method', () => {
            expect(typeof repository.save).toBe('function');
        });

        it('should have findById method', () => {
            expect(typeof repository.findById).toBe('function');
        });

        it('should have update method', () => {
            expect(typeof repository.update).toBe('function');
        });
    });
});