import express from "express";
import Stripe from "stripe";
import Order from '../models/orders.js';
const striperoute = express.Router();

/*-- dotenv start --*/
import dotenv from "dotenv";
dotenv.config();

const stripe = Stripe(process.env.STRIPE_KEY);



striperoute.post('/create-checkout-session', async (req, res) => {

    const line_items = req.body.cartItems.map(item => {
        
        const image = item.image; // Since image is directly under the `image` key
        
        
        const data = req.body;
        console.log(data);
        return {
            price_data: {
                currency: 'pkr',
                product_data: {
                    name: item.name,
                    images: image ? [image] : [], // Ensure it's an array of image URLs
                    description: item.description,
                    metadata: {
                        id: item.id,
                    }
                },
                unit_amount: Math.round(item.price * 100), // Round to nearest integer
            },
            quantity: item.qty,
        };
    });

    try {
        const session = await stripe.checkout.sessions.create({
            line_items,
            phone_number_collection: {
                enabled: true,
            },
            automatic_tax: {
                enabled: true,
            },
            mode: 'payment',
            submit_type:"pay",
            payment_method_types:["card"],

            shipping_options: [
{
    shipping_rate:"shr_1QZF4HRrwkS23fglD5hHZDvh"
}
],
            success_url: 'http://localhost:3000/checkout-success',
            cancel_url: 'http://localhost:3000/checkout-cancel',
        });
        // res.send({ url: session.url });
        // const newOrder = await Order.save();
        res.send(
            JSON.stringify({
            //   orderId: newOrder._id.toString(),
              url: session.url,
            })
          );
    } catch (error) {
        console.error("Stripe checkout session creation failed:", error); // Log the error
        res.status(500).json({ message: error.message });
    }
    
});



export default striperoute;
