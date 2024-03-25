// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();
// // Middleware
// app.use(cors());
// app.use(express.json()); // for parsing application/json

// // Session middleware
// const sessionSecret = "mysecretkey";
// app.use(
//   session({
//     secret: sessionSecret,
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false }, // adjust cookie settings as needed
//   })
// );

// // Database connection
// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("Could not connect to MongoDB", err));

// // Require routes
// const userRoutes = require("./routes/userRoutes");

// const dataRoutes = require("./routes/dataRoutes");
// const offerRoutes = require("./routes/offerRoutes");
// const brandRoutes = require("./routes/brandRoutes");
// const adRoutes = require("./routes/adRouter");

// // const brandRoutes = require("./routes/brand");
// app.use("/uploads", express.static("uploads"));
// // Use routes
// app.use("/api/users", userRoutes);
// // app.use(brandRoutes);
// app.use("/api/offers", offerRoutes);
// app.use("/api/data", dataRoutes);
// app.use("/api/brands", brandRoutes);
// app.use("/api/ads", adRoutes);

// app.use((req, res, next) => {
//   console.log(`Incoming request: ${req.method} ${req.path}`);
//   next();
// });
// // Define a simple route
// app.get("/", (req, res) => {
//   res.send("Hello MERN World!");
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
// server.js(Express.js);
// server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const session = require("express-session");
const router = express.Router();

const app = express();
// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).send("Something broke!");
});
// // Session middleware
const sessionSecret = "mysecretkey";
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // adjust cookie settings as needed
  })
);

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Require routes
const userRoutes = require("./routes/userRoutes");

const dataRoutes = require("./routes/dataRoutes");
const offerRoutes = require("./routes/offerRoutes");
const brandRoutes = require("./routes/brandRoutes");
const adRoutes = require("./routes/adRouter");
const guestUserRoutes = require("./routes/guestUserRoutes");
// Import the UserActivity model
const UserActivity = require("./models/UserActivity");

app.use("/uploads", express.static("uploads"));
// Use routes
app.use("/api/users", userRoutes);
// app.use(brandRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/ads", adRoutes);
// Use the guest user routes
app.use("/api", guestUserRoutes);
// Mock function to extract user ID from the request
// Replace this logic with your actual user identification method
function getUserIdFromRequest(req) {
  // Example: Extracting user ID from session or JWT token
  return req.session.userId; // Or decode JWT token to get userId
}
app.use((req, res, next) => {
  UserActivity.updateMany({}, { $inc: { totalCount: 1 } }, { multi: true })
    .then(() => console.log("Total request count incremented"))
    .catch((err) =>
      console.error("Error incrementing total request count:", err)
    );

  next();
});

app.use((req, res, next) => {
  const userId = getUserIdFromRequest(req);

  if (!userId) {
    next();
    return;
  }

  const updateObject = { $inc: { totalCount: 1 } };

  if (req.path === "/login") {
    updateObject.$inc.userLoginCount = 1;
    updateObject.$set = { lastLoginTimestamp: new Date() };
  }

  UserActivity.findOneAndUpdate({ userId: userId }, updateObject, {
    upsert: true,
    new: true,
  })
    .then(() => console.log("User activity updated"))
    .catch((err) => console.error("Error updating user activity:", err));

  next();
});

router.get("/api/userActivityStats", async (req, res) => {
  try {
    const estimatedSessionDuration = 30 * 60 * 1000; // 30 minutes in milliseconds

    // Fetch aggregate stats for all users, estimating total time spent
    const allUsersStats = await UserActivity.aggregate([
      { $unwind: "$sessions" },
      {
        $group: {
          _id: null,
          totalLoginCount: { $sum: 1 },
          totalUsers: { $sum: 1 },
          lastLogin: { $max: "$lastLoginTimestamp" },
          estimatedTotalTimeSpent: { $sum: estimatedSessionDuration }, // Use fixed session duration
        },
      },
      {
        $project: {
          _id: 0,
          totalLoginCount: 1,
          totalUsers: 1,
          lastLogin: 1,
          estimatedTotalTimeSpent: 1, // Time in milliseconds
        },
      },
    ]);

    if (allUsersStats.length > 0) {
      // Optionally convert milliseconds to a more readable format here
      return res.json({ success: true, data: allUsersStats[0] });
    } else {
      return res.json({ success: true, data: {} });
    }
  } catch (err) {
    console.error("Error fetching user activity stats:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.use(router);

// Define a simple route
app.get("/", (req, res) => {
  res.send("Hello MERN World!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
