const multer = require("multer");
const path = require("path");

// Storage configuration remains the same
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// File filter configuration remains the same
const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

// Initialize multer with the storage and fileFilter options
const singleUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).single("image");

const arrayUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).array("images", 4);

// Export the configured multer instances
module.exports = {
  singleUpload: singleUpload,
  arrayUpload: arrayUpload,
};
