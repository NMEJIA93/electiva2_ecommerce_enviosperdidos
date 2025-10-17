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
            // User created but email service failed - return 503 Service Unavailable
            return response.status(503).json({
                ok: false,
                message: 'User created but verification email could not be sent. Please try resending the code.',
                user: buildUserResponse(result.user)
            });
        }

        response.status(201).json({
            ok: true,
            message: 'User created successfully',
            user: buildUserResponse(result.user)
        });
    } catch (error) {
        console.error('[USER CONTROLLER] Error creating user:', error);
        const errorMessage = (error as Error).message;

        // 409 Conflict - Email already exists
        if (errorMessage.includes('email already in use') || errorMessage.includes('Email must be unique')) {
            return response.status(409).json({
                ok: false,
                message: 'Email already in use',
                error: errorMessage
            });
        }

        // 422 Unprocessable Entity - Business rule validation failed (weak password)
        if (errorMessage.includes('Password must be at least')) {
            return response.status(422).json({
                ok: false,
                message: 'Password does not meet security requirements',
                error: errorMessage
            });
        }

        // 503 Service Unavailable - Database connection issues
        if (errorMessage.includes('ECONNREFUSED') || errorMessage.includes('connection')) {
            return response.status(503).json({
                ok: false,
                message: 'Service temporarily unavailable. Please try again later.'
            });
        }

        // 500 Internal Server Error - Unexpected errors
        return response.status(500).json({
            ok: false,
            message: 'Internal server error',
            error: errorMessage
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
        console.error('[USER CONTROLLER] Error updating user:', {
            userId: request.params.id,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        const errorMessage = (error as Error).message;

        // 503 Service Unavailable - Database connection issues
        if (errorMessage.includes('ECONNREFUSED') || errorMessage.includes('connection')) {
            return response.status(503).json({
                ok: false,
                message: 'Service temporarily unavailable. Please try again later.'
            });
        }

        return response.status(500).json({
            ok: false,
            message: 'Internal server error',
            error: errorMessage
        });
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
        console.error('[USER CONTROLLER] Error updating partial user:', {
            userId: request.params.id,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        const errorMessage = (error as Error).message;

        // 503 Service Unavailable - Database connection issues
        if (errorMessage.includes('ECONNREFUSED') || errorMessage.includes('connection')) {
            return response.status(503).json({
                ok: false,
                message: 'Service temporarily unavailable. Please try again later.'
            });
        }

        return response.status(500).json({
            ok: false,
            message: 'Internal server error',
            error: errorMessage
        });
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
        console.error('[USER CONTROLLER] Error getting user profile:', error);
        const errorMessage = (error as Error).message;

        // 503 Service Unavailable - Database connection issues
        if (errorMessage.includes('ECONNREFUSED') || errorMessage.includes('connection')) {
            return response.status(503).json({
                ok: false,
                message: 'Service temporarily unavailable. Please try again later.'
            });
        }

        return response.status(500).json({
            ok: false,
            message: 'Internal server error',
            error: errorMessage
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
        console.error('[USER CONTROLLER] Error getting all users:', error);
        const errorMessage = (error as Error).message;

        // 503 Service Unavailable - Database connection issues
        if (errorMessage.includes('ECONNREFUSED') || errorMessage.includes('connection')) {
            return response.status(503).json({
                ok: false,
                message: 'Service temporarily unavailable. Please try again later.'
            });
        }

        return response.status(500).json({
            ok: false,
            message: 'Internal server error',
            error: errorMessage
        });
    }
};

export const verifyEmail = async (request: Request, response: Response) => {
    try {
        const { email, code } = buildVerificationRequest(request.body);

        const result = await verifyUserEmail(userRepo, email, code);

        if (!result.success) {
            // 404 Not Found - User doesn't exist
            if (result.message.includes('not found')) {
                return response.status(404).json({
                    ok: false,
                    message: result.message
                });
            }

            // 409 Conflict - Email already verified
            if (result.message.includes('already verified')) {
                return response.status(409).json({
                    ok: false,
                    message: result.message
                });
            }

            // 410 Gone - Verification code expired
            if (result.message.includes('expired')) {
                return response.status(410).json({
                    ok: false,
                    message: result.message
                });
            }

            // 422 Unprocessable Entity - Invalid code format or code doesn't match
            if (result.message.includes('Invalid') || result.message.includes('code')) {
                return response.status(422).json({
                    ok: false,
                    message: result.message
                });
            }

            // 400 Bad Request - Default for malformed requests
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
        console.error('[USER CONTROLLER] Error verifying email:', error);
        const errorMessage = (error as Error).message;

        // 503 Service Unavailable - Database connection issues
        if (errorMessage.includes('ECONNREFUSED') || errorMessage.includes('connection')) {
            return response.status(503).json({
                ok: false,
                message: 'Service temporarily unavailable. Please try again later.'
            });
        }

        return response.status(500).json({
            ok: false,
            message: 'Internal server error',
            error: errorMessage
        });
    }
};

export const resendCode = async (request: Request, response: Response) => {
    try {
        const { email } = buildResendCodeRequest(request.body);

        const checkResult = await resendVerificationCode(userRepo, email);

        if (!checkResult.success) {
            // 404 Not Found - User doesn't exist
            if (checkResult.message.includes('not found')) {
                return response.status(404).json({
                    ok: false,
                    message: checkResult.message
                });
            }

            // 409 Conflict - Email already verified
            if (checkResult.message.includes('already verified') || checkResult.message.includes('Cannot resend')) {
                return response.status(409).json({
                    ok: false,
                    message: checkResult.message
                });
            }

            // 400 Bad Request - Default
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
        
        if (!user) {
            return response.status(404).json({
                ok: false,
                message: 'User not found'
            });
        }

        const emailResult = await emailService.sendVerificationCode(
            email,
            user.firstName,
            newCode
        );

        if (!emailResult.success) {
            console.error('[USER CONTROLLER] Failed to send verification email:', emailResult.error);
            // 503 Service Unavailable - Email service is down
            return response.status(503).json({
                ok: false,
                message: 'Email service temporarily unavailable. Please try again later.'
            });
        }

        response.status(200).json({
            ok: true,
            message: 'New verification code sent successfully'
        });
    } catch (error) {
        console.error('[USER CONTROLLER] Error resending code:', error);
        const errorMessage = (error as Error).message;

        // 503 Service Unavailable - Database connection issues
        if (errorMessage.includes('ECONNREFUSED') || errorMessage.includes('connection')) {
            return response.status(503).json({
                ok: false,
                message: 'Service temporarily unavailable. Please try again later.'
            });
        }

        return response.status(500).json({
            ok: false,
            message: 'Internal server error',
            error: errorMessage
        });
    }
};

