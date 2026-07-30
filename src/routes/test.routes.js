const express = require("express");
const verifyFirebaseToken = require("../middlewares/verifyFirebaseToken");

const router = express.Router();

router.get("/profile", verifyFirebaseToken, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

module.exports = router;
