import { IUserRepository } from "../repositories/IUser-repository";
import { User } from "../entities/User";
import { IUsers } from "../models/interfaces/IUsers";
import { UserStatus } from "../../application/dtos/user-dtos";
import {
    isPasswordSecure,
    generateVerificationCode,
    getVerificationCodeExpiration,
    canVerifyEmail,           
    isValidVerificationCode,  
    isVerificationCodeExpired, 
    canMakePurchases   
} from "../business-rules/user-rules"
import * as bcrypt from 'bcryptjs';


export const saveUser = async (userRepo: IUserRepository, user: IUsers) => {
    try {
        const existingUser = await userRepo.findByEmail(user.email);
        if (existingUser) {
            throw new Error('Email must be unique "email already in use"');
        }

        if (!isPasswordSecure(user.password)) {
            throw new Error('Password must be at least 8 characters and include uppercase, lowercase, and numbers');
        }
        const newUserData: IUsers = {
            ...user,
            isEmailVerified: false,
            status: UserStatus.ACTIVE  
        };

        const newUser = new User(newUserData);
        const savedUser = await userRepo.save(newUser);

        const verificationCode = generateVerificationCode();
        const expiresAt = getVerificationCodeExpiration();

        await userRepo.saveVerificationCode(user.email, verificationCode, expiresAt);


        return {
            user: savedUser,
            verificationCode: verificationCode
        };

    } catch (error) {
        throw new Error(`[ERROR TO SERVICE] - Error saving user: ${error}`);
    }
};




export const updateUserById = async (userRepo: IUserRepository, userId: string, updatedData: Partial<IUsers>) => {
    try {
        return await userRepo.update(userId, updatedData);
    } catch (error) {
        throw new Error(`[ERROR TO SERVICE] - Error updating user: ${error}`);
    }
};



export const findUserByEmail = async (userRepo: IUserRepository, email: string): Promise<User | null> => {
    try {
        return await userRepo.findByEmail(email);
    } catch (error) {
        throw new Error(`[ERROR TO SERVICE] - Error finding user by email: ${error}`);
    }
};

export const hashPassword = async (password: string): Promise<string> => {
    try {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    } catch (error) {
        throw new Error(`[ERROR TO SERVICE] - Error hashing password: ${error}`);
    }
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        throw new Error(`[ERROR TO SERVICE] - Error comparing password: ${error}`);
    }
};

export const findUserById = async (userRepo: IUserRepository, userId: string) => {
    try {

        const user = await userRepo.findById(userId);
        if (user) {
            return user;
        }
        return null
    } catch (error) {
        throw new Error(`[ERROR TO SERVICE] - Error finding user by ID: ${error}`);
    }
}

export const findAllUsers = async (userRepo: IUserRepository) => {


    try {
        return await userRepo.findAll();
    } catch (error) {

    }
};

export const verifyUserEmail = async (userRepo: IUserRepository,email: string,code: string): Promise<{ success: boolean; message: string }> => {
    try {
        // Validate code format
        if (!isValidVerificationCode(code)) {
            return {
                success: false,
                message: 'Invalid code format. Code must be 6 digits'
            };
        }

        // Find user
        const user = await findUserByEmail(userRepo, email);
        
        if (!user) {
            return {
                success: false,
                message: 'User not found'
            };
        }

        // Check if email can be verified
        const verificationCheck = canVerifyEmail(user.isEmailVerified);
        if (!verificationCheck.canVerify) {
            return {
                success: false,
                message: verificationCheck.reason || 'Cannot verify email'
            };
        }

        // Get stored code
        const storedCodeData = await userRepo.getVerificationCode(email);
        
        if (!storedCodeData) {
            return {
                success: false,
                message: 'No verification code found for this email'
            };
        }

        // Check if code expired
        if (isVerificationCodeExpired(storedCodeData.expiresAt)) {
            await userRepo.deleteVerificationCode(email);
            return {
                success: false,
                message: 'Verification code has expired'
            };
        }

        // Verify code matches
        if (storedCodeData.code !== code) {
            return {
                success: false,
                message: 'Invalid verification code'
            };
        }

        // Update user: mark as verified
        await userRepo.update(user._id!, {
            isEmailVerified: true
        });

        // Delete used code
        await userRepo.deleteVerificationCode(email);

        return {
            success: true,
            message: 'Email verified successfully. You can now make purchases.'
        };

    } catch (error) {
        throw new Error(`[ERROR TO SERVICE] - Error verifying email: ${error}`);
    }
};

/**
 * Resend verification code
 */
export const resendVerificationCode = async (
    userRepo: IUserRepository,
    email: string
): Promise<{ success: boolean; message: string }> => {
    try {
        // Find user
        const user = await findUserByEmail(userRepo, email);
        
        if (!user) {
            return {
                success: false,
                message: 'User not found'
            };
        }

        // Check if email can be verified
        const verificationCheck = canVerifyEmail(user.isEmailVerified);
        if (!verificationCheck.canVerify) {
            return {
                success: false,
                message: verificationCheck.reason || 'Cannot resend code'
            };
        }

        // Delete old code if exists
        if (await userRepo.hasVerificationCode(email)) {
            await userRepo.deleteVerificationCode(email);
        }

        return {
            success: true,
            message: 'Ready to generate new code'
        };

    } catch (error) {
        throw new Error(`[ERROR TO SERVICE] - Error resending code: ${error}`);
    }
};

/**
 * Validate if user can make purchases
 */
export const validateUserCanPurchase = async (
    userRepo: IUserRepository,
    userId: string
): Promise<{ canPurchase: boolean; reason?: string }> => {
    try {
        const user = await userRepo.findById(userId);
        
        if (!user) {
            return {
                canPurchase: false,
                reason: 'User not found'
            };
        }

        return canMakePurchases(user.isEmailVerified);

    } catch (error) {
        throw new Error(`[ERROR TO SERVICE] - Error validating purchase: ${error}`);
    }
};


