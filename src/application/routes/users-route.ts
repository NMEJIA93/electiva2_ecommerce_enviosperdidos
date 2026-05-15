import express, { Router } from 'express';
import { useParamValidation } from '../middlewares/users-validators';

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




export default userRouter;