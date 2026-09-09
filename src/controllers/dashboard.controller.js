const { client } = require("../config/db");

const database = client.db("medpharmDB");

const medicineCollection = database.collection("medicines");
const orderCollection = database.collection("orders");
const userCollection = database.collection("users");

const getOrderRevenue = (order) => {
  const grandTotal = Number(order.grandTotal || 0);

  return Number.isFinite(grandTotal) ? grandTotal : 0;
};

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

    const orders = await orderCollection
      .find({
        orderStatus: { $ne: "Cancelled" },
      })
      .toArray();

    let totalRevenue = 0;

    orders.forEach((order) => {
      totalRevenue += getOrderRevenue(order);
    });

    res.status(200).json({
      success: true,
      totalMedicine,
      totalOrders,
      totalCustomers,
      totalRevenue,
      lowStock,
    });
  } catch (error) {
    console.error("Admin Stats Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load admin dashboard statistics.",
    });
  }
};

const getSalesReport = async (req, res) => {
  try {
    const orders = await orderCollection
      .find({
        orderStatus: { $ne: "Cancelled" },
      })
      .sort({
        orderDate: -1,
      })
      .toArray();

    let totalRevenue = 0;
    let todayRevenue = 0;
    let monthRevenue = 0;

    const now = new Date();

    const currentDate = now.toDateString();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    orders.forEach((order) => {
      const price = getOrderRevenue(order);

      totalRevenue += price;

      if (!order.orderDate) {
        return;
      }

      const orderDate = new Date(order.orderDate);

      if (Number.isNaN(orderDate.getTime())) {
        return;
      }

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

    res.status(200).json({
      success: true,
      totalRevenue,
      todayRevenue,
      monthRevenue,
      totalOrders: orders.length,
    });
  } catch (error) {
    console.error("Sales Report Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load sales report.",
    });
  }
};

const getRecentOrders = async (req, res) => {
  try {
    const orders = await orderCollection
      .find({})
      .sort({
        orderDate: -1,
      })
      .limit(10)
      .toArray();

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Recent Orders Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load recent orders.",
    });
  }
};

module.exports = {
  getAdminStats,
  getSalesReport,
  getRecentOrders,
};
