const express = require("express");

const router = express.Router();

const {
  createOrder,
  getOrders,
  getMyOrders,
  updateOrderStatus,
  getInvoiceByNumber,
  getOrderById,
  getSingleOrder,
} = require("../controllers/order.controller");

// Customer Order
router.post("/", createOrder);

// Admin All Orders
router.get("/", getOrders);
// Invoice Details
router.get("/invoice/:invoiceNo", getInvoiceByNumber);

// Single Order
router.get("/:id", getOrderById);
router.get("/:id", getSingleOrder);
// Customer My Orders
router.get("/my-orders/:email", getMyOrders);

// Update Status
router.patch("/:id", updateOrderStatus);

module.exports = router;
