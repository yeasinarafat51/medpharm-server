const express = require("express");

const router = express.Router();

const {
  createOrder,
  getOrders,
  getMyOrders,
  updateOrderStatus,
} = require("../controllers/order.controller");

// Customer Order
router.post("/", createOrder);

// Admin All Orders
router.get("/", getOrders);

// Customer My Orders
router.get("/my-orders/:email", getMyOrders);

// Update Status
router.patch("/:id", updateOrderStatus);

module.exports = router;
