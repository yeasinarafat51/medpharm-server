const express = require("express");

const {
  addSlider,
  getSliders,
  getActiveSliders,
  getSingleSlider,
  updateSlider,
  toggleSlider,
  deleteSlider,
} = require("../controllers/slider.controller");

const router = express.Router();

// =====================================================
// GET ACTIVE SLIDERS
// =====================================================

router.get("/active", getActiveSliders);

// =====================================================
// GET ALL SLIDERS
// =====================================================

router.get("/", getSliders);

// =====================================================
// GET SINGLE SLIDER
// =====================================================

router.get("/:id", getSingleSlider);

// =====================================================
// ADD SLIDER
// =====================================================

router.post("/", addSlider);

// =====================================================
// UPDATE SLIDER
// =====================================================

router.put("/:id", updateSlider);

// =====================================================
// TOGGLE ACTIVE / INACTIVE
// =====================================================

router.patch("/:id/toggle", toggleSlider);

// =====================================================
// DELETE SLIDER
// =====================================================

router.delete("/:id", deleteSlider);

module.exports = router;
