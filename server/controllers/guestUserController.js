const GuestUser = require("../models/GuestUser");
const State = require("../models/State");

exports.checkGuestUser = async (req, res) => {
  try {
    const ipAddress = req.params.ip;
    const guestUser = await GuestUser.findOne({ ipAddress });

    if (guestUser) {
      res.json({ showModal: false, guestUser });
    } else {
      res.json({ showModal: true });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.addOrUpdateGuestUser = async (req, res) => {
  const { ipAddress, state } = req.body;

  try {
    const update = { state };

    const options = { new: true, upsert: true, runValidators: true };

    const guestUser = await GuestUser.findOneAndUpdate(
      { ipAddress },
      update,
      options
    );

    res.status(201).json(guestUser);
  } catch (error) {
    console.error("Error in addOrUpdateGuestUser function:", error);
    res.status(500).send(error.message);
  }
};

exports.fetchStateByIpAddress = async (req, res) => {
  try {
    const ipAddress = req.params.ipAddress;
    const guestUser = await GuestUser.findOne({ ipAddress });

    if (!guestUser) {
      return res.status(404).send("GuestUser not found");
    }

    res.status(200).json({ state: guestUser.state });
  } catch (error) {
    res.status(500).send("Server error");
  }
};
exports.fetchStateByIpAddress = async (ipAddress) => {
  try {
    // Fetch guest user by IP address
    const guestUser = await GuestUser.findOne({ ipAddress });
    if (!guestUser) {
      console.log("No guest user found for the given IP address:", ipAddress);
      return null;
    }

    // Fetch the state using the state name from the GuestUser document
    const state = await State.findOne({ name: guestUser.state });
    if (!state) {
      console.log("No state found with the name:", guestUser.state);
      return null;
    }

    // Return the ObjectId of the state
    return state._id;
  } catch (error) {
    console.error("Error fetching state by IP address:", error);
    throw error;
  }
};
