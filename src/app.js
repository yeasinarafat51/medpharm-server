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

// ===============================
// CORS
// ===============================
const allowedOrigins = [
  "https://novacarebd.com",
  "https://www.novacarebd.com",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Postman / server-to-server request
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.options("*", cors());

app.use(express.json());
app.use(cookieParser());

// ===============================
// Test
// ===============================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MedPharm API Running...",
  });
});

// ===============================
// Routes
// ===============================
app.use("/api/users", userRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/test", testRoutes);

// ===============================
// Error Handler
// ===============================
app.use((err, req, res, next) => {
  console.error("❌ API Error:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
