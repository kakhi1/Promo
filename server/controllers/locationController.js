const User = require("../models/User");

// exports.updateLocation = async (req, res) => {
//   const { userId, latitude, longitude } = req.body;
//   try {
//     await User.findByIdAndUpdate(userId, {
//       "location.latitude": latitude,
//       "location.longitude": longitude,
//     });
//     res.send("Location updated successfully");
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// };
exports.updateLocation = async (req, res) => {
  const { userId, latitude, longitude, stateNameGe } = req.body; // Assuming 'stateNameGe' holds the Georgian state name
  try {
    await User.findByIdAndUpdate(userId, {
      "location.latitude": latitude,
      "location.longitude": longitude,
      "location.stateNameGe": stateNameGe, // Update the schema to include this field if not already present
    });
    res.send("Location updated successfully with Georgian state name.");
  } catch (error) {
    res.status(500).send(error.message);
  }
};
