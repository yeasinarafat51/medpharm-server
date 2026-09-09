const { client } = require("../config/db");

const database = client.db("medpharmDB");

const medicineCollection = database.collection("medicines");
const orderCollection = database.collection("orders");
const userCollection = database.collection("users");

// ======================================
// Admin Dashboard Statistics
// ======================================

const getAdminStats = async (req, res) => {
  try {
    const [
      totalMedicine,
      totalOrders,
      totalCustomers,
      lowStock,
      revenueResult,
    ] = await Promise.all([
      medicineCollection.countDocuments(),

      orderCollection.countDocuments(),

      userCollection.countDocuments({
        role: "customer",
      }),

      medicineCollection.countDocuments({
        stock: { $lt: 10 },
      }),

      orderCollection
        .aggregate([
          {
            $group: {
              _id: null,
              totalRevenue: {
                $sum: {
                  $convert: {
                    input: "$grandTotal",
                    to: "double",
                    onError: 0,
                    onNull: 0,
                  },
                },
              },
            },
          },
        ])
        .toArray(),
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

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

// ======================================
// Sales Report
// ======================================

const getSalesReport = async (req, res) => {
  try {
    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const result = await orderCollection
      .aggregate([
        {
          $addFields: {
            calculatedOrderDate: {
              $convert: {
                input: "$orderDate",
                to: "date",
                onError: null,
                onNull: null,
              },
            },
            calculatedGrandTotal: {
              $convert: {
                input: "$grandTotal",
                to: "double",
                onError: 0,
                onNull: 0,
              },
            },
          },
        },
        {
          $group: {
            _id: null,

            totalRevenue: {
              $sum: "$calculatedGrandTotal",
            },

            todayRevenue: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      {
                        $gte: ["$calculatedOrderDate", startOfToday],
                      },
                      {
                        $lt: ["$calculatedOrderDate", startOfTomorrow],
                      },
                    ],
                  },
                  "$calculatedGrandTotal",
                  0,
                ],
              },
            },

            monthRevenue: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      {
                        $gte: ["$calculatedOrderDate", startOfMonth],
                      },
                      {
                        $lt: ["$calculatedOrderDate", startOfNextMonth],
                      },
                    ],
                  },
                  "$calculatedGrandTotal",
                  0,
                ],
              },
            },

            totalOrders: {
              $sum: 1,
            },
          },
        },
      ])
      .toArray();

    const report = result[0] || {
      totalRevenue: 0,
      todayRevenue: 0,
      monthRevenue: 0,
      totalOrders: 0,
    };

    res.status(200).json({
      success: true,
      totalRevenue: report.totalRevenue || 0,
      todayRevenue: report.todayRevenue || 0,
      monthRevenue: report.monthRevenue || 0,
      totalOrders: report.totalOrders || 0,
    });
  } catch (error) {
    console.error("Sales Report Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load sales report.",
    });
  }
};

// ======================================
// Recent Orders
// ======================================

const getRecentOrders = async (req, res) => {
  try {
    const orders = await orderCollection
      .find({})
      .sort({ orderDate: -1 })
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

// ======================================
// Export
// ======================================

module.exports = {
  getAdminStats,
  getSalesReport,
  getRecentOrders,
};
