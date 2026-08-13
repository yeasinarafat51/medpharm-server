const { client } = require("../config/db");

const database = client.db("medpharmDB");
const { ObjectId } = require("mongodb");

const medicineCollection = database.collection("medicines");

const addMedicine = async (req, res) => {
  try {
    const medicine = req.body;

    // Convert to Number
    medicine.purchasePrice = Number(medicine.purchasePrice);
    medicine.profitPercent = Number(medicine.profitPercent);
    medicine.mrpePrice = Number(medicine.mrpePrice);
    medicine.bikriPercent = Number(medicine.bikriPercent);

    medicine.stock = Number(medicine.stock);
    medicine.boxQuantity = Number(medicine.boxQuantity);

    // Calculate Selling Price
    medicine.sellingPrice = Number(
      (
        medicine.mrpePrice -
        (medicine.mrpePrice * medicine.bikriPercent) / 100
      ).toFixed(2),
    );

    // Created Date
    medicine.createdAt = new Date();

    // Save Medicine
    const result = await medicineCollection.insertOne(medicine);

    res.status(201).send({
      success: true,
      insertedId: result.insertedId,
      message: "Medicine Added Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// const getMedicines = async (req, res) => {
//   try {
//     const search = req.query.search || "";
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 5;
//     const sort = req.query.sort || "asc";

//     const skip = (page - 1) * limit;

//     const query = {
//       $or: [
//         {
//           medicineName: {
//             $regex: search,
//             $options: "i",
//           },
//         },
//         {
//           company: {
//             $regex: search,
//             $options: "i",
//           },
//         },

//         {
//           genericName: {
//             $regex: search,
//             $options: "i",
//           },
//         },
//       ],
//     };

//     const sortOption = {
//       medicineName: sort === "asc" ? 1 : -1,
//     };

//     const medicines = await medicineCollection
//       .find(query)
//       .sort(sortOption)
//       .skip(skip)
//       .limit(limit)
//       .toArray();

//     const total = await medicineCollection.countDocuments(query);

//     res.send({
//       medicines,
//       total,
//       page,
//       totalPages: Math.ceil(total / limit),
//     });
//   } catch (error) {
//     res.status(500).send({
//       message: error.message,
//     });
//   }
// };

const getMedicines = async (req, res) => {
  try {
    const search = req.query.search || "";
    const sort = req.query.sort || "asc";

    const query = {
      $or: [
        {
          medicineName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          company: {
            $regex: search,
            $options: "i",
          },
        },
        {
          genericName: {
            $regex: search,
            $options: "i",
          },
        },
      ],
    };

    const sortOption = {
      medicineName: sort === "asc" ? 1 : -1,
    };

    // সব medicine আনবে
    const medicines = await medicineCollection
      .find(query)
      .sort(sortOption)
      .toArray();

    res.send({
      success: true,
      medicines,
    });
  } catch (error) {
    console.error("Get Medicines Error:", error);

    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const getSingleMedicine = async (req, res) => {
  try {
    const id = req.params.id;

    const medicine = await medicineCollection.findOne({
      _id: new ObjectId(id),
    });

    res.send(medicine);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};
const deleteMedicine = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await medicineCollection.deleteOne({
      _id: new ObjectId(id),
    });

    res.send(result);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

// const getMedicines = async (req, res) => {
//   try {
//     const search = req.query.search || "";
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 5;
//     const sort = req.query.sort || "asc";

//     const skip = (page - 1) * limit;

//     const query = {};

//     if (search) {
//       query.medicineName = {
//         $regex: search,
//         $options: "i",
//       };
//     }

//     const medicines = await medicineCollection
//       .find(query)
//       .sort({
//         medicineName: sort === "asc" ? 1 : -1,
//       })
//       .skip(skip)
//       .limit(limit)
//       .toArray();

//     const total = await medicineCollection.countDocuments(query);

//     res.send({
//       medicines,
//       total,
//       page,
//       totalPages: Math.ceil(total / limit),
//     });
//   } catch (error) {
//     console.log(error);

//     res.status(500).send({
//       message: error.message,
//     });
//   }
// };
const updateMedicine = async (req, res) => {
  try {
    const id = req.params.id;

    const medicine = { ...req.body };

    // MongoDB _id update করা যাবে না
    delete medicine._id;

    // ==========================================
    // NUMBER CONVERSION
    // ==========================================

    const purchasePrice = Number(medicine.purchasePrice) || 0;
    const profitPercent = Number(medicine.profitPercent) || 0;
    const mrpePrice = Number(medicine.mrpePrice) || 0;
    const bikriPercent = Number(medicine.bikriPercent) || 0;
    const stock = Number(medicine.stock) || 0;
    const boxQuantity = Number(medicine.boxQuantity) || 0;

    // ==========================================
    // SELLING PRICE
    // MRP - BIKRI/DISCOUNT %
    // ==========================================

    const sellingPrice = mrpePrice - (mrpePrice * bikriPercent) / 100;

    // ==========================================
    // SAVE CLEAN DATA
    // ==========================================

    medicine.purchasePrice = purchasePrice;
    medicine.profitPercent = profitPercent;
    medicine.mrpePrice = mrpePrice;
    medicine.bikriPercent = bikriPercent;
    medicine.stock = stock;
    medicine.boxQuantity = boxQuantity;

    medicine.sellingPrice = Number(sellingPrice.toFixed(2));

    // ==========================================
    // UPDATE DATABASE
    // ==========================================

    const result = await medicineCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: medicine,
      },
    );

    // ==========================================
    // RESPONSE
    // ==========================================

    if (result.matchedCount === 0) {
      return res.status(404).send({
        success: false,
        message: "Medicine not found",
      });
    }

    res.send({
      success: true,
      message: "Medicine updated successfully",
      sellingPrice: medicine.sellingPrice,
      result,
    });
  } catch (error) {
    console.error("Update Medicine Error:", error);

    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addMedicine,
  getMedicines,
  getSingleMedicine,
  updateMedicine,
  deleteMedicine,
};
