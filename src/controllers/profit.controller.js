const { client } = require("../config/db");

const database = client.db("medpharmDB");

const orderCollection = database.collection("orders");
const medicineCollection = database.collection("medicines");

const getProfitReport = async (req, res) => {
  try {
    const { from, to, search } = req.query;

    const query = {
      orderStatus: { $ne: "Cancelled" },
    };

    if (from || to) {
      query.orderDate = {};

      if (from) {
        query.orderDate.$gte = new Date(`${from}T00:00:00`);
      }

      if (to) {
        query.orderDate.$lte = new Date(`${to}T23:59:59.999`);
      }
    }

    const orders = await orderCollection
      .find(query)
      .sort({ orderDate: -1 })
      .toArray();

    const medicineMap = new Map();

    const medicines = await medicineCollection.find({}).toArray();

    medicines.forEach((medicine) => {
      medicineMap.set(
        String(medicine._id),
        Number(medicine.purchasePrice || 0),
      );
    });

    let totalPurchaseAmount = 0;
    let totalSalesAmount = 0;
    let totalProfit = 0;
    let totalQuantity = 0;

    const medicineReports = new Map();

    for (const order of orders) {
      if (!Array.isArray(order.items)) {
        continue;
      }

      for (const item of order.items) {
        const medicineId = String(item.medicineId || "");
        const medicineName =
          item.medicineName || item.name || "Unknown Medicine";

        const company = item.company || "N/A";
        const quantity = Number(item.quantity || 0);

        if (quantity <= 0) {
          continue;
        }

        let purchasePrice = Number(item.purchasePrice);

        if (!Number.isFinite(purchasePrice)) {
          purchasePrice = medicineMap.get(medicineId) || 0;
        }

        const sellingPrice = Number(item.unitPrice || item.sellingPrice || 0);

        const purchaseAmount = purchasePrice * quantity;

        const salesAmount = Number(
          item.totalPrice || item.total || sellingPrice * quantity,
        );

        const profit = salesAmount - purchaseAmount;

        totalPurchaseAmount += purchaseAmount;
        totalSalesAmount += salesAmount;
        totalProfit += profit;
        totalQuantity += quantity;

        if (!medicineReports.has(medicineId)) {
          medicineReports.set(medicineId, {
            medicineId,
            medicineName,
            company,
            purchasePrice,
            sellingPrice,
            soldQuantity: 0,
            purchaseAmount: 0,
            salesAmount: 0,
            profit: 0,
          });
        }

        const report = medicineReports.get(medicineId);

        report.soldQuantity += quantity;
        report.purchaseAmount += purchaseAmount;
        report.salesAmount += salesAmount;
        report.profit += profit;
      }
    }

    let reports = Array.from(medicineReports.values());

    if (search) {
      const searchText = search.trim().toLowerCase();

      reports = reports.filter((item) => {
        return (
          item.medicineName.toLowerCase().includes(searchText) ||
          item.company.toLowerCase().includes(searchText)
        );
      });
    }

    reports.sort((a, b) => b.profit - a.profit);

    res.status(200).json({
      success: true,
      summary: {
        totalPurchaseAmount,
        totalSalesAmount,
        totalProfit,
        totalQuantity,
        totalMedicines: reports.length,
      },
      reports,
    });
  } catch (error) {
    console.error("Profit Report Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load profit report.",
    });
  }
};

module.exports = {
  getProfitReport,
};
