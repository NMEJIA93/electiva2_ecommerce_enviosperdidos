export function isPasswordSecure(password: string): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
}

export function isValidVerificationCode(code: string): boolean {
    const codeRegex = /^\d{6}$/;
    return codeRegex.test(code);
}

export function generateVerificationCode(): string {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return code;
}

export function canVerifyEmail(isEmailVerified: boolean): {
    canVerify: boolean;
    reason?: string;
} {
    if (isEmailVerified) {
        return {
            canVerify: false,
            reason: 'Email is already verified'
        };
    }
    
    return {
        canVerify: true
    };
}

export function isVerificationCodeExpired(expiresAt: Date): boolean {
    return expiresAt < new Date();
}

export function getVerificationCodeExpiration(): Date {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    return expiresAt;
}

export function canMakePurchases(isEmailVerified: boolean): {
    canPurchase: boolean;
    reason?: string;
} {
    if (!isEmailVerified) {
        return {
            canPurchase: false,
            reason: 'Email must be verified before making purchases'
        };
    }
    
    return {
        canPurchase: true
    };
}