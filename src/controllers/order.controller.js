const { client } = require("../config/db");
const { ObjectId } = require("mongodb");

const database = client.db("medpharmDB");

const orderCollection = database.collection("orders");
const invoiceCollection = database.collection("invoices");
const medicineCollection = database.collection("medicines");

// ======================================
// Create Order
// ======================================

const createOrder = async (req, res) => {
  try {
    const order = req.body;

    if (!order.items || order.items.length === 0) {
      return res.status(400).send({
        success: false,
        message: "Cart is Empty",
      });
    }

    let grandTotal = 0;

    // Check Stock

    for (const item of order.items) {
      const medicine = await medicineCollection.findOne({
        _id: new ObjectId(item.medicineId),
      });

      if (!medicine) {
        return res.status(404).send({
          success: false,
          message: `${item.medicineName} not found`,
        });
      }

      if (Number(medicine.stock) < Number(item.quantity)) {
        return res.status(400).send({
          success: false,
          message: `${item.medicineName} Stock Unavailable`,
        });
      }

      grandTotal += Number(item.totalPrice);
    }

    // Invoice Number

    const totalInvoice = await invoiceCollection.countDocuments();

    const today = new Date();

    const invoiceNo = `INV-${today.getFullYear()}${String(
      today.getMonth() + 1,
    ).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}-${String(
      totalInvoice + 1,
    ).padStart(5, "0")}`;

    // Order Object

    const newOrder = {
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      uid: order.uid || "",

      phone: order.phone || "",
      address: order.address || "",
      note: order.note || "",

      items: order.items,

      grandTotal,

      paymentStatus: "Unpaid",
      orderStatus: "Pending",

      invoiceNo,

      orderDate: new Date(),
    };

    const result = await orderCollection.insertOne(newOrder);

    // Reduce Stock

    for (const item of order.items) {
      await medicineCollection.updateOne(
        {
          _id: new ObjectId(item.medicineId),
        },
        {
          $inc: {
            stock: -Number(item.quantity),
          },
        },
      );
    }

    // Invoice

    const invoice = {
      invoiceNo,

      orderId: result.insertedId,

      customerName: order.customerName,
      customerEmail: order.customerEmail,

      phone: order.phone || "",
      address: order.address || "",
      note: order.note || "",

      uid: order.uid || "",

      items: order.items.map((item) => ({
        medicineId: item.medicineId,
        medicineName: item.medicineName,
        company: item.company,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        total: Number(item.totalPrice),
      })),

      subtotal: grandTotal,
      discount: 0,
      vat: 0,
      grandTotal,

      paymentStatus: "Unpaid",
      orderStatus: "Pending",

      createdAt: new Date(),
    };

    await invoiceCollection.insertOne(invoice);

    res.send({
      success: true,
      message: "Order Placed Successfully",
      orderId: result.insertedId,
      invoiceNo,
      grandTotal,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get All Orders
// ======================================

const getOrders = async (req, res) => {
  try {
    const orders = await orderCollection
      .find()
      .sort({ orderDate: -1 })
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

// ======================================
// My Orders
// ======================================

const getMyOrders = async (req, res) => {
  try {
    const email = req.params.email;

    const orders = await orderCollection
      .find({ customerEmail: email })
      .sort({ orderDate: -1 })
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

// ======================================
// Update Status
// ======================================

const updateOrderStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { orderStatus } = req.body;

    const result = await orderCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          orderStatus,
        },
      },
    );

    res.send({
      success: true,
      result,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
// ======================================
// Get Invoice By Number
// ======================================

const getInvoiceByNumber = async (req, res) => {
  try {
    const invoiceNo = req.params.invoiceNo;

    const invoice = await invoiceCollection.findOne({
      invoiceNo,
    });

    if (!invoice) {
      return res.status(404).send({
        success: false,
        message: "Invoice Not Found",
      });
    }

    res.send({
      success: true,
      invoice,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Order By Id
// ======================================

const getOrderById = async (req, res) => {
  try {
    const id = req.params.id;

    const order = await orderCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Order Not Found",
      });
    }

    res.send({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
const getSingleOrder = async (req, res) => {
  try {
    const id = req.params.id;

    const order = await orderCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Order Not Found",
      });
    }

    res.send({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  createOrder,
  getOrders,
  getMyOrders,
  updateOrderStatus,
  getInvoiceByNumber,
  getOrderById,
  getSingleOrder,
};
