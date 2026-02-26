const axios = require('axios');

const DELHI_TOKEN = process.env.DELHIVERY_TOKEN;
const DELHI_URL = process.env.NODE_ENV === 'production'
    ? 'https://track.delhivery.com'
    : 'https://staging-express.delhivery.com';

/**
 * Check if a pin code is serviceable by Delhivery
 */
const checkServiceability = async (pincode) => {
    try {
        if (!DELHI_TOKEN) {
            console.log('Delhivery token not found, returning mock serviceability');
            return { status: true, message: 'Mock Serviceable' };
        }

        const response = await axios.get(`${DELHI_URL}/c/api/pin-codes/json/`, {
            params: { filter: `pincode:${pincode}` },
            headers: { 'Authorization': `Token ${DELHI_TOKEN}` }
        });

        return response.data;
    } catch (error) {
        console.error('Delhivery Serviceability Check failed', error.message);
        return { status: false, message: error.message };
    }
};

/**
 * Create a shipment with Delhivery
 */
const createShipment = async (order) => {
    try {
        if (!DELHI_TOKEN) {
            console.log('Delhivery token not found, using mock mode');
            return {
                shipment_id: `DELHI-${order._id}`,
                awb_code: `DLV-${Date.now()}`
            };
        }

        // Delhivery expects a specific format for shipments
        const payload = {
            shipments: [{
                add: order.shippingAddress.address,
                city: order.shippingAddress.city,
                pin: order.shippingAddress.postalCode,
                phone: order.user?.phone || '9999999999',
                name: order.user?.name || 'Customer',
                order: order._id,
                payment_mode: order.paymentMethod === 'COD' ? 'COD' : 'Prepaid',
                amount: order.totalPrice,
            }],
            pickup_location: {
                name: "PATEL_OPTICAL_MAIN",
                // add your pickup address details here
            }
        };

        const response = await axios.post(`${DELHI_URL}/api/cmu/create.json`, payload, {
            headers: {
                'Authorization': `Token ${DELHI_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Delhivery Shipment Creation Failed', error.message);
        return { error: true, message: error.message };
    }
};

/**
 * Track a shipment by AWB code
 */
const trackShipment = async (awb) => {
    try {
        if (!DELHI_TOKEN) {
            return { tracking_data: { status: 'In Transit (Mock)', location: 'Origin Hub' } };
        }

        const response = await axios.get(`${DELHI_URL}/api/v1/packages/json/`, {
            params: { waybill: awb },
            headers: { 'Authorization': `Token ${DELHI_TOKEN}` }
        });

        return response.data;
    } catch (error) {
        console.error('Delhivery Tracking Failed', error.message);
        return null;
    }
}

module.exports = { checkServiceability, createShipment, trackShipment };
