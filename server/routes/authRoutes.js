const express = require('express');
const router = express.Router();
const { registerUser, loginUser, sendOTP, verifyOTP } = require('../controllers/authController');
const { getUserProfile, updateUserProfile, uploadPrescription, getUserCart, addToCart, removeFromCart, getUsers, deleteUser, updateUser } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware'); // Import admin middleware
const upload = require('../middleware/uploadMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/upload-prescription', protect, upload.single('prescription'), uploadPrescription);
router.route('/cart').get(protect, getUserCart).post(protect, addToCart);
router.route('/cart/:id').delete(protect, removeFromCart);
router.route('/').get(protect, admin, getUsers);
router.route('/:id')
    .delete(protect, admin, deleteUser)
    .put(protect, admin, updateUser);

module.exports = router;
