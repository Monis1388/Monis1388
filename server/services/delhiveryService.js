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
        let multiSourceData = {
            deliveryAvailable: false,
            city: null,
            state: null,
            source: null
        };

        // 1. Try Delhivery API
        if (DELHI_TOKEN) {
            try {
                const delhiUrl = `${DELHI_URL}/c/api/pin-codes/json/`;
                const response = await axios.get(delhiUrl, {
                    params: { filter: `pincode:${pincode}` },
                    headers: { 'Authorization': `Token ${DELHI_TOKEN}` }
                });

                if (response.data && response.data.delivery_details && response.data.delivery_details.length > 0) {
                    const details = response.data.delivery_details[0].pincode || response.data.delivery_details[0];
                    multiSourceData.deliveryAvailable = true;
                    multiSourceData.city = details.city;
                    multiSourceData.state = details.state || details.state_code;
                    multiSourceData.source = 'Delhivery';
                    return { status: true, ...multiSourceData };
                }
            } catch (err) {
                console.error('Delhivery API error:', err.message);
            }
        }

        // 2. Try Postal Pincode API Fallback (https://api.postalpincode.in/pincode/{pincode})
        try {
            const postalResponse = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
            if (postalResponse.data && postalResponse.data[0].Status === 'Success') {
                const postOffice = postalResponse.data[0].PostOffice[0];
                multiSourceData.deliveryAvailable = true;
                multiSourceData.city = postOffice.District;
                multiSourceData.state = postOffice.State;
                multiSourceData.source = 'PostalAPI';
                return { status: true, ...multiSourceData, message: 'Standard Logistics Available' };
            }
        } catch (err) {
            console.error('Postal API error:', err.message);
        }

        return { status: false, message: 'Pincode not serviceable' };
    } catch (error) {
        console.error('CheckServiceability Global error:', error.message);
        return { status: false, message: 'Shipping verification unavailable' };
    }
};

/**
 * Create a shipment with Delhivery
 */
const createShipment = async (order) => {
    try {
        if (!DELHI_TOKEN) {
            return { shipment_id: `MOCK-${order._id}`, awb_code: `MOCK-${Date.now()}` };
        }

        // Delhivery expects a specific format for shipments
        const payload = {
            shipments: [{
                add: order.shippingAddress.address,
                city: order.shippingAddress.city,
                pin: order.shippingAddress.postalCode,
                phone: order.user?.phone || '0000000000',
                name: order.user?.name || 'Customer',
                order: order._id,
                payment_mode: order.paymentMethod === 'COD' ? 'COD' : 'Prepaid',
                amount: order.totalPrice,
            }],
            pickup_location: {
                name: "PATEL_OPTICAL_MAIN",

                // Must match Delhivery Dashboard
                add: "Shop No. 5, Optical Street",
                city: "Mumbai",
                pin: "400001",
                phone: "9876543210"
            }

            // add your pickup address details here
        };

        const response = await axios.post(`${DELHI_URL}/api/cmu/create.json`, payload, {
            headers: {
                'Authorization': `Token ${DELHI_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Delhivery Shipment Creation error:', error.response?.data || error.message);
        return { error: true, message: error.message };
    }
};

/**
 * Track a shipment by AWB code
 */
const trackShipment = async (awb) => {
    try {
        if (!DELHI_TOKEN) {
            return { packages: [{ status: { status: 'In Transit (Mock)', location: 'Origin Hub' }, waybill: awb }] };
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
