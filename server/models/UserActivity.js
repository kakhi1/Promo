// const mongoose = require("mongoose");

// const userActivitySchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     index: true,
//   },
//   totalCount: {
//     type: Number,
//     default: 0,
//   },
//   userLoginCount: {
//     type: Number,
//     default: 0,
//   },
//   lastLoginTimestamp: {
//     type: Date,
//   },
//   timestamp: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const UserActivity = mongoose.model("UserActivity", userActivitySchema);

// module.exports = UserActivity;
const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  loginTimestamp: {
    type: Date,
    required: true,
  },
  logoutTimestamp: {
    type: Date,
  },
});

const userActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  sessions: [sessionSchema],
  totalCount: {
    type: Number,
    default: 0,
  },
  userLoginCount: {
    type: Number,
    default: 0,
  },
  lastLoginTimestamp: {
    type: Date,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const UserActivity = mongoose.model("UserActivity", userActivitySchema);

module.exports = UserActivity;
