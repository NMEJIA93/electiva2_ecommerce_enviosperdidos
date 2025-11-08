import express, { Router } from 'express';
import { validateLogin } from '../middlewares/auth-validators';
import { login, getLogin, verifyEmail, resendCode, logout } from '../controllers/auth-controller';
import { authenticateToken } from '../middlewares/auth-middleware';
import { useParamValidation, validateEmailVerification, validateResendCode } from '../middlewares/users-validators';
import { createUser } from '../controllers/user-controller';


const authRouter: Router = express.Router();


authRouter.post('/auth/login', validateLogin, login);
authRouter.get('/auth/session', authenticateToken, getLogin);
authRouter.post('/auth/logout', authenticateToken, logout);
authRouter.post('/auth/register', useParamValidation, createUser);
authRouter.post('/auth/register', useParamValidation, createUser);

// Rutas protegidas (requieren token)
authRouter.get('/auth/session', authenticateToken, getLogin);

//Email verification routes
authRouter.post('/auth/verify-email', validateEmailVerification, verifyEmail);
authRouter.post('/auth/resend-verification-code', validateResendCode, resendCode);



export default authRouter;