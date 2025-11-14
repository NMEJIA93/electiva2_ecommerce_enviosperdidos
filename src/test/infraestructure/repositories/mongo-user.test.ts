import { MongoUserRepository } from '../../../infraestructure/repositories/mongo-user';

describe('MongoUserRepository', () => {
    let repository: MongoUserRepository;

    beforeEach(() => {
        repository = new MongoUserRepository();
    });

    describe('constructor', () => {
        it('should create instance of MongoUserRepository', () => {
            expect(repository).toBeInstanceOf(MongoUserRepository);
        });
    });

    describe('methods', () => {
        it('should have save method', () => {
            expect(typeof repository.save).toBe('function');
        });

        it('should have update method', () => {
            expect(typeof repository.update).toBe('function');
        });

        it('should have findByEmail method', () => {
            expect(typeof repository.findByEmail).toBe('function');
        });

        it('should have findById method', () => {
            expect(typeof repository.findById).toBe('function');
        });

        it('should have findAll method', () => {
            expect(typeof repository.findAll).toBe('function');
        });

        it('should have saveVerificationCode method', () => {
            expect(typeof repository.saveVerificationCode).toBe('function');
        });

        it('should have getVerificationCode method', () => {
            expect(typeof repository.getVerificationCode).toBe('function');
        });

        it('should have deleteVerificationCode method', () => {
            expect(typeof repository.deleteVerificationCode).toBe('function');
        });

        it('should have hasVerificationCode method', () => {
            expect(typeof repository.hasVerificationCode).toBe('function');
        });
    });
});