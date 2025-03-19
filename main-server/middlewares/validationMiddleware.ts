import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema, ZodError } from 'zod';
import { brokerATradeSchema, brokerBTradeSchema, analyticsRequestSchema } from '../src/utils/validation';

/**
 * Factory function to create a validation middleware for a given schema
 * @param schema The Zod schema to validate against
 * @returns Express middleware function
 */
export const validateRequest = <T extends ZodSchema>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body against schema
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: 'Validation error',
          errors: error.errors.map(e => ({
            path: e.path.join('.'),
            message: e.message
          }))
        });
      }
      next(error);
    }
  };
};

/**
 * Middleware to validate Broker A trade data
 */
export const validateBrokerATrade = validateRequest(brokerATradeSchema);

/**
 * Middleware to validate Broker B trade data
 */
export const validateBrokerBTrade = validateRequest(brokerBTradeSchema);

/**
 * Middleware to validate analytics request
 */
export const validateAnalyticsRequest = validateRequest(analyticsRequestSchema);

/**
 * Generic error handling middleware
 */
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation error',
      errors: err.errors.map(e => ({
        path: e.path.join('.'),
        message: e.message
      }))
    });
  }

  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
};