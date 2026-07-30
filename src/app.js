const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const testRoutes = require("./routes/test.routes");
const userRoutes = require("./routes/user.routes");
const medicineRoutes = require("./routes/medicine.routes");
const categoryRoutes = require("./routes/category.routes");
const orderRoutes = require("./routes/order.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("MedPharm API Running...");
});

app.use("/api/users", userRoutes);

app.use("/api/medicines", medicineRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/test", testRoutes);

module.exports = app;
