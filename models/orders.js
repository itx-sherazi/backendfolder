import mongoose from 'mongoose';

const { model, Schema, ObjectId } = mongoose;

const orderSchema = new Schema(
	{
		user: {
			type: ObjectId,
			required: true,
			ref: 'User',
		},
		username: {
			type: String,
			required: true,
			ref: 'User',
		},
		email: {
			type: String,
			required: true,
			ref: 'User',
		},
		orderItems: [
			{
				name: { type: String, required: true },	
				qty: { type: Number, required: true },
				image: { type: String, required: true },
				price: { type: Number, required: true },
				id: {
					type: ObjectId,
					required: true,
					ref: 'Product',
				},
			},
		],
		shippingAddress: {
			address: { type: String, required: true },
			city: { type: String, required: true },
			postalCode: { type: String, required: true },
			country: { type: String, required: true },
		},
		shippingPrice: { type: Number, default: 0.0 },
		totalPrice: { type: Number, default: 0.0 },
		subtotal: { type: Number, default: 0.0 },
		isDelivered: { type: Boolean, required: true, default: false },

		deliveredAt: {
			type: Date,
		},
	},
	{ timestamps: true }
);

const Order = model('Order', orderSchema);
export default Order;