import { Request, Response, NextFunction } from 'express';
import { buildErrorResponse } from '../dtos/auth-dtos';

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const emailValue = email;
    const passwordValue = password;

    if (!emailValue || !passwordValue) {
        return res.status(422).json(
            buildErrorResponse('ValidationError', 'Unprocessable entity (validation failed)')
        );
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
        return res.status(422).json(
            buildErrorResponse('ValidationError', 'Unprocessable entity (validation failed)')
        );
    }
    
    if (passwordValue.length < 8) {
        return res.status(422).json(
            buildErrorResponse('ValidationError', 'Unprocessable entity (validation failed)')
        );
    }
    
    next();
};

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
    const { email, password, name, phone } = req.body;

    const emailValue = email;
    const passwordValue = password;
    const nameValue = name;
    const phoneValue = phone;

    if (!emailValue || !passwordValue || !nameValue || !phoneValue) {
        return res.status(422).json(
            buildErrorResponse('ValidationError', 'Unprocessable entity (validation failed)')
        );
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
        return res.status(422).json(
            buildErrorResponse('ValidationError', 'Unprocessable entity (validation failed)')
        );
    }
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,#])[A-Za-z\d@$!%*?&.,#]{8,}$/;
    if (!passwordRegex.test(passwordValue)) {
        return res.status(422).json(
            buildErrorResponse('ValidationError', 'Unprocessable entity (validation failed)')
        );
    }
    
    if (nameValue.trim().length < 2) {
        return res.status(422).json(
            buildErrorResponse('ValidationError', 'Unprocessable entity (validation failed)')
        );
    }
    
    const phoneRegex = /^\d{7,15}$/;
    if (!phoneRegex.test(phoneValue.toString())) {
        return res.status(422).json(
            buildErrorResponse('ValidationError', 'Unprocessable entity (validation failed)')
        );
    }
    
    next();
};