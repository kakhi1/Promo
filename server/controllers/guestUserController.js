// controllers/guestUserController.js
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

//   // Log incoming request data
//   console.log("Received request data:", { age, gender, tags, ipAddress });

//   try {
//     // Attempt to find the existing user
//     let guestUser = await GuestUser.findOne({ ipAddress });
//     console.log("Found guest user:", guestUser);

//     if (guestUser) {
//       // If guestUser exists, update its properties
//       guestUser.age = age;
//       guestUser.gender = gender;
//       guestUser.tags = tags;

//       console.log("Updating guest user with new data:", { age, gender, tags });
//       await guestUser.save();
//       console.log("Updated guest user successfully:", guestUser);
//     } else {
//       // If no existing user is found, create a new one
//       guestUser = new GuestUser({ age, gender, tags, ipAddress });
//       console.log("Creating new guest user with data:", guestUser);

//       await guestUser.save();
//       console.log("Created new guest user successfully:", guestUser);
//     }

//     // Successful response
//     console.log("Sending successful response with guest user data:", guestUser);
//     res.status(201).json(guestUser);
//   } catch (error) {
//     // Log any errors that occur during the process
//     console.error("Error in addOrUpdateGuestUser function:", error);
//     res.status(500).send(error.message);
//   }
// };
exports.addOrUpdateGuestUser = async (req, res) => {
  const { age, gender, tags, ipAddress } = req.body;

  try {
    const update = { age, gender, tags };
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
