const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  date: String, // e.g. "2025-11-10"
  time: String, // e.g. "10:00 AM"
  isBooked: { type: Boolean, default: false },
  availability: { type: Number, default: 0 }, // 0 = sold out, 2-5 = available count
});

const experienceSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  image: String,
  price: Number,
  slots: [slotSchema],
});

module.exports = mongoose.model("Experience", experienceSchema);
