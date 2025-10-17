// src/test/domain/business-rules/user-rules.test.ts

import {
    isPasswordSecure,
    isValidVerificationCode,
    generateVerificationCode,
    canVerifyEmail,
    isVerificationCodeExpired,
    getVerificationCodeExpiration,
    canMakePurchases
} from '../../../domain/business-rules/user-rules';

describe('User Business Rules', () => {

    // ========================================================================
    // isPasswordSecure Tests
    // ========================================================================
    describe('isPasswordSecure', () => {
        describe('Given a valid password', () => {
            it('should return true for password with uppercase, lowercase, and numbers', () => {
                expect(isPasswordSecure('Password123')).toBe(true);
            });

            it('should return true for password exactly 8 characters', () => {
                expect(isPasswordSecure('Pass123A')).toBe(true);
            });

            it('should return true for password longer than 8 characters', () => {
                expect(isPasswordSecure('Password123456')).toBe(true);
            });
        });

        describe('Given an invalid password', () => {
            it('should return false for password without uppercase', () => {
                expect(isPasswordSecure('password123')).toBe(false);
            });

            it('should return false for password without lowercase', () => {
                expect(isPasswordSecure('PASSWORD123')).toBe(false);
            });

            it('should return false for password without numbers', () => {
                expect(isPasswordSecure('Password')).toBe(false);
            });

            it('should return false for password shorter than 8 characters', () => {
                expect(isPasswordSecure('Pass12')).toBe(false);
            });

            it('should return false for empty password', () => {
                expect(isPasswordSecure('')).toBe(false);
            });
        });
    });

    // ========================================================================
    // isValidVerificationCode Tests
    // ========================================================================
    describe('isValidVerificationCode', () => {
        describe('Given a valid verification code', () => {
            it('should return true for 6-digit code', () => {
                expect(isValidVerificationCode('123456')).toBe(true);
            });

            it('should return true for code starting with zero', () => {
                expect(isValidVerificationCode('012345')).toBe(true);
            });
        });

        describe('Given an invalid verification code', () => {
            it('should return false for code with less than 6 digits', () => {
                expect(isValidVerificationCode('12345')).toBe(false);
            });

            it('should return false for code with more than 6 digits', () => {
                expect(isValidVerificationCode('1234567')).toBe(false);
            });

            it('should return false for code with letters', () => {
                expect(isValidVerificationCode('12345A')).toBe(false);
            });

            it('should return false for empty code', () => {
                expect(isValidVerificationCode('')).toBe(false);
            });

            it('should return false for code with special characters', () => {
                expect(isValidVerificationCode('12345!')).toBe(false);
            });
        });
    });

    // ========================================================================
    // generateVerificationCode Tests
    // ========================================================================
    describe('generateVerificationCode', () => {
        describe('When generating verification code', () => {
            it('should return a 6-digit string', () => {
                const code = generateVerificationCode();
                expect(code).toHaveLength(6);
            });

            it('should return only digits', () => {
                const code = generateVerificationCode();
                expect(/^\d{6}$/.test(code)).toBe(true);
            });

            it('should generate different codes on multiple calls', () => {
                const codes = new Set();
                for (let i = 0; i < 10; i++) {
                    codes.add(generateVerificationCode());
                }
                // Es muy probable que al menos 2 códigos sean diferentes
                expect(codes.size).toBeGreaterThan(1);
            });
        });
    });

    // ========================================================================
    // canVerifyEmail Tests
    // ========================================================================
    describe('canVerifyEmail', () => {
        describe('Given email is not verified', () => {
            it('should allow verification', () => {
                const result = canVerifyEmail(false);
                expect(result.canVerify).toBe(true);
                expect(result.reason).toBeUndefined();
            });
        });

        describe('Given email is already verified', () => {
            it('should not allow verification', () => {
                const result = canVerifyEmail(true);
                expect(result.canVerify).toBe(false);
                expect(result.reason).toBe('Email is already verified');
            });
        });
    });

    // ========================================================================
    // isVerificationCodeExpired Tests
    // ========================================================================
    describe('isVerificationCodeExpired', () => {
        describe('Given a future expiration date', () => {
            it('should return false', () => {
                const futureDate = new Date();
                futureDate.setHours(futureDate.getHours() + 1);
                expect(isVerificationCodeExpired(futureDate)).toBe(false);
            });
        });

        describe('Given a past expiration date', () => {
            it('should return true', () => {
                const pastDate = new Date();
                pastDate.setHours(pastDate.getHours() - 1);
                expect(isVerificationCodeExpired(pastDate)).toBe(true);
            });
        });

        describe('Given current time as expiration', () => {
            it('should return false (not expired yet)', () => {
                const now = new Date();
                now.setSeconds(now.getSeconds() + 1); // 1 segundo en el futuro
                expect(isVerificationCodeExpired(now)).toBe(false);
            });
        });
    });

    // ========================================================================
    // getVerificationCodeExpiration Tests
    // ========================================================================
    describe('getVerificationCodeExpiration', () => {
        describe('When getting expiration date', () => {
            it('should return a date 24 hours in the future', () => {
                const before = new Date();
                const expiresAt = getVerificationCodeExpiration();
                const after = new Date();

                // Verificar que es aproximadamente 24 horas después
                const hoursDiff = (expiresAt.getTime() - before.getTime()) / (1000 * 60 * 60);
                expect(hoursDiff).toBeGreaterThanOrEqual(23.9);
                expect(hoursDiff).toBeLessThanOrEqual(24.1);
            });

            it('should return a Date object', () => {
                const expiresAt = getVerificationCodeExpiration();
                expect(expiresAt).toBeInstanceOf(Date);
            });

            it('should return a valid date', () => {
                const expiresAt = getVerificationCodeExpiration();
                expect(isNaN(expiresAt.getTime())).toBe(false);
            });
        });
    });

    // ========================================================================
    // canMakePurchases Tests
    // ========================================================================
    describe('canMakePurchases', () => {
        describe('Given email is verified', () => {
            it('should allow purchases', () => {
                const result = canMakePurchases(true);
                expect(result.canPurchase).toBe(true);
                expect(result.reason).toBeUndefined();
            });
        });

        describe('Given email is not verified', () => {
            it('should not allow purchases', () => {
                const result = canMakePurchases(false);
                expect(result.canPurchase).toBe(false);
                expect(result.reason).toBe('Email must be verified before making purchases');
            });
        });
    });
});