const Booking = require("../models/Booking");
const User = require("../models/User");
const nodemailer = require("nodemailer");

// Create Nodemailer transporter using the environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,  // smtp.gmail.com
  port: process.env.SMTP_PORT,  // 587
  secure: false,  // false for TLS, true for SSL
  auth: {
    user: process.env.SMTP_EMAIL,  // Your email (amitkmrsharma292@gmail.com)
    pass: process.env.SMTP_PASSWORD,  // Your email password or app password
  },
});

// Create Booking Request
exports.createBooking = async (req, res) => {
  try {
    const { userId, providerId, description } = req.body;

    const user = await User.findById(userId);
    const provider = await User.findById(providerId);
    if (!user || !provider || provider.role !== "provider") {
      return res.status(400).json({ message: "Invalid user or provider" });
    }

    const booking = new Booking({ userId, providerId, description });
    await booking.save();

    // Send email to provider with accept/reject options
    const emailHtml = `
      <p>Hello ${provider.name},</p>
      <p><strong>${user.name}</strong> wants to book your service.</p>
      <p><strong>Description:</strong> ${description}</p>
      <p>Please set a price and choose an action:</p>
      <form action="${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/bookings/respond" method="GET">
        <input type="hidden" name="bookingId" value="${booking._id}" />
        <input type="number" name="price" placeholder="Set price (BDT)" required />
        <button type="submit" name="status" value="accepted">Accept</button>
        <button type="submit" name="status" value="rejected">Reject</button>
      </form>
    `;

    await transporter.sendMail({
      from: process.env.FROM_EMAIL,  // Your email
      to: provider.email,
      subject: `${user.name} wants to book your appointment`,
      html: emailHtml,
    });

    res.status(201).json({ message: "Booking request sent", booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Handle Accept/Reject from Provider
exports.handleBookingResponse = async (req, res) => {
  const { bookingId, status, price } = req.query;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(400).json({ message: "Booking not found" });
    }

    if (status === "accepted") {
      booking.status = "accepted";
      booking.price = price;
    } else if (status === "rejected") {
      booking.status = "rejected";
    } else {
      return res.status(400).json({ message: "Invalid status" });
    }

    await booking.save();

    // Send email to user with booking status
    const user = await User.findById(booking.userId);
    const emailHtml = `
      <p>Hello ${user.name},</p>
      <p>Your booking request has been ${status === "accepted" ? "accepted" : "rejected"} by the provider.</p>
      <p>${status === "accepted" ? `Price: ${price} BDT` : ""}</p>
    `;

    await transporter.sendMail({
      from: process.env.FROM_EMAIL,  // Your email
      to: user.email,
      subject: `Booking ${status === "accepted" ? "Accepted" : "Rejected"}`,
      html: emailHtml,
    });

    res.status(200).json({ message: `Booking ${status} successfully`, booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Booking Status for User
exports.getBookingStatus = async (req, res) => {
  const { bookingId } = req.params; // URL থেকে bookingId নেওয়া হচ্ছে

  try {
    const booking = await Booking.findById(bookingId).populate("userId providerId");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking); // বুকিং তথ্য পাঠানো হচ্ছে
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await Booking.find({ userId }).populate("providerId", "name email");

    if (!bookings.length) {
      return res.status(404).json({ message: "No bookings found" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getallBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("userId providerId", "name email");

    if (!bookings.length) {
      return res.status(404).json({ message: "No bookings found" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}




