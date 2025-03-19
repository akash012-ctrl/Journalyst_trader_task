import { JWTPayload } from './trade';

declare namespace Express {
    export interface Request {
        user?: JWTPayload;
    }
}