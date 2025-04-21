import express from "express";
import Stripe from "stripe";
import { userAuth } from "../middlewares/userAuth.js";

const client_domain = process.env.CLIENT_DOMAIN;
const stripe = Stripe(process.env.Stripe_Private_Api_Key);

const router = express.Router();

// ✅ Create Checkout Session
router.post("/create-checkout-session", userAuth, async (req, res) => {
  try {
    const { products, bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ error: "Missing bookingId" });
    }

    const lineItems = products.map((product) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: product?.carId?.name || "Car",
          images: [product?.carId?.image || ""],
        },
        unit_amount: Math.round(product?.carId?.price * 100),
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${client_domain}/user/payment/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
      cancel_url: `${client_domain}/user/payment/cancel`,
    });

    res.json({ success: true, sessionId: session.id });
  } catch (error) {
    console.error("Stripe session error:", error);
    res.status(error.status || 500).json({ error: error.message || "Internal Server Error" });
  }
});

// ✅ Get Checkout Session Status
router.get("/session-status", async (req, res) => {
  try {
    const sessionId = req.query.session_id;

    if (!sessionId) {
      return res.status(400).json({ message: "Missing session_id" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    res.status(200).json({
      data: session,
      status: session?.status,
      customer_email: session?.customer_details?.email,
    });
  } catch (error) {
    console.error("Session status error:", error);
    res.status(error?.statusCode || 500).json({ message: error.message || "Internal Server Error" });
  }
});

export { router as paymentRouter };