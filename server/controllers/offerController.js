// controllers/offerController.js
const Offer = require("../models/Offers");
const Brand = require("../models/Brand");

exports.addOffer = async (req, res) => {
  try {
    const { title, description, link, brandId } = req.body;

    // Optional: Check if brand exists
    const brand = await Brand.findById(brandId);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    // Create new offer
    const offer = new Offer({
      title,
      description,
      link,
      brand: brandId,
    });

    await offer.save();

    // Optional: Associate offer with the brand
    brand.offers.push(offer._id);
    await brand.save();

    res.status(201).json({ message: "Offer added successfully", offer });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding offer", error: error.message });
  }
};
