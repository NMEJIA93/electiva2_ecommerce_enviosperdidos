import { Request, Response, NextFunction } from 'express';
import { UserStatus } from '../dtos/user-dtos';
import { isValidVerificationCode } from '../../domain/business-rules/user-rules';


export const useParamValidation = (request: Request, response: Response, next: NextFunction) => {
    const {
        email,
        password,
        firstName,
        lastName,
        idType,
        idNumber,
        phone,
        roleId,
        gender,
        birthDate,
        status,
        country,
        state,
        city,
        neighborhood,
        address,
        postalCode
    } = request.body;

    const allowedStatus = Object.values(UserStatus);
    if (!status) {
        request.body.status = UserStatus.ACTIVE;
    } else if (!allowedStatus.includes(status)) {
        return response.status(422).json({
            ok: false,
            error: `The status field must be one of: ${allowedStatus.join(', ')}`
        });
    }
    // email
    if (!email) return response.status(422).json({ ok: false, error: 'The email field is required' });
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) return response.status(422).json({ ok: false, error: 'The email format is invalid' });

    // password
    if (!password) return response.status(422).json({ ok: false, error: 'The password field is required' });
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*()_+\-=[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(password)) return response.status(422).json({ ok: false, error: 'The password must be at least 8 characters and include uppercase, lowercase, numbers, and symbols.' });

    // names
    if (!firstName) return response.status(422).json({ ok: false, error: 'The firstName field is required' });
    if (!lastName) return response.status(422).json({ ok: false, error: 'The lastName field is required' });

    // id type/number
    if (!idType) return response.status(422).json({ ok: false, error: 'The idType field is required' });
    if (!idNumber) return response.status(422).json({ ok: false, error: 'The idNumber field is required' });


    next();
};

export const validateEmailVerification = (req: Request, res: Response, next: NextFunction) => {
    const { email, code } = req.body;

    if (!email) {
        return res.status(400).json({
            ok: false,
            message: 'Email is required'
        });
    }

    if (!code) {
        return res.status(400).json({
            ok: false,
            message: 'Verification code is required'
        });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            ok: false,
            message: 'Invalid email format'
        });
    }

    // Validate code format using business rule
    if (!isValidVerificationCode(code)) {
        return res.status(400).json({
            ok: false,
            message: 'Invalid code format. Code must be 6 digits'
        });
    }

    next();
};

/**
 * Validate resend code request
 */
export const validateResendCode = (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            ok: false,
            message: 'Email is required'
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            ok: false,
            message: 'Invalid email format'
        });
    }

    next();
};