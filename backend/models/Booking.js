const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, lowercase: true, trim: true },
    experienceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Experience",
      required: true,
    },
    slot: {
      date: String,
      time: String,
      qty: { type: Number, default: 1 },
    },
    totalPrice: Number,
    promoCode: String,
    status: { type: String, default: "confirmed" },
  },
  { timestamps: true }
);

// Create compound index to prevent duplicate bookings and improve query performance
bookingSchema.index(
  { email: 1, experienceId: 1, "slot.date": 1, "slot.time": 1 },
  { unique: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
