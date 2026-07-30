const express = require("express");

const router = express.Router();

const {
  addCategory,
  getCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");

router.post("/", addCategory);

router.get("/", getCategories);

router.get("/:id", getSingleCategory);

router.put("/:id", updateCategory);

router.delete("/:id", deleteCategory);

module.exports = router;
