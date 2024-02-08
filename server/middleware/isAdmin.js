const jwt = require("jsonwebtoken");
require("dotenv").config();

const isAdmin = (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) {
      throw new Error();
    }
    req.user = decoded; // Add decoded user to request object
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized as admin" });
  }
};

module.exports = isAdmin;
