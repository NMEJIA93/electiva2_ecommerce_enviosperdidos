import { MongoLoginRepository } from '../../../infraestructure/repositories/mongo-login';

describe('MongoLoginRepository', () => {
    let repository: MongoLoginRepository;

    beforeEach(() => {
        repository = new MongoLoginRepository();
    });

    describe('constructor', () => {
        it('should create instance of MongoLoginRepository', () => {
            expect(repository).toBeInstanceOf(MongoLoginRepository);
        });
    });

    describe('methods', () => {
        it('should have getByIdNumber method', () => {
            expect(typeof repository.getByIdNumber).toBe('function');
        });

        it('should have setToken method', () => {
            expect(typeof repository.setToken).toBe('function');
        });

        it('should have incrementRetries method', () => {
            expect(typeof repository.incrementRetries).toBe('function');
        });

        it('should have resetRetries method', () => {
            expect(typeof repository.resetRetries).toBe('function');
        });
    });
});