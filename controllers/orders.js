import Order from '../models/orders.js';
import asyncHandler from 'express-async-handler';


const fetchUserOrders = asyncHandler(async (req, res) => {

    const orders = await Order.find({ user: req.params.id });
	if (orders) {
		JSON.stringify(orders);
	} else {
		JSON.stringify({ error: 'No orders could be found.' });
		throw new Error('No Orders found.');
	}

});

const fetchOrders = asyncHandler(async (req, res) => {
	const orders = await Order.find({});
	JSON.stringify(orders);
});

const deleteOrder = asyncHandler(async (req, res) => {
	const order = await Order.findByIdAndDelete(req.params.id);
	if (order) {
		JSON.stringify(order);
	} else {
		res.send('Order not found.');
		throw new Error('Order not found.');
	}
});

const setDelivered = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id);

	if (order) {
		order.isDelivered = true;
		const updatedOrder = await order.save();
		JSON.stringify(updatedOrder);
	} else {
		res.send('Order could not be uploaded.');
		throw new Error('Order could not be updated.');
	}
});

export { 
    fetchUserOrders,
	fetchOrders,
	deleteOrder,
	setDelivered
};