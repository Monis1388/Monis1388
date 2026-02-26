const { createShipment, checkServiceability } = require('../services/delhiveryService');
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
            // Mock shipment creation
            const shipment = await createShipment(order);
            order.orderStatus = 'Shipped';
            // Delhivery returns waybill or packages array usually, adjust based on actual API response structure
            order.trackingId = shipment.awb_code || shipment.waybill || `DLV-${Date.now()}`;

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

module.exports = {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getOrders,
    updateOrderToShipped,
    getDashboardStats,
    getServiceability
};
