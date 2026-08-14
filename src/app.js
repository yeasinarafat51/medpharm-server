const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const invoiceRoutes = require("./routes/invoice.routes");
const testRoutes = require("./routes/test.routes");
const userRoutes = require("./routes/user.routes");
const medicineRoutes = require("./routes/medicine.routes");
const categoryRoutes = require("./routes/category.routes");
const orderRoutes = require("./routes/order.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

const app = express();

// =========================
// CORS
// =========================

app.use(
  cors({
    origin: [
      "https://novacarebd.com",
      "https://www.novacarebd.com",
      "http://localhost:5173",
    ],
    credentials: true,
  }),
);

// =========================
// Middleware
// =========================

app.use(express.json());

app.use(cookieParser());

// =========================
// Health Check
// =========================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MedPharm API Running...",
  });
});

// =========================
// Routes
// =========================

app.use("/api/users", userRoutes);

app.use("/api/invoices", invoiceRoutes);

app.use("/api/medicines", medicineRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/test", testRoutes);

// =========================
// Error Handler
// =========================

app.use((err, req, res, next) => {
  console.error("❌ Express Error:", err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

module.exports = app;
