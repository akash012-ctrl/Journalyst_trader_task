import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import User, { IUser } from '../models/user';
import { generateToken } from '../middlewares/authMiddleware';
import Broker from '../models/broker';

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { username, email, password, firstName, lastName, brokerCodes } = req.body;
        // console.log(brokerCodes)
        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [
                { username },
                { email }
            ]
        });

        if (existingUser) {
            res.status(400).json({ message: 'Username or email already in use' });
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Find broker IDs based on broker codes provided
        const brokers = await Broker.find({ code: { $in: brokerCodes || [] } });
        console.log(brokers)
        const brokerIds = brokers.map(broker => broker._id);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            firstName,
            lastName,
            brokers: brokerIds
        });

        // Save user to database
        await newUser.save();

        // Generate token with broker codes
        const brokerCodesArray = brokers.map(broker => broker.code);
        const token = generateToken(
            newUser._id.toString(),
            newUser.username,
            brokerCodesArray
        );

        // Return user data (exclude password) and token
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                brokers: brokerCodesArray
            },
            token
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const user = await User.findOne({ username }).populate('brokers');

        if (!user) {
            res.status(401).json({ message: 'Invalid username or password' });
            return;
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid username or password' });
            return;
        }

        // Generate token with broker codes
        const brokerCodes = user.brokers.map((broker: any) => broker.code);
        const token = generateToken(
            user._id.toString(),
            user.username,
            brokerCodes
        );

        // Return user data (exclude password) and token
        res.json({
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                brokers: brokerCodes
            },
            token
        });
    } catch (error) {
        next(error);
    }
});

export default router;