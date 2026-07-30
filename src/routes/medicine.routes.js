const express = require("express");

const {
  addMedicine,
  getMedicines,
  deleteMedicine,
  getSingleMedicine,
  updateMedicine,
} = require("../controllers/medicine.controller");

const router = express.Router();

router.post("/", addMedicine);

router.get("/", getMedicines);

router.delete("/:id", deleteMedicine);
router.get("/:id", getSingleMedicine);

router.put("/:id", updateMedicine);
module.exports = router;
