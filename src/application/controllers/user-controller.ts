import { Request, Response } from 'express';

import { buildUserRequest, UserRequest, buildUserResponse, buildResendCodeRequest, buildVerificationRequest } from '../dtos/user-dtos';
import {
    saveUser,
    findUserById,
    hashPassword,
    findAllUsers,
    updateUserById,
    resendVerificationCode,
    verifyUserEmail
} from '../../domain/services/user-services';

import { MongoUserRepository } from '../../infraestructure/repositories/mongo-user';
import { IUserRepository } from '../../domain/repositories/IUser-repository';
import { IEmailService } from '../../domain/services/email-services';
import { NodemailerEmailService } from '../../infraestructure/services/nodemailer-email';
import { generateVerificationCode, getVerificationCodeExpiration } from '../../domain/business-rules/user-rules';


const emailService: IEmailService = new NodemailerEmailService();
const userRepo: IUserRepository = new MongoUserRepository();

export const createUser = async (request: Request, response: Response) => {
    try {

        const newUser = buildUserRequest(request.body);

        newUser.password = await hashPassword(newUser.password);

        const result = await saveUser(userRepo, newUser);

        const emailResult = await emailService.sendVerificationCode(
            result.user.email,
            result.user.firstName,
            result.verificationCode
        );

        if (!emailResult.success) {
            console.error('[USER CONTROLLER] Failed to send verification email:', emailResult.error);
        }

        response.status(201).json({
            ok: true,
            message: 'User created successfully',
            user: buildUserResponse(result.user)
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({
            ok: false,
            message: 'Internal server error',
            error: (error as Error).message
        });
    }
}

export const updateUser = async (request: Request, response: Response) => {
    try {
        const userId: string = request.params.id;
        const existingUser = await findUserById(userRepo, userId);
        if (!existingUser) {
            return response.status(404).json({
                ok: false,
                message: 'User not found'
            });
        }
        const updatedData: UserRequest = buildUserRequest(request.body);

        const result = await updateUserById(userRepo, userId, updatedData);
        response.status(200).json({
            ok: true,
            message: 'User updated successfully',
            user: buildUserResponse(result)
        });

    } catch (error) {
    }
}

export const updatePartialUser = async (request: Request, response: Response) => {
    try {

        const userId: string = request.params.id;

        const existingUser = await findUserById(userRepo, userId);

        if (!existingUser) {
            return response.status(404).json({
                ok: false,
                message: 'User not found'
            });
        }

        const updatedData = request.body;

        const result = await updateUserById(userRepo, userId, updatedData);
        response.status(200).json({
            ok: true,
            message: 'User updated successfully',
            user: buildUserResponse(result)
        });

    } catch (error) {

    }
}

export const getUserProfile = async (request: Request, response: Response) => {
    try {
        const userId: string = request.params.id;
        const user = await findUserById(userRepo, userId);
        if (!user) {
            return response.status(404).json({
                ok: false,
                message: 'User not found'
            });
        }
        response.status(200).json({
            ok: true,
            user: buildUserResponse(user)
        });

    } catch (error) {
        return response.status(500).json({
            ok: false,
            message: 'Internal server error',
            error: (error as Error).message
        });
    }
}

export const getAllUsers = async (request: Request, response: Response) => {
    try {
        const users = await findAllUsers(userRepo);
        const userResponses = users.map(user => buildUserResponse(user));

        response.status(200).json({
            ok: true,
            users: userResponses
        });

    } catch (error) {
        response.status(500).json({
            ok: false,
            message: 'Internal server error',
            error: (error as Error).message
        });
    }
};

export const verifyEmail = async (request: Request, response: Response) => {
    try {
        const { email, code } = buildVerificationRequest(request.body);

        const result = await verifyUserEmail(userRepo, email, code);

        if (!result.success) {
            return response.status(400).json({
                ok: false,
                message: result.message
            });
        }

        response.status(200).json({
            ok: true,
            message: result.message
        });
    } catch (error) {
        console.error('[AUTH CONTROLLER] Error verifying email:', error);
        return response.status(500).json({
            ok: false,
            message: 'Internal server error',
            error: (error as Error).message
        });
    }
};

// ✅ NUEVO: Resend verification code
export const resendCode = async (request: Request, response: Response) => {
    try {
        const { email } = buildResendCodeRequest(request.body);

        const checkResult = await resendVerificationCode(userRepo, email);

        if (!checkResult.success) {
            return response.status(400).json({
                ok: false,
                message: checkResult.message
            });
        }

        // Generate new code
        const newCode = generateVerificationCode();
        const expiresAt = getVerificationCodeExpiration();

        // Save new code
        await userRepo.saveVerificationCode(email, newCode, expiresAt);

        // Send email
        const user = await userRepo.findByEmail(email);
        const emailResult = await emailService.sendVerificationCode(
            email,
            user!.firstName,
            newCode
        );

        if (!emailResult.success) {
            console.error('[AUTH CONTROLLER] Failed to send verification email:', emailResult.error);
            return response.status(500).json({
                ok: false,
                message: 'Failed to send verification email'
            });
        }

        response.status(200).json({
            ok: true,
            message: 'New verification code sent successfully'
        });
    } catch (error) {
        console.error('[AUTH CONTROLLER] Error resending code:', error);
        return response.status(500).json({
            ok: false,
            message: 'Internal server error',
            error: (error as Error).message
        });
    }
};

