const app = require("./app");
const { connectDB } = require("./config/db");

let connectionPromise;

const handler = async (req, res) => {
  try {
    if (!connectionPromise) {
      connectionPromise = connectDB();
    }

    await connectionPromise;

    return app(req, res);
  } catch (error) {
    console.error("❌ Server Error:", error);

    connectionPromise = null;

    return res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
};

module.exports = handler;
