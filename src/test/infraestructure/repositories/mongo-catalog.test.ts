import { MongoCatalogRepository } from '../../../infraestructure/repositories/mongo-catalog';

describe('MongoCatalogRepository', () => {
    let repository: MongoCatalogRepository;

    beforeEach(() => {
        repository = new MongoCatalogRepository();
    });

    describe('constructor', () => {
        it('should create instance of MongoCatalogRepository', () => {
            expect(repository).toBeInstanceOf(MongoCatalogRepository);
        });
    });

    describe('getCatalog method', () => {
        it('should have getCatalog method', () => {
            expect(typeof repository.getCatalog).toBe('function');
        });

        it('should return a promise', () => {
            const result = repository.getCatalog();
            expect(result).toBeInstanceOf(Promise);
        });
    });
});