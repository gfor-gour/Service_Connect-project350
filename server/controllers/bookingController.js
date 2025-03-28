const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  try {
    const { providerId, clientId } = req.body;

    if (!providerId || !clientId) {
      return res.status(400).json({ message: 'Provider ID and Client ID are required' });
    }

    const newBooking = new Booking({
      provider: providerId,
      client: clientId,
      createdAt: new Date(),
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error('Error creating booking:', error.message);
    res.status(500).json({ message: 'Error creating booking' });
  }
};