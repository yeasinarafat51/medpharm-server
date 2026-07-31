const express = require("express");

const router = express.Router();

const {
  getAllInvoices,
  getSingleInvoice,
  getCustomerInvoices,
} = require("../controllers/invoice.controller");

// Admin
router.get("/", getAllInvoices);

// Customer
router.get("/customer/:email", getCustomerInvoices);

// Single Invoice
router.get("/:id", getSingleInvoice);

module.exports = router;
