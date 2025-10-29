require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true, time: new Date() }));

// placeholder routes (we'll implement real ones later)
app.get("/api/experiences", (req, res) => res.json([]));
app.get("/api/experiences/:id", (req, res) => res.json({}));
app.post("/api/bookings", (req, res) =>
  res.status(201).json({ success: true })
);
app.post("/api/promo/validate", (req, res) => res.json({ valid: false }));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
