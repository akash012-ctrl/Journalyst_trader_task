import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';

// JWT secret key - Should be in environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Interface for JWT payload
export interface JWTPayload {
    userId: string;
    username: string;
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
 * Middleware to authenticate JWT tokens
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
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Invalid or expired token' });
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Generate JWT token for a user
 */
export const generateToken = (userId: string, username: string, brokers: string[]): string => {
    return jwt.sign(
        { userId, username, brokers },
        JWT_SECRET,
        { expiresIn: '24h' } // Token expires in 24 hours
    );
};

export const verifyToken = authenticate;