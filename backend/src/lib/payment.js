import Razorpay from "razorpay";
import crypto from "crypto";

// Debug: Log Razorpay credentials (remove in production)
console.log("Razorpay Key ID:", process.env.RAZORPAY_KEY_ID ? "✓ Set" : "✗ Not Set");
console.log("Razorpay Key Secret:", process.env.RAZORPAY_KEY_SECRET ? "✓ Set" : "✗ Not Set");

// Initialize Razorpay instance
export const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order
export const createOrder = async (amount, receipt) => {
  try {
    // Validate Razorpay credentials
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("Razorpay credentials not configured");
      return { success: false, error: "Razorpay credentials not configured" };
    }

    const options = {
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: receipt,
    };

    console.log("Creating Razorpay order with options:", { amount: options.amount, currency: options.currency, receipt: options.receipt });

    // Try-catch specifically for the Razorpay API call
    try {
      const order = await razorpayInstance.orders.create(options);
      console.log("Razorpay order created successfully:", order.id);
      return { success: true, order };
    } catch (razorpayError) {
      console.error("Razorpay API Error:", razorpayError);

      // Check if it's an authentication error
      if (razorpayError.statusCode === 401 || razorpayError.statusCode === 400) {
        console.error("Authentication failed - Check your Razorpay API credentials");
        return { success: false, error: "Invalid Razorpay credentials" };
      }

      throw razorpayError;
    }
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    console.error("Error details:", {
      message: error.message,
      description: error.description,
      statusCode: error.statusCode,
      error: error.error,
      stack: error.stack
    });
    return { success: false, error: error.message || "Failed to create order" };
  }
};

// Verify payment signature
export const verifyPaymentSignature = (orderId, paymentId, signature) => {
  try {
    const text = orderId + "|" + paymentId;
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest("hex");

    return generatedSignature === signature;
  } catch (error) {
    console.error("Error verifying payment signature:", error);
    return false;
  }
};

