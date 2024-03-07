// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

//   if (!token)
//     return res
//       .status(401)
//       .json({ message: "Access denied. No token provided." });

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ message: "Token is not valid." });

//     req.user = user;
//     next();
//   });
// };

// module.exports = authenticateToken;
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET; // Ensure this is correctly set

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract the token
  if (!token) {
    return res.status(401).json({ message: "Authentication token is missing" });
  }

  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Assuming the token includes userId and role
    req.user = {
      _id: decodedToken.userId,
      role: decodedToken.role,
    };

    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = authenticate;
