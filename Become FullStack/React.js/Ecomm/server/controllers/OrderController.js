import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items, address } = req.body;

    if (!address || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Address and items are required." });
    }

    let amount = 0;

    for (const item of items) {
      // Check if product ID is valid
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        return res.status(400).json({ success: false, message: `Invalid Product ID: ${item.product}` });
      }

      const product = await Product.findById(item.product).lean();
      if (!product) {
        return res.status(404).json({ success: false, message: `Product with ID ${item.product} not found.` });
      }

      amount += (product.offerPrice || product.price) * item.quantity;
    }

    const tax = amount * 0.02;
    amount = parseFloat((amount + tax).toFixed(2));

    const COD_PAYMENT_CODE = 0;

    const newOrder = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: COD_PAYMENT_CODE,
      isPaid: false,
      status: "Order Placed",
    });

    return res.json({
      success: true,
      message: "Order Placed Successfully",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ success: false, message: "Internal Server Error: " + error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const COD_PAYMENT_CODE = 0;

    const orders = await Order.find({
      userId,
      $or: [{ paymentType: COD_PAYMENT_CODE }, { isPaid: true }],
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ success: false, message: "Internal Server Error: " + error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const COD_PAYMENT_CODE = 0;

    const orders = await Order.find({
      $or: [{ paymentType: COD_PAYMENT_CODE }, { isPaid: true }],
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ success: false, message: "Internal Server Error: " + error.message });
  }
};
