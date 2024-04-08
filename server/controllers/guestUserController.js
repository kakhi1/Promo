const GuestUser = require("../models/GuestUser");

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
