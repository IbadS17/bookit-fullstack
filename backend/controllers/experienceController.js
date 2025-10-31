const Experience = require("../models/Experience");

// GET /experiences
exports.getExperiences = async (req, res) => {
  try {
    const exps = await Experience.find();
    res.json(exps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /experiences/:id
exports.getExperienceById = async (req, res) => {
  try {
    const exp = await Experience.findById(req.params.id);
    if (!exp) return res.status(404).json({ message: "Not found" });
    res.json(exp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
