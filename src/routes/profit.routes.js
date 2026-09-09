const express = require("express");

const router = express.Router();

const { getProfitReport } = require("../controllers/profit.controller");

const verifyFirebaseToken = require("../middlewares/verifyFirebaseToken");
const verifyRole = require("../middlewares/verifyRole");

router.get(
  "/report",
  verifyFirebaseToken,
  verifyRole("super-admin"),
  getProfitReport,
);

module.exports = router;
