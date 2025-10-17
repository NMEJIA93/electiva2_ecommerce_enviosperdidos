import express, { Router, Request, Response } from 'express';
import { useParamValidation } from '../middlewares/users-validators';
import { NodemailerEmailService } from '../../infraestructure/services/nodemailer-email';

import {
    authenticateToken,
    authorizeProfileAccess
} from '../middlewares/auth-middleware';

import {
    createUser,
    getUserProfile,
    getAllUsers,
    updateUser,
    updatePartialUser
} from '../controllers/user-controller';

const userRouter: Router = express.Router();

userRouter.post('/user', useParamValidation, createUser)
userRouter.put('/user/profile/:id', authenticateToken,authorizeProfileAccess, updateUser)
userRouter.patch('/user/profile/:id', authenticateToken,authorizeProfileAccess, updatePartialUser)
userRouter.get('/user/profile/:id', authenticateToken, authorizeProfileAccess, getUserProfile)
userRouter.get('/users', getAllUsers)


// TEMPORAL: Endpoint de prueba de email
userRouter.post('/user/test-email', async (req: Request, res: Response) => {
    const emailService = new NodemailerEmailService();
    
    const result = await emailService.sendVerificationCode(
        'norbeymejiacortes@gmail.com', // ✅ Email específico sin comillas extras
        'Test User',
        '123456'
    );
    
    res.json({
        ok: result.success,
        message: result.success ? 'Email sent! Check your inbox and SPAM folder' : 'Failed to send',
        messageId: result.messageId,
        error: result.error
    });
});


export default userRouter;