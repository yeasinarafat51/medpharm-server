
const express = require("express");

const {
  getAllSpecialOffers,
  getActiveSpecialOffers,
  addSpecialOffer,
  updateSpecialOffer,
  deleteSpecialOffer,
  toggleSpecialOffer,
} = require("../controllers/specialOfferController");

const router = express.Router();

router.get("/active", getActiveSpecialOffers);

router.get("/", getAllSpecialOffers);

router.post("/", addSpecialOffer);

router.put("/:id", updateSpecialOffer);

router.delete("/:id", deleteSpecialOffer);

router.patch("/:id/toggle", toggleSpecialOffer);

module.exports = router;

