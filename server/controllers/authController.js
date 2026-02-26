const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, phone } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ name, email, password, phone });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Send OTP to phone
// @route   POST /api/users/send-otp
// @access  Public
const sendOTP = async (req, res) => {
    const { phone } = req.body;

    try {
        let user = await User.findOne({ phone });

        // For simplicity, if user doesn't exist, we could create one or just notify
        // Here we'll allow registration via OTP as well
        if (!user) {
            user = await User.create({
                name: `User-${phone.slice(-4)}`,
                email: `${phone}@placeholder.com`,
                password: Math.random().toString(36).slice(-8), // Dummy password
                phone,
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        // MOCK: Send OTP (In production, use Twilio, Msg91, etc.)
        console.log(`[AUTH] OTP for ${phone}: ${otp}`);

        // In development mode, we return the OTP in the response so the user can see it
        const responseData = { message: 'OTP sent successfully' };
        if (process.env.NODE_ENV === 'development') {
            responseData.devOtp = otp; // ONLY for development testing!
        }

        res.json(responseData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Verify OTP & Login
// @route   POST /api/users/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
    const { phone, otp } = req.body;

    try {
        const user = await User.findOne({ phone });

        if (user && user.otp === otp && user.otpExpiry > Date.now()) {
            user.otp = undefined;
            user.otpExpiry = undefined;
            await user.save();

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid or expired OTP' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { registerUser, loginUser, sendOTP, verifyOTP };
