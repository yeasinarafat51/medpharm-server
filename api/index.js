require("dotenv").config();

const app = require("../src/app");
const connectDB = require("../src/config/db");

let connected = false;

module.exports = async (req, res) => {
  try {
    if (!connected) {
      await connectDB();
      connected = true;
    }

    return app(req, res);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
