const User = require("../models/User");

exports.handleSession = async (req, res) => {
  const { userId, loginTime, logoutTime } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    user.sessions.push({ loginTime, logoutTime });
    await user.save();
    res.send("Session data saved successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
};
