const express = require("express");
const router = express.Router();

const {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  updateUserRole,
  deleteUser,
} = require("../controllers/user.controller");

router.post("/", createUser);

router.get("/", getAllUsers);

router.get("/:id", getSingleUser);

router.put("/:id", updateUser);

router.patch("/:id/role", updateUserRole);

router.delete("/:id", deleteUser);

module.exports = router;
