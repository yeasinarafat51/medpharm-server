const { client } = require("../config/db");
const { ObjectId } = require("mongodb");

const database = client.db("medpharmDB");

const categoryCollection = database.collection("categories");

// Add Category
const addCategory = async (req, res) => {
  try {
    const category = req.body;

    const exist = await categoryCollection.findOne({
      categoryName: category.categoryName,
    });

    if (exist) {
      return res.status(400).send({
        message: "Category already exists",
      });
    }

    const result = await categoryCollection.insertOne(category);

    res.send(result);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

// Get All Category
const getCategories = async (req, res) => {
  try {
    const categories = await categoryCollection
      .find()
      .sort({ categoryName: 1 })
      .toArray();

    res.send(categories);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

// Get Single Category
const getSingleCategory = async (req, res) => {
  try {
    const id = req.params.id;

    const category = await categoryCollection.findOne({
      _id: new ObjectId(id),
    });

    res.send(category);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

// Update Category
const updateCategory = async (req, res) => {
  try {
    const id = req.params.id;

    const data = req.body;

    const result = await categoryCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: data,
      },
    );

    res.send(result);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

// Delete Category
const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await categoryCollection.deleteOne({
      _id: new ObjectId(id),
    });

    res.send(result);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

module.exports = {
  addCategory,
  getCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
