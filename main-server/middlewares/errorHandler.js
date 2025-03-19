/**
 * Centralized error handling middleware
 * Handles errors and sends appropriate responses
 */
const errorHandler = (err, req, res, next) => {
    // Log error for server-side debugging
    console.error(`${new Date().toISOString()} - ERROR:`, err);

    // Determine HTTP status code
    const statusCode = err.statusCode || 500;

    // Standardized error response
    const errorResponse = {
        status: 'error',
        message: err.message || 'An unexpected error occurred',
        timestamp: new Date().toISOString()
    };

    // Add stack trace in development environment
    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = err.stack;
        errorResponse.details = err.details || {};
    }

    // Send response
    res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
