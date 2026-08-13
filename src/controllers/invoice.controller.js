const { database } = require("../config/db");
const { ObjectId } = require("mongodb");

// const database = client.db("medpharmDB");

const invoiceCollection = database.collection("invoices");

// ======================================
// Get All Invoices
// ======================================

const getAllInvoices = async (req, res) => {
  try {
    const invoices = await invoiceCollection
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    res.send({
      success: true,
      invoices,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Invoice By ID
// ======================================

const getSingleInvoice = async (req, res) => {
  try {
    const id = req.params.id;

    const invoice = await invoiceCollection.findOne({
      _id: new ObjectId(id),
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
// Get Customer Invoices
// ======================================

const getCustomerInvoices = async (req, res) => {
  try {
    const email = req.params.email;

    const invoices = await invoiceCollection
      .find({
        customerEmail: email,
      })
      .sort({ createdAt: -1 })
      .toArray();

    res.send({
      success: true,
      invoices,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllInvoices,
  getSingleInvoice,
  getCustomerInvoices,
};
