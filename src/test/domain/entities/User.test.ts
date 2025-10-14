// src/test/domain/entities/User.test.ts

import { User } from '../../../domain/entities/User';
import { IUsers } from '../../../domain/models/interfaces/IUsers';
import { UserStatus } from '../../../application/dtos/user-dtos';

describe('User Entity', () => {

    // ========================================================================
    // Constructor Tests - Complete User Data
    // ========================================================================
    describe('Given complete user data', () => {
        describe('When creating a User instance', () => {
            it('should create user with all properties correctly assigned', () => {
                // Arrange
                const userData: IUsers = {
                    _id: '123-456-789',
                    email: 'john.doe@example.com',
                    password: 'hashedPassword123',
                    firstName: 'John',
                    lastName: 'Doe',
                    idType: 'cc',
                    idNumber: '1234567890',
                    phone: '+57 300 1234567',
                    roleId: 'USER',
                    gender: 'M',
                    birthDate: '1990-05-15',
                    status: UserStatus.ACTIVE,
                    country: 'Colombia',
                    state: 'Antioquia',
                    city: 'Medellín',
                    neighborhood: 'El Poblado',
                    address: 'Calle 10 #20-30, Apto 501',
                    postalCode: '050021',
                    createdAt: new Date('2024-01-01T10:00:00'),
                    updatedAt: new Date('2024-01-15T15:30:00'),
                    paymentMethodId: 'payment-method-123',
                    isEmailVerified: true
                };

                // Act
                const user = new User(userData);

                // Assert - Verify all properties
                expect(user._id).toBe('123-456-789');
                expect(user.email).toBe('john.doe@example.com');
                expect(user.password).toBe('hashedPassword123');
                expect(user.firstName).toBe('John');
                expect(user.lastName).toBe('Doe');
                expect(user.idType).toBe('cc');
                expect(user.idNumber).toBe('1234567890');
                expect(user.phone).toBe('+57 300 1234567');
                expect(user.roleId).toBe('USER');
                expect(user.gender).toBe('M');
                expect(user.birthDate).toBe('1990-05-15');
                expect(user.status).toBe(UserStatus.ACTIVE);
                expect(user.country).toBe('Colombia');
                expect(user.state).toBe('Antioquia');
                expect(user.city).toBe('Medellín');
                expect(user.neighborhood).toBe('El Poblado');
                expect(user.address).toBe('Calle 10 #20-30, Apto 501');
                expect(user.postalCode).toBe('050021');
                expect(user.createdAt).toEqual(new Date('2024-01-01T10:00:00'));
                expect(user.updatedAt).toEqual(new Date('2024-01-15T15:30:00'));
                expect(user.paymentMethodId).toBe('payment-method-123');
                expect(user.isEmailVerified).toBe(true);
            });

            it('should be an instance of User class', () => {
                // Arrange
                const userData: IUsers = {
                    email: 'test@example.com',
                    password: 'password',
                    firstName: 'Test',
                    lastName: 'User',
                    idType: 'cc',
                    idNumber: '123',
                    phone: '300',
                    roleId: 'USER',
                    gender: '',
                    birthDate: '',
                    status: UserStatus.ACTIVE,
                    country: '',
                    state: '',
                    city: '',
                    neighborhood: '',
                    address: '',
                    postalCode: '',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    paymentMethodId: '',
                    isEmailVerified: false
                };

                // Act
                const user = new User(userData);

                // Assert
                expect(user).toBeInstanceOf(User);
            });
        });
    });

    // ========================================================================
    // Constructor Tests - Minimal Required Data
    // ========================================================================
    describe('Given minimal required user data', () => {
        describe('When creating a User with only required fields', () => {
            it('should create user successfully', () => {
                // Arrange
                const minimalData: IUsers = {
                    email: 'minimal@example.com',
                    password: 'minimalPassword',
                    firstName: 'Min',
                    lastName: 'User',
                    idType: 'ce',
                    idNumber: '999888777',
                    phone: '3009998877',
                    roleId: 'USER',
                    gender: '',
                    birthDate: '',
                    status: UserStatus.ACTIVE,
                    country: '',
                    state: '',
                    city: '',
                    neighborhood: '',
                    address: '',
                    postalCode: '',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    paymentMethodId: '',
                    isEmailVerified: false
                };

                // Act
                const user = new User(minimalData);

                // Assert
                expect(user.email).toBe('minimal@example.com');
                expect(user.firstName).toBe('Min');
                expect(user.lastName).toBe('User');
                expect(user.isEmailVerified).toBe(false);
                expect(user.gender).toBe('');
                expect(user.country).toBe('');
            });
        });
    });

    // ========================================================================
    // Constructor Tests - Different ID Types
    // ========================================================================
    describe('Given user with different identification types', () => {
        it('should create user with cedula de ciudadania (cc)', () => {
            const userData: IUsers = {
                email: 'cc@example.com',
                password: 'password',
                firstName: 'CC',
                lastName: 'User',
                idType: 'cc',
                idNumber: '123456789',
                phone: '300',
                roleId: 'USER',
                gender: '',
                birthDate: '',
                status: UserStatus.ACTIVE,
                country: '',
                state: '',
                city: '',
                neighborhood: '',
                address: '',
                postalCode: '',
                createdAt: new Date(),
                updatedAt: new Date(),
                paymentMethodId: '',
                isEmailVerified: false
            };

            const user = new User(userData);
            expect(user.idType).toBe('cc');
        });

        it('should create user with cedula de extranjeria (ce)', () => {
            const userData: IUsers = {
                email: 'ce@example.com',
                password: 'password',
                firstName: 'CE',
                lastName: 'User',
                idType: 'ce',
                idNumber: '987654321',
                phone: '301',
                roleId: 'USER',
                gender: '',
                birthDate: '',
                status: UserStatus.ACTIVE,
                country: '',
                state: '',
                city: '',
                neighborhood: '',
                address: '',
                postalCode: '',
                createdAt: new Date(),
                updatedAt: new Date(),
                paymentMethodId: '',
                isEmailVerified: false
            };

            const user = new User(userData);
            expect(user.idType).toBe('ce');
        });

        it('should create user with passport', () => {
            const userData: IUsers = {
                email: 'passport@example.com',
                password: 'password',
                firstName: 'Pass',
                lastName: 'User',
                idType: 'passport',
                idNumber: 'ABC123456',
                phone: '302',
                roleId: 'USER',
                gender: '',
                birthDate: '',
                status: UserStatus.ACTIVE,
                country: '',
                state: '',
                city: '',
                neighborhood: '',
                address: '',
                postalCode: '',
                createdAt: new Date(),
                updatedAt: new Date(),
                paymentMethodId: '',
                isEmailVerified: false
            };

            const user = new User(userData);
            expect(user.idType).toBe('passport');
        });
    });

    // ========================================================================
    // Constructor Tests - Different User Statuses
    // ========================================================================
    describe('Given users with different statuses', () => {
        it('should create user with ACTIVE status', () => {
            const userData: IUsers = {
                email: 'active@example.com',
                password: 'password',
                firstName: 'Active',
                lastName: 'User',
                idType: 'cc',
                idNumber: '111',
                phone: '300',
                roleId: 'USER',
                gender: '',
                birthDate: '',
                status: UserStatus.ACTIVE,
                country: '',
                state: '',
                city: '',
                neighborhood: '',
                address: '',
                postalCode: '',
                createdAt: new Date(),
                updatedAt: new Date(),
                paymentMethodId: '',
                isEmailVerified: false
            };

            const user = new User(userData);
            expect(user.status).toBe(UserStatus.ACTIVE);
        });

        it('should create user with INACTIVE status', () => {
            const userData: IUsers = {
                email: 'inactive@example.com',
                password: 'password',
                firstName: 'Inactive',
                lastName: 'User',
                idType: 'cc',
                idNumber: '222',
                phone: '301',
                roleId: 'USER',
                gender: '',
                birthDate: '',
                status: UserStatus.INACTIVE,
                country: '',
                state: '',
                city: '',
                neighborhood: '',
                address: '',
                postalCode: '',
                createdAt: new Date(),
                updatedAt: new Date(),
                paymentMethodId: '',
                isEmailVerified: false
            };

            const user = new User(userData);
            expect(user.status).toBe(UserStatus.INACTIVE);
        });

        it('should create user with BLOCKED status', () => {
            const userData: IUsers = {
                email: 'blocked@example.com',
                password: 'password',
                firstName: 'Blocked',
                lastName: 'User',
                idType: 'cc',
                idNumber: '333',
                phone: '302',
                roleId: 'USER',
                gender: '',
                birthDate: '',
                status: UserStatus.BLOCKED,
                country: '',
                state: '',
                city: '',
                neighborhood: '',
                address: '',
                postalCode: '',
                createdAt: new Date(),
                updatedAt: new Date(),
                paymentMethodId: '',
                isEmailVerified: false
            };

            const user = new User(userData);
            expect(user.status).toBe(UserStatus.BLOCKED);
        });
    });

    // ========================================================================
    // Constructor Tests - Different Roles
    // ========================================================================
    describe('Given users with different roles', () => {
        it('should create user with USER role', () => {
            const userData: IUsers = {
                email: 'user@example.com',
                password: 'password',
                firstName: 'Regular',
                lastName: 'User',
                idType: 'cc',
                idNumber: '444',
                phone: '303',
                roleId: 'USER',
                gender: '',
                birthDate: '',
                status: UserStatus.ACTIVE,
                country: '',
                state: '',
                city: '',
                neighborhood: '',
                address: '',
                postalCode: '',
                createdAt: new Date(),
                updatedAt: new Date(),
                paymentMethodId: '',
                isEmailVerified: false
            };

            const user = new User(userData);
            expect(user.roleId).toBe('USER');
        });

        it('should create user with ADMIN role', () => {
            const userData: IUsers = {
                email: 'admin@example.com',
                password: 'password',
                firstName: 'Admin',
                lastName: 'User',
                idType: 'cc',
                idNumber: '555',
                phone: '304',
                roleId: 'ADMIN',
                gender: '',
                birthDate: '',
                status: UserStatus.ACTIVE,
                country: '',
                state: '',
                city: '',
                neighborhood: '',
                address: '',
                postalCode: '',
                createdAt: new Date(),
                updatedAt: new Date(),
                paymentMethodId: '',
                isEmailVerified: false
            };

            const user = new User(userData);
            expect(user.roleId).toBe('ADMIN');
        });
    });

    // ========================================================================
    // Constructor Tests - Gender Values
    // ========================================================================
    describe('Given users with different genders', () => {
        it('should create user with Male gender', () => {
            const userData: IUsers = {
                email: 'male@example.com',
                password: 'password',
                firstName: 'Male',
                lastName: 'User',
                idType: 'cc',
                idNumber: '666',
                phone: '305',
                roleId: 'USER',
                gender: 'M',
                birthDate: '',
                status: UserStatus.ACTIVE,
                country: '',
                state: '',
                city: '',
                neighborhood: '',
                address: '',
                postalCode: '',
                createdAt: new Date(),
                updatedAt: new Date(),
                paymentMethodId: '',
                isEmailVerified: false
            };

            const user = new User(userData);
            expect(user.gender).toBe('M');
        });

        it('should create user with Female gender', () => {
            const userData: IUsers = {
                email: 'female@example.com',
                password: 'password',
                firstName: 'Female',
                lastName: 'User',
                idType: 'cc',
                idNumber: '777',
                phone: '306',
                roleId: 'USER',
                gender: 'F',
                birthDate: '',
                status: UserStatus.ACTIVE,
                country: '',
                state: '',
                city: '',
                neighborhood: '',
                address: '',
                postalCode: '',
                createdAt: new Date(),
                updatedAt: new Date(),
                paymentMethodId: '',
                isEmailVerified: false
            };

            const user = new User(userData);
            expect(user.gender).toBe('F');
        });

        it('should create user with empty gender', () => {
            const userData: IUsers = {
                email: 'nogender@example.com',
                password: 'password',
                firstName: 'No',
                lastName: 'Gender',
                idType: 'cc',
                idNumber: '888',
                phone: '307',
                roleId: 'USER',
                gender: '',
                birthDate: '',
                status: UserStatus.ACTIVE,
                country: '',
                state: '',
                city: '',
                neighborhood: '',
                address: '',
                postalCode: '',
                createdAt: new Date(),
                updatedAt: new Date(),
                paymentMethodId: '',
                isEmailVerified: false
            };

            const user = new User(userData);
            expect(user.gender).toBe('');
        });
    });

    // ========================================================================
    // Constructor Tests - Email Verification
    // ========================================================================
    describe('Given users with different email verification status', () => {
        it('should create user with verified email', () => {
            const userData: IUsers = {
                email: 'verified@example.com',
                password: 'password',
                firstName: 'Verified',
                lastName: 'User',
                idType: 'cc',
                idNumber: '999',
                phone: '308',
                roleId: 'USER',
                gender: '',
                birthDate: '',
                status: UserStatus.ACTIVE,
                country: '',
                state: '',
                city: '',
                neighborhood: '',
                address: '',
                postalCode: '',
                createdAt: new Date(),
                updatedAt: new Date(),
                paymentMethodId: '',
                isEmailVerified: true
            };

            const user = new User(userData);
            expect(user.isEmailVerified).toBe(true);
        });

        it('should create user with unverified email', () => {
            const userData: IUsers = {
                email: 'unverified@example.com',
                password: 'password',
                firstName: 'Unverified',
                lastName: 'User',
                idType: 'cc',
                idNumber: '000',
                phone: '309',
                roleId: 'USER',
                gender: '',
                birthDate: '',
                status: UserStatus.ACTIVE,
                country: '',
                state: '',
                city: '',
                neighborhood: '',
                address: '',
                postalCode: '',
                createdAt: new Date(),
                updatedAt: new Date(),
                paymentMethodId: '',
                isEmailVerified: false
            };

            const user = new User(userData);
            expect(user.isEmailVerified).toBe(false);
        });
    });

    // ========================================================================
    // Constructor Tests - Date Fields
    // ========================================================================
    describe('Given users with date fields', () => {
        it('should correctly assign createdAt and updatedAt dates', () => {
            const createdDate = new Date('2024-01-01T00:00:00');
            const updatedDate = new Date('2024-06-15T12:30:00');

            const userData: IUsers = {
                email: 'dates@example.com',
                password: 'password',
                firstName: 'Date',
                lastName: 'User',
                idType: 'cc',
                idNumber: '101',
                phone: '310',
                roleId: 'USER',
                gender: '',
                birthDate: '1995-03-20',
                status: UserStatus.ACTIVE,
                country: '',
                state: '',
                city: '',
                neighborhood: '',
                address: '',
                postalCode: '',
                createdAt: createdDate,
                updatedAt: updatedDate,
                paymentMethodId: '',
                isEmailVerified: false
            };

            const user = new User(userData);
            expect(user.createdAt).toEqual(createdDate);
            expect(user.updatedAt).toEqual(updatedDate);
            expect(user.birthDate).toBe('1995-03-20');
        });
    });

    // ========================================================================
    // Constructor Tests - Optional ID field
    // ========================================================================
    describe('Given user data with optional id field', () => {
        it('should assign _id when provided', () => {
            const userData: IUsers = {
                _id: 'custom-id-123',
                email: 'withid@example.com',
                password: 'password',
                firstName: 'With',
                lastName: 'ID',
                idType: 'cc',
                idNumber: '202',
                phone: '311',
                roleId: 'USER',
                gender: '',
                birthDate: '',
                status: UserStatus.ACTIVE,
                country: '',
                state: '',
                city: '',
                neighborhood: '',
                address: '',
                postalCode: '',
                createdAt: new Date(),
                updatedAt: new Date(),
                paymentMethodId: '',
                isEmailVerified: false
            };

            const user = new User(userData);
            expect(user._id).toBe('custom-id-123');
        });

        it('should handle user without _id', () => {
            const userData: IUsers = {
                email: 'noid@example.com',
                password: 'password',
                firstName: 'No',
                lastName: 'ID',
                idType: 'cc',
                idNumber: '303',
                phone: '312',
                roleId: 'USER',
                gender: '',
                birthDate: '',
                status: UserStatus.ACTIVE,
                country: '',
                state: '',
                city: '',
                neighborhood: '',
                address: '',
                postalCode: '',
                createdAt: new Date(),
                updatedAt: new Date(),
                paymentMethodId: '',
                isEmailVerified: false
            };

            const user = new User(userData);
            expect(user._id).toBeUndefined();
        });
    });
});