const Booking = require("../models/Booking");
const Experience = require("../models/Experience");

// POST /bookings
exports.createBooking = async (req, res) => {
  try {
    const { name, email, experienceId, slot, totalPrice, promoCode } = req.body;

    // basic validation
    if (!name || !email || !experienceId || !slot?.date || !slot?.time)
      return res.status(400).json({ message: "Missing fields" });

    // Check for duplicate booking by same email for same experience and slot
    const existingBooking = await Booking.findOne({
      email: email.toLowerCase().trim(),
      experienceId,
      "slot.date": slot.date,
      "slot.time": slot.time,
    });

    if (existingBooking) {
      return res.status(400).json({
        message:
          "You have already booked this experience for the selected date and time",
        isDuplicate: true,
      });
    }

    const exp = await Experience.findById(experienceId);
    if (!exp) return res.status(404).json({ message: "Experience not found" });

    // Check if slot is available
    const slotIndex = exp.slots.findIndex(
      (s) => s.date === slot.date && s.time === slot.time
    );
    if (slotIndex === -1)
      return res.status(400).json({ message: "Invalid slot" });

    // Check availability count
    if (
      exp.slots[slotIndex].availability <= 0 ||
      exp.slots[slotIndex].isBooked
    ) {
      return res
        .status(400)
        .json({ message: "This time slot is no longer available" });
    }

    // Decrease availability
    exp.slots[slotIndex].availability -= slot.qty || 1;

    // Mark as booked if no spots left
    if (exp.slots[slotIndex].availability <= 0) {
      exp.slots[slotIndex].isBooked = true;
    }

    await exp.save();

    const newBooking = await Booking.create({
      name,
      email: email.toLowerCase().trim(),
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
