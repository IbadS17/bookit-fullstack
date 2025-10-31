const Booking = require("../models/Booking");
const Experience = require("../models/Experience");

// POST /bookings
exports.createBooking = async (req, res) => {
  try {
    const { name, email, experienceId, slot, totalPrice, promoCode } = req.body;

    // basic validation
    if (!name || !email || !experienceId || !slot?.date || !slot?.time)
      return res.status(400).json({ message: "Missing fields" });

    const exp = await Experience.findById(experienceId);
    if (!exp) return res.status(404).json({ message: "Experience not found" });

    // Prevent double booking
    const slotIndex = exp.slots.findIndex(
      (s) => s.date === slot.date && s.time === slot.time
    );
    if (slotIndex === -1)
      return res.status(400).json({ message: "Invalid slot" });
    if (exp.slots[slotIndex].isBooked)
      return res.status(400).json({ message: "Slot already booked" });

    exp.slots[slotIndex].isBooked = true;
    await exp.save();

    const newBooking = await Booking.create({
      name,
      email,
      experienceId,
      slot,
      totalPrice,
      promoCode,
    });

    res.status(201).json({ success: true, booking: newBooking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
