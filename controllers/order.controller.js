import Order from "../models/Orders.js";
import mongoose from "mongoose";
import User from "../models/User.js";

export const placeOrder = async (req, res, next) => {
  try {
    const { products } = req.body;
    const userId = req.userId; // Use userId from the token

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const total_amount = products.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    const estimatedDeliveryTime = new Date();
    estimatedDeliveryTime.setMinutes(estimatedDeliveryTime.getMinutes() + 45);

    const order = new Order({
      products: products.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
      })),
      user: user._id,
      total_amount,
      estimatedDeliveryTime, // Include estimated delivery time
      tracking_url: "Your tracking URL here", // Set a tracking URL if applicable
    });

    await order.save();
    user.cart = []; // Ensure user.cart is defined in User model
    await user.save();

    return res.status(201).json({
      message: "Order placed successfully",
      order,
      tracking_url: order.tracking_url,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const userId = req.userId; // Use the userId from the decoded token
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const orders = await Order.find({ user: user._id });

    return res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

export const handelPayments = async (req, res) => {
  const userId = req.userId; // Use userId from the token

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { orderId } = req.params; // Changed to destructure from params
  try {
    const order = await Order.findById(orderId); // Use orderId from params

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Create Payment Intent with error handling
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total_amount * 100), // Convert to cents
      currency: "usd",
      receipt_email: req.user.email, // Use the user email from token
      metadata: { integration_check: "accept_a_payment" },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
