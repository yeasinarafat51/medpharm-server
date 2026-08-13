const { database } = require("../config/db");

// const database = client.db("medpharmDB");

const medicineCollection = database.collection("medicines");
const orderCollection = database.collection("orders");
const userCollection = database.collection("users");

// ======================================
// Admin Dashboard Statistics
// ======================================
// ======================================
// Admin Dashboard Statistics
// ======================================

const getAdminStats = async (req, res) => {
  try {
    const totalMedicine = await medicineCollection.countDocuments();

    const totalOrders = await orderCollection.countDocuments();

    const totalCustomers = await userCollection.countDocuments({
      role: "customer",
    });

    const lowStock = await medicineCollection.countDocuments({
      stock: { $lt: 10 },
    });

    const orders = await orderCollection.find().toArray();

    let totalRevenue = 0;

    orders.forEach((order) => {
      totalRevenue += Number(order.totalPrice || 0);
    });

    res.send({
      success: true,
      totalMedicine,
      totalOrders,
      totalCustomers,
      totalRevenue,
      lowStock,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
// ==========================================
// Sales Report
// ==========================================

const getSalesReport = async (req, res) => {
  try {
    const orders = await orderCollection.find().toArray();

    let totalRevenue = 0;
    let todayRevenue = 0;
    let monthRevenue = 0;

    const today = new Date();
    const currentDate = today.toDateString();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    orders.forEach((order) => {
      const price = Number(order.totalPrice || 0);

      totalRevenue += price;

      const orderDate = new Date(order.orderDate);

      if (orderDate.toDateString() === currentDate) {
        todayRevenue += price;
      }

      if (
        orderDate.getMonth() === currentMonth &&
        orderDate.getFullYear() === currentYear
      ) {
        monthRevenue += price;
      }
    });

    res.send({
      success: true,
      totalRevenue,
      todayRevenue,
      monthRevenue,
      totalOrders: orders.length,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
// =====================================
// Recent Orders
// =====================================

const getRecentOrders = async (req, res) => {
  try {
    const orders = await orderCollection
      .find()
      .sort({ orderDate: -1 })
      .limit(10)
      .toArray();

    res.send({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  getAdminStats,
  getSalesReport,
  getRecentOrders,
};
