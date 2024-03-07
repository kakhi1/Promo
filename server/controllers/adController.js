const Ad = require("../models/Ad"); // Adjust the path as necessary
const multer = require("multer");
const path = require("path");
const cron = require("node-cron");

// Multer storage and fileFilter configurations
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    let prefix = "";
    if (file.fieldname === "desktopImage") prefix = "desktop_";
    if (file.fieldname === "mobileImage") prefix = "mobile_";
    cb(
      null,
      prefix +
        file.fieldname +
        "-" +
        uniqueSuffix +
        path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter }).fields([
  { name: "desktopImage", maxCount: 1 },
  { name: "mobileImage", maxCount: 1 },
]);

// Ad creation with image upload
exports.createAdWithImages = async (req, res) => {
  upload(req, res, async (error) => {
    if (error) {
      return res.status(500).send({ error: error.message });
    }
    if (req.fileValidationError) {
      return res.status(400).send({ error: req.fileValidationError });
    }

    const { title, link, pages, startDate, endDate } = req.body;

    // Validate required fields
    if (
      !title ||
      !link ||
      !req.files ||
      !req.files.desktopImage ||
      !req.files.mobileImage
    ) {
      return res
        .status(400)
        .send({ error: "Missing required fields or files." });
    }

    let adData = {
      title,
      link,
      imageUrlDesktop: req.files.desktopImage[0].path,
      imageUrlMobile: req.files.mobileImage[0].path,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      active: true, // Ads are active by default
    };

    // Validate and parse the 'pages' field if it exists
    if (pages) {
      try {
        adData.pages = JSON.parse(pages);
      } catch (error) {
        return res.status(400).send({
          error: "Invalid format for 'pages'. It should be a JSON array.",
        });
      }
    } else {
      return res.status(400).send({ error: "'pages' field is required." });
    }

    try {
      const newAd = new Ad(adData);
      await newAd.save();
      res.status(201).send(newAd);
    } catch (error) {
      console.error("Error creating ad:", error);
      res.status(500).send({ error: "Error creating ad" });
    }
  });
};

// Schedule a task to run every day at midnight to deactivate expired ads
cron.schedule("0 0 * * *", async () => {
  console.log(
    "Running a task every day at midnight to check and update ad statuses."
  );

  const now = new Date();
  try {
    const result = await Ad.updateMany(
      { endDate: { $lt: now }, active: true },
      { $set: { active: false } }
    );
    console.log("Ads updated to inactive:", result);
  } catch (error) {
    console.error("Error updating ads to inactive:", error);
  }
});

exports.deleteAd = async (req, res) => {
  try {
    const ad = await Ad.findByIdAndDelete(req.params.id);
    if (!ad) return res.status(404).send();
    res.send(ad);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.modifyAd = async (req, res) => {
  upload(req, res, async (error) => {
    if (error) {
      return res.status(500).send({ error: error.message });
    }
    if (req.fileValidationError) {
      return res.status(400).send({ error: req.fileValidationError });
    }

    // Update image paths if new images were uploaded
    const updates = req.body;
    if (req.files.desktopImage) {
      updates.imageUrlDesktop = req.files.desktopImage[0].path;
    }
    if (req.files.mobileImage) {
      updates.imageUrlMobile = req.files.mobileImage[0].path;
    }

    try {
      const ad = await Ad.findByIdAndUpdate(req.params.id, updates, {
        new: true,
      });
      if (!ad) return res.status(404).send();
      res.send(ad);
    } catch (error) {
      res.status(400).send(error);
    }
  });
};
// Fetch all ads
exports.fetchAllAds = async (req, res) => {
  try {
    const ads = await Ad.find({}); // Fetch all documents
    res.status(200).send(ads);
  } catch (error) {
    console.error("Error fetching ads:", error);
    res.status(500).send({ error: "Error fetching ads" });
  }
};

// Fetch an ad by its ID
exports.fetchAdById = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) {
      // If no ad found with the given ID
      return res.status(404).send({ error: "Ad not found" });
    }
    res.status(200).send(ad);
  } catch (error) {
    console.error("Error fetching ad by ID:", error);
    res.status(500).send({ error: "Error fetching ad" });
  }
};
