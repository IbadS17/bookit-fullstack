const express = require("express");
const router = express.Router();
const {
  getExperiences,
  getExperienceById,
} = require("../controllers/experienceController");

router.get("/", getExperiences);
router.get("/:id", getExperienceById);

module.exports = router;
