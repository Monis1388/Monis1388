const { createShipment, checkServiceability, trackShipment } = require('../services/delhiveryService');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            res.status(400).json({ message: 'No order items' });
            return;
        } else {
            const order = new Order({
                orderItems,
                user: req.user._id,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
            });

            const createdOrder = await order.save();
            res.status(201).json(createdOrder);
        }
    } catch (error) {
        console.error('addOrderItems Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate(
            'user',
            'name email'
        );

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error('getOrderById Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.email_address,
            };

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error('updateOrderToPaid Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.json(orders);
    } catch (error) {
        console.error('getMyOrders Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name');
        res.json(orders);
    } catch (error) {
        console.error('getOrders Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
            order.orderStatus = 'Delivered';

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            console.error('updateOrderToDelivered Error: Order not found');
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error('updateOrderToDelivered Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order to shipped (Admin)
// @route   PUT /api/orders/:id/ship
// @access  Private/Admin
const updateOrderToShipped = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            const shipmentData = await createShipment(order);

            // Delhivery returns waybill inside the 'packages' array
            if (shipmentData && shipmentData.packages && shipmentData.packages.length > 0) {
                order.trackingId = shipmentData.packages[0].waybill;
                order.orderStatus = 'Shipped';
            } else if (shipmentData.shipment_id) { // Handle mock response
                order.trackingId = shipmentData.awb_code;
                order.orderStatus = 'Shipped';
            } else {
                return res.status(400).json({ message: 'Delhivery shipment creation failed', detail: shipmentData });
            }

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error('updateOrderToShipped Error:', error);
        res.status(500).json({ message: error.message });
    }
}

// @desc    Get Data Stats
// @route   GET /api/orders/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const ordersCount = await Order.countDocuments();
        const productsCount = await Product.countDocuments();
        const usersCount = await User.countDocuments();

        const orders = await Order.find();
        const totalSales = orders.reduce((acc, order) => acc + (order.isPaid ? order.totalPrice : 0), 0);

        res.json({ ordersCount, productsCount, usersCount, totalSales });
    } catch (error) {
        console.error('getDashboardStats Error:', error);
        res.status(500).json({ message: error.message });
    }
}

// @desc    Check pincode serviceability
// @route   GET /api/orders/serviceability/:pincode
// @access  Private
const getServiceability = async (req, res) => {
    try {
        const data = await checkServiceability(req.params.pincode);
        res.json(data);
    } catch (error) {
        console.error('getServiceability Error:', error);
        res.status(500).json({ message: error.message });
    }
}

const razorpay = require('../config/razorpay');

// @desc    Create Razorpay Order
// @route   POST /api/orders/razorpay
// @access  Private
const createRazorpayOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || isNaN(amount)) {
            return res.status(400).json({ message: "Invalid amount provided" });
        }

        const options = {
            amount: Math.round(Number(amount) * 100), // amount in paise, must be an integer
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        console.log('Creating Razorpay order with options:', options);
        const order = await razorpay.orders.create(options);

        if (!order) {
            console.error('Razorpay order creation returned empty');
            return res.status(500).json({ message: "Failed to create Razorpay order" });
        }

        res.json(order);
    } catch (error) {
        console.error('createRazorpayOrder Error:', error);
        res.status(500).json({
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

module.exports = {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getOrders,
    updateOrderToShipped,
    getDashboardStats,
    getServiceability,
    createRazorpayOrder,
    trackOrder: async (req, res) => {
        try {
            const order = await Order.findById(req.params.id);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            if (!order.trackingId) {
                return res.status(400).json({ message: 'Tracking ID not found for this order' });
            }

            const trackingData = await trackShipment(order.trackingId);
            res.json(trackingData);
        } catch (error) {
            console.error('trackOrder Error:', error);
            res.status(500).json({ message: error.message });
        }
    },
    deleteOrder: async (req, res) => {
        try {
            const order = await Order.findById(req.params.id);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            await Order.deleteOne({ _id: req.params.id });
            res.json({ message: 'Order deleted successfully' });
        } catch (error) {
            console.error('deleteOrder Error:', error);
            res.status(500).json({ message: error.message });
        }
    }
};
