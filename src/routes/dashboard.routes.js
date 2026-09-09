const express = require("express");

const router = express.Router();

const {
  getAdminStats,
  getSalesReport,
  getRecentOrders,
} = require("../controllers/dashboard.controller");

const verifyFirebaseToken = require("../middlewares/verifyFirebaseToken");
const verifyRole = require("../middlewares/verifyRole");

// ======================================
// Admin Dashboard Statistics
// ======================================

router.get(
  "/admin-stats",
  verifyFirebaseToken,
  verifyRole("admin", "super-admin"),
  getAdminStats,
);

// ======================================
// Sales Report
// ======================================

router.get(
  "/sales-report",
  verifyFirebaseToken,
  verifyRole("admin", "super-admin"),
  getSalesReport,
);

// ======================================
// Recent Orders
// ======================================

router.get(
  "/recent-orders",
  verifyFirebaseToken,
  verifyRole("admin", "super-admin"),
  getRecentOrders,
);

module.exports = router;
