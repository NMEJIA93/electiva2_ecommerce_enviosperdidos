import { MongoTrackingRepository } from '../../../infraestructure/repositories/mongo-tracking';

describe('MongoTrackingRepository', () => {
    let repository: MongoTrackingRepository;

    beforeEach(() => {
        repository = new MongoTrackingRepository();
    });

    describe('constructor', () => {
        it('should create instance of MongoTrackingRepository', () => {
            expect(repository).toBeInstanceOf(MongoTrackingRepository);
        });
    });

    describe('methods', () => {
        it('should have createTracking method', () => {
            expect(typeof repository.createTracking).toBe('function');
        });

        it('should have getTrackingByOrderNumber method', () => {
            expect(typeof repository.getTrackingByOrderNumber).toBe('function');
        });

        it('should have updateTrackingStatus method', () => {
            expect(typeof repository.updateTrackingStatus).toBe('function');
        });

        it('should have addNotification method', () => {
            expect(typeof repository.addNotification).toBe('function');
        });
    });
});