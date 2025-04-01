const SSLCommerzPayment = require("sslcommerz-lts");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const Booking = require("../models/Booking");
const dotenv = require("dotenv");

dotenv.config();

const store_id = process.env.NEXT_PUBLIC_SSL_STORE_ID;
const store_passwd = process.env.NEXT_PUBLIC_SSL_STORE_PASSWORD;
const is_live = false; // Change to true in production
// Initialize Transaction
exports.initTransaction = async (req, res) => {
  try {
    const { userId, price, address, name, bookingId } = req.body;

    // Validate required fields
    if (!userId || !price || !address || !name || !bookingId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: userId, price, address, name, bookingId",
      });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Find booking
    const booking = await Booking.findById(bookingId).populate("providerId");
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    const providerEmail = booking.providerId.email; // Get provider email

    // Create transaction
    const transaction = new Transaction({
      price,
      userId,
      address,
      name,
      bookingId,
      status: "Pending",
    });

    await transaction.save();

    // Prepare SSLCommerz payment data
    const data = {
      total_amount: price,
      currency: "BDT",
      tran_id: transaction._id.toString(),
      success_url: `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/transactions/sslcommerz/success/${transaction._id}`,
      fail_url: `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/transactions/sslcommerz/fail/${transaction._id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/transactions/cancel/${transaction._id}`,
      cus_name: user.name,
      cus_email: user.email,
      cus_phone: user.phone || "01700000000",
      cus_add1: user.address || "Dhaka",
      cus_city: "Dhaka",
      cus_country: "Bangladesh",
      provider_email: providerEmail, // Send provider email
      product_name: "Service Payment",
      product_category: "Services",
      product_profile: "general",
      shipping_method: "NO",
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data);

    if (apiResponse && apiResponse.GatewayPageURL) {
      res.json({ success: true, url: apiResponse.GatewayPageURL, providerEmail });
    } else {
      res.status(500).json({ success: false, message: "SSLCommerz initialization failed" });
    }
  } catch (error) {
    console.error("Transaction Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


const nodemailer = require("nodemailer");

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Handle Successful Payment
exports.successTransaction = async (req, res) => {
  try {
    const { tran_id } = req.params;
    const transaction = await Transaction.findById(tran_id);

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    transaction.status = "Success";
    await transaction.save();

    // Update booking payment status to Paid
    const booking = await Booking.findById(transaction.bookingId).populate("providerId");
    if (booking) {
      booking.paymentStatus = "success";
      await booking.save();
    }

    // Send Email Notification to Provider
    if (booking.providerId.email) {
      const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: booking.providerId.email,
        subject: "New Payment Received",
        text: `Dear ${booking.providerId.name},\n\nA payment of BDT ${transaction.price} has been received for your service.\n\nBest regards,\nYour Company`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Email sending failed:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });
    }
    res.redirect(`${process.env.NEXT_PUBLIC_APP_FRONTEND_URL}/payment-success/${tran_id}`);

  } catch (error) {
    console.error("Success Transaction Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// Handle Failed Payment
exports.failTransaction = async (req, res) => {
  try {
    const { tran_id } = req.params;
    const transaction = await Transaction.findById(tran_id);

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    transaction.status = "Failed";
    await transaction.save();

    res.redirect(`${process.env.NEXT_PUBLIC_APP_FRONTEND_URL}/payment-failed/${tran_id}`);
  } catch (error) {
    console.error("Failed Transaction Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get Transaction by ID
exports.getTransaction = async (req, res) => {
  try {
    const { tran_id } = req.params;
    const transaction = await Transaction.findById(tran_id);

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    res.json({ success: true, transaction });
  } catch (error) {
    console.error("Get Transaction Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
