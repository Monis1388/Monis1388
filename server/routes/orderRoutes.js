const express = require('express');
const router = express.Router();
const {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    updateOrderToShipped,
    getDashboardStats,
    getMyOrders,
    getOrders,
    getServiceability,
    createRazorpayOrder,
    trackOrder,
    deleteOrder,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/razorpay').post(protect, createRazorpayOrder);
router.route('/serviceability/:pincode').get(protect, getServiceability);
router.route('/stats').get(protect, admin, getDashboardStats);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById).delete(protect, admin, deleteOrder);
router.route('/:id/track').get(protect, trackOrder);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/ship').put(protect, admin, updateOrderToShipped);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

module.exports = router;
