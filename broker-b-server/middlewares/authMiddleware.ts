import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// JWT secret key - Should be in environment variables in production
// Use the same secret key across all servers for simplicity
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Interface for JWT payload
export interface JWTPayload {
    userId: string;
    brokers: string[];
}

// Extend Express Request interface to include user property
declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload;
        }
    }
}

/**
 * Middleware to authenticate JWT tokens for Broker B
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.header('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Authentication token is required' });
            return;
        }

        const token = authHeader.replace('Bearer ', '');

        try {
            const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

            // Check if user has access to broker B
            if (!decoded.brokers.includes('brokerB')) {
                res.status(403).json({ message: 'User does not have access to this broker' });
                return;
            }

            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Invalid or expired token' });
        }
    } catch (error) {
        next(error);
    }
};

export const verifyToken = authenticate;