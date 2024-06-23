const GuestUser = require("../models/GuestUser");
const State = require("../models/State");
const { createUser } = require("./userController");

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

    // Create or update corresponding user
    await createUserIfNotExists(ipAddress, state);

    res.status(201).json(guestUser);
  } catch (error) {
    console.error("Error in addOrUpdateGuestUser function:", error);
    res.status(500).send(error.message);
  }
};

async function createUserIfNotExists(ipAddress, state) {
  try {
    const user = await User.findOne({ lastIPAddress: ipAddress });
    if (!user) {
      await createUser(ipAddress, state);
    }
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

exports.fetchStateByIpAddress = async (ipAddress) => {
  try {
    const guestUser = await GuestUser.findOne({ ipAddress });
    if (!guestUser) {
      console.log("No guest user found for the given IP address:", ipAddress);
      return null;
    }

    const state = await State.findOne({ name: guestUser.state });
    if (!state) {
      console.log("No state found with the name:", guestUser.state);
      return null;
    }

    return state._id;
  } catch (error) {
    console.error("Error fetching state by IP address:", error);
    throw error;
  }
};
