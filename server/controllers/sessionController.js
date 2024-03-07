const User = require("../models/User");

exports.handleSession = async (req, res) => {
  const { userId, startTime, endTime } = req.body; // Adjusted variable names for consistency
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    user.sessions.push({ startTime, endTime });
    await user.save();
    res.send("Session data saved successfully");
  } catch (error) {
    console.error(error); // Logging the error for debugging
    res.status(500).send(error.message);
  }
};
