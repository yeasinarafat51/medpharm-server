const { client } = require("../config/db");
const { ObjectId } = require("mongodb");

const database = client.db("medpharmDB");

const orderCollection = database.collection("orders");

// ===============================
// Create Order
// ===============================

const createOrder = async (req, res) => {
  try {
    const order = req.body;

    const medicineCollection = database.collection("medicines");

    const medicine = await medicineCollection.findOne({
      _id: new ObjectId(order.medicineId),
    });

    if (!medicine) {
      return res.status(404).send({
        success: false,
        message: "Medicine not found",
      });
    }

    if (medicine.stock < order.quantity) {
      return res.status(400).send({
        success: false,
        message: "Insufficient Stock",
      });
    }

    order.status = "Pending";

    order.orderDate = new Date();

    const result = await orderCollection.insertOne(order);

    await medicineCollection.updateOne(
      {
        _id: medicine._id,
      },
      {
        $inc: {
          stock: -Number(order.quantity),
        },
      },
    );

    res.send({
      success: true,
      insertedId: result.insertedId,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Get All Orders (Admin)
// ===============================

const getOrders = async (req, res) => {
  try {
    const orders = await orderCollection
      .find()
      .sort({ orderDate: -1 })
      .toArray();

    res.send(orders);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Get My Orders (Customer)
// ===============================

const getMyOrders = async (req, res) => {
  try {
    const email = req.params.email;

    const orders = await orderCollection
      .find({
        customerEmail: email,
      })
      .sort({ orderDate: -1 })
      .toArray();

    res.send(orders);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Update Status
// ===============================

const updateOrderStatus = async (req, res) => {
  try {
    const id = req.params.id;

    const { status } = req.body;

    const result = await orderCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          status,
        },
      },
    );

    res.send(result);
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
};
