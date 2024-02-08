const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Require routes
const userRoutes = require("./routes/userRoutes");
const brandRoutes = require("./routes/brandRoutes");
const offerRoutes = require("./routes/offerRoutes");

// Use routes
app.use("/api/users", userRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/offers", offerRoutes);

// Define a simple route
app.get("/", (req, res) => {
  res.send("Hello MERN World!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
