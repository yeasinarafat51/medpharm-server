const verifyRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access",
        });
      }

      const userRole = req.user.role;

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden access",
        });
      }

      next();
    } catch (error) {
      console.error("Verify Role Error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to verify user role",
      });
    }
  };
};

module.exports = verifyRole;
