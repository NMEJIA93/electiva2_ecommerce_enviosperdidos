import { Request, Response } from 'express';
import { buildLoginRequest, buildAuthResponse, buildErrorResponse } from '../dtos/auth-dtos';
import { buildVerificationRequest, buildResendCodeRequest } from '../dtos/user-dtos';
import { loginUser } from '../../domain/services/auth-services';
import { verifyUserEmail, resendVerificationCode } from '../../domain/services/user-services';
import { generateVerificationCode, getVerificationCodeExpiration } from '../../domain/business-rules/user-rules';
import { MongoUserRepository } from '../../infraestructure/repositories/mongo-user';
import { findUserById } from '../../domain/services/user-services';
import { MongoLoginRepository } from '../../infraestructure/repositories/mongo-login';
import { IUserRepository } from '../../domain/repositories/IUser-repository';
import { IEmailService } from '../../domain/services/email-services';
import { NodemailerEmailService } from '../../infraestructure/services/nodemailer-email';

const userRepo: IUserRepository = new MongoUserRepository();
const emailService: IEmailService = new NodemailerEmailService();
const loginRepo = new MongoLoginRepository();

export const login = async (request: Request, response: Response) => {
    try {
        const loginData = buildLoginRequest(request.body);

        const result = await loginUser(userRepo, loginData);

        if (!result.success) {
            return response.status(401).json(
                buildErrorResponse('Unauthorized', result.message)
            );
        }

        response.status(200).json(
            buildAuthResponse('Token generated', result.token)
        );
    } catch (error) {
        return response.status(503).json(
            buildErrorResponse('ServiceUnavailable', 'Service unavailable')
        );
    }
};

export const getLogin = async (request: Request, response: Response) => {
    try {

        const userId = request.user?.id;

        if (!userId) {
            return response.status(401).json(
                buildErrorResponse('Unauthorized', 'User not authenticated')
            );
        }

        response.status(200).json({
            ok: true,
            message: 'Profile retrieved successfully',
            user: request.user
        });
    } catch (error) {
        return response.status(500).json(
            buildErrorResponse('InternalServerError', 'Internal server error')
        );
    }
};

export const logout = async (request: Request, response: Response) => {
    try {
        const userId = request.user?.id;
        if (!userId) {
            return response.status(401).json(
                buildErrorResponse('Unauthorized', 'User not authenticated')
            );
        }

        const existingUser = await findUserById(userRepo, userId);
        if (!existingUser) {
            return response.status(404).json(
                buildErrorResponse('NotFound', 'User not found')
            );
        }

        const idNumber = existingUser.idNumber;
        try {
            await loginRepo.resetRetries(idNumber);
        } catch (err) {
        }

        return response.status(200).json({ ok: true, message: 'Logged out successfully' });
    } catch (error) {
        return response.status(500).json(
            buildErrorResponse('InternalServerError', 'Internal server error')
        );
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

        const newCode = generateVerificationCode();
        const expiresAt = getVerificationCodeExpiration();


        await userRepo.saveVerificationCode(email, newCode, expiresAt);


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