const express = require("express");

const router = express.Router();

const {
  createUser,
  getAllUsers,
  getSingleUser,
  getUserByEmail,
  updateUser,
  updateUserByEmail,
  updateUserRole,
  deleteUser,
} = require("../controllers/user.controller");

// Create
router.post("/", createUser);

router.get("/", getAllUsers);

// email route আগে
router.get("/email/:email", getUserByEmail);

// তারপর id route
router.get("/:id", getSingleUser);

router.put("/:id", updateUser);

router.put("/email/:email", updateUserByEmail);

router.patch("/:id/role", updateUserRole);

router.delete("/:id", deleteUser);

module.exports = router;
