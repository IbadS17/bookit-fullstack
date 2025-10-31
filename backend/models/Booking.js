const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  experienceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Experience",
    required: true,
  },
  slot: {
    date: String,
    time: String,
  },
  totalPrice: Number,
  promoCode: String,
  status: { type: String, default: "confirmed" },
});

module.exports = mongoose.model("Booking", bookingSchema);
