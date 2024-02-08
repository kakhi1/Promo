const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Function to generate a secure key
const generateSecureKey = () => {
  return crypto.randomBytes(64).toString("hex");
};

// Function to write the JWT_SECRET to the .env file
const addKeyToEnv = (key) => {
  const envPath = path.join(__dirname, ".env");
  const envContent = `JWT_SECRET=${key}\n`;

  // Check if .env exists, and append or write accordingly
  if (fs.existsSync(envPath)) {
    // Read .env and check if JWT_SECRET exists
    const envFileContent = fs.readFileSync(envPath, "utf8");
    if (envFileContent.includes("JWT_SECRET=")) {
      const updatedContent = envFileContent.replace(
        /JWT_SECRET=.*/,
        `JWT_SECRET=${key}`
      );
      fs.writeFileSync(envPath, updatedContent);
    } else {
      fs.appendFileSync(envPath, envContent);
    }
  } else {
    fs.writeFileSync(envPath, envContent);
  }

  console.log("JWT_SECRET has been generated and added to your .env file");
};

// Generate and add key to .env
const key = generateSecureKey();
addKeyToEnv(key);
