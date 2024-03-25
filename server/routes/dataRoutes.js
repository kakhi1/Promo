const express = require("express");
const Category = require("../models/Category");
const Tag = require("../models/Tag");

const State = require("../models/State");

const router = express.Router();

// Fetch all categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch all tags
router.get("/tags", async (req, res) => {
  try {
    const tags = await Tag.find();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// add new tags
router.post("/tags", async (req, res) => {
  const { name } = req.body;

  const tag = new Tag({ name });

  try {
    const newTag = await tag.save();
    res.status(201).json(newTag);
  } catch (error) {
    if (error.code === 11000) {
      // MongoDB duplicate key error code
      res.status(409).json({ message: "Tag name already exists." });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
});

// Fetch all states
router.get("/states", async (req, res) => {
  try {
    const states = await State.find();
    res.json(states);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
