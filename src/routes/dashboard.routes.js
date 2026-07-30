const express = require("express");
const router = express.Router();

const {
  getAdminStats,
  getSalesReport,
  getRecentOrders,
} = require("../controllers/dashboard.controller");

router.get("/admin-stats", getAdminStats);

router.get("/sales-report", getSalesReport);

router.get("/recent-orders", getRecentOrders);

module.exports = router;
