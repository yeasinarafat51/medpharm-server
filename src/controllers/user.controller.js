const { client } = require("../config/db");
const { ObjectId } = require("mongodb");

const database = client.db("medpharmDB");

const userCollection = database.collection("users");

// ======================================
// Create User
// ======================================

const createUser = async (req, res) => {
  try {
    const user = req.body;

    const existingUser = await userCollection.findOne({
      email: user.email,
    });

    if (existingUser) {
      return res.send({
        success: true,
        message: "User already exists",
      });
    }

    user.role = user.role || "customer";
    user.createdAt = new Date();

    const result = await userCollection.insertOne(user);

    res.status(201).send({
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

// ======================================
// Get All Users
// ======================================

const getAllUsers = async (req, res) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const sort = req.query.sort || "asc";

    const query = {};

    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const total = await userCollection.countDocuments(query);

    const users = await userCollection
      .find(query)
      .sort({
        name: sort === "asc" ? 1 : -1,
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    res.send({
      success: true,
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Single User
// ======================================

const getSingleUser = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await userCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.send({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
const getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;

    const user = await userCollection.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.send({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
// ======================================
// Update User
// ======================================

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;

    const updatedData = req.body;

    const result = await userCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: updatedData,
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
// Update User Role
// ======================================

const updateUserRole = async (req, res) => {
  try {
    const id = req.params.id;

    const { role } = req.body;

    const result = await userCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          role,
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
// Delete User
// ======================================

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await userCollection.deleteOne({
      _id: new ObjectId(id),
    });

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

module.exports = {
  createUser,
  getAllUsers,
  getSingleUser,
  getUserByEmail,
  updateUser,
  updateUserRole,
  deleteUser,
};
