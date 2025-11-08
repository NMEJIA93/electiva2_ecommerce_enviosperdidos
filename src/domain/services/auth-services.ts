import jwt from 'jsonwebtoken';
import { IUserRepository } from "../repositories/IUser-repository";
import { findUserByEmail, comparePassword, updateUserById } from "./user-services";
import { LoginRequest } from "../../application/dtos/auth-dtos";
import { JWTConfig } from "../../infraestructure/config/jwt-config";
import { MongoLoginRepository } from '../../infraestructure/repositories/mongo-login';
import { UserStatus } from '../../application/dtos/user-dtos';

const loginAttemptRepo = new MongoLoginRepository();

export const loginUser = async (userRepo: IUserRepository, loginData: LoginRequest) => {
    try {
        const user = await findUserByEmail(userRepo, loginData.email);
        
        if (!user) {
            return { success: false, message: 'Invalid credentials (wrong email or password)' };
        }

        if (user.status === UserStatus.BLOCKED) {
            return { success: false, message: 'User is blocked. Please contact the administrator.' };
        }

        const isPasswordValid = await comparePassword(loginData.password, user.password);
        
        if (!isPasswordValid) {
            try {
                const idNumber = user.idNumber;
                const email = user.email;
                const attempt = await loginAttemptRepo.incrementRetries(idNumber, email);
                const retries = attempt?.retries ?? 0;
                if (retries >= 3) {
                    await updateUserById(userRepo, user._id, { status: UserStatus.BLOCKED });
                }
            } catch (err) {
            }

            return { success: false, message: 'Invalid credentials (wrong email or password)' };
        }

        const token = generateToken({
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            roleId: user.roleId
        });

        try {
            const idNumber = user.idNumber;
            const email = user.email;
            await loginAttemptRepo.resetRetries(idNumber, token, email);
        } catch (err) {
        }

        return {
            success: true,
            token
        };
    } catch (error) {
        throw new Error(`[ERROR AUTH SERVICE] - Login error: ${error}`);
    }
};

export const generateToken = (payload: object): string => {
    return jwt.sign(payload, JWTConfig.secret, { expiresIn: JWTConfig.expiresIn } as jwt.SignOptions);
};

export const verifyToken = (token: string): any => {
    try {
        return jwt.verify(token, JWTConfig.secret);
    } catch (error) {
        throw new Error('Invalid token');
    }
};