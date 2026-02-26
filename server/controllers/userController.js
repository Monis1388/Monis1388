const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                address: user.address,
                savedPrescriptions: user.savedPrescriptions,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;
            if (req.body.password) {
                user.password = req.body.password;
            }
            if (req.body.address) {
                user.address = req.body.address;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                role: updatedUser.role,
                address: updatedUser.address,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Upload Prescription
// @route   POST /api/users/upload-prescription
// @access  Private
const uploadPrescription = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }
        const user = await User.findById(req.user._id);
        if (user) {
            // In a real app, upload to Cloudinary/S3 here and save URL
            // For now, save local path
            const filePath = req.file.path.replace('\\', '/'); // Fix windows paths
            user.savedPrescriptions.push(filePath);
            await user.save();
            res.json({ message: 'Prescription uploaded', filePath: filePath });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

// @desc Get user cart
// @route GET /api/users/cart
// @access Private
const getUserCart = async (req, res) => {
    const user = await User.findById(req.user._id).populate('cart.product');
    res.json(user.cart);
}

// @desc Add to cart
// @route POST /api/users/cart
// @access Private
const addToCart = async (req, res) => {
    const { productId, name, image, price, qty, lensPower } = req.body;
    const user = await User.findById(req.user._id);

    const itemExists = user.cart.find(x => x.product.toString() === productId);

    if (itemExists) {
        itemExists.qty = qty; // Update qty
        if (lensPower) itemExists.lensPower = lensPower;
    } else {
        user.cart.push({ product: productId, name, image, price, qty, lensPower });
    }
    await user.save();
    res.json(user.cart);
}

// @desc Remove from cart
// @route DELETE /api/users/cart/:id
// @access Private
const removeFromCart = async (req, res) => {
    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter(x => x.product.toString() !== req.params.id);
    await user.save();
    res.json(user.cart);
}

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.error('getUsers Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
}

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
}

module.exports = { getUserProfile, updateUserProfile, uploadPrescription, getUserCart, addToCart, removeFromCart, getUsers, deleteUser, updateUser };
