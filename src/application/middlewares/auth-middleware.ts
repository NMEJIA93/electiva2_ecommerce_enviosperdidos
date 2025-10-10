import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../../domain/services/auth-services';
import { buildErrorResponse } from '../dtos/auth-dtos';

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json(
            buildErrorResponse('Unauthorized', 'Access token is required')
        );
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json(
            buildErrorResponse('Forbidden', 'Invalid or expired token')
        );
    }
};


export function authorizeRole(requiredRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        console.log('User info from token:', req.user); 
        const user = req.user;
        if (!user || !requiredRoles.includes(user.roleId)) {
            return res.status(403).json({ error: 'You do not have permission to perform this action' });
        }
        next();
    };
}

export function authorizeProfileAccess(request: Request, response: Response, next: NextFunction) {
    const userIdFromToken = request.user?.id;
    const userIdFromParams = request.params.id;

    if (!userIdFromToken || userIdFromToken !== userIdFromParams) {
        return response.status(403).json({
            ok: false,
            error: 'You do not have permission to access or modify this profile'
        });
    }
    next();
}