// const mongoose = require("mongoose");
// const Category = require("./models/Category"); // Update the path to where your model is located

// mongoose
//   .connect(
//     "mongodb+srv://promo:pyoxLaBQHLPhqIXF@cluster0.whg0tef.mongodb.net/?retryWrites=true&w=majority",
//     { useNewUrlParser: true, useUnifiedTopology: true }
//   )
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.log(err));

// const categories = [
//   "ელექტრონიკა",
//   "მოდა",
//   "სპორტი",
//   "სახლის დეკორი",
//   "წიგნები",
//   "კომპიუტერები",
//   "ტელეფონები",
//   "საბავშვო საქონელი",
//   "ჯანმრთელობა და სილამაზე",
//   "საკვები",
//   "ხელოვნება",
//   "ელექტრო ტექნიკა",
//   "სამზარეულოს ნივთები",
//   "სათამაშოები",
//   "სპორტული ინვენტარი",
//   "მუსიკალური ინსტრუმენტები",
//   "გარემოს დაცვა",
//   "სამოსელი",
//   "ფოტოტექნიკა",
//   "კოსმეტიკა",
// ].map((name) => ({ name }));

// const insertCategories = async () => {
//   try {
//     await Category.deleteMany(); // Optional: Clears the category collection before insertion
//     await Category.insertMany(categories);
//     console.log("Categories added successfully!");
//     mongoose.disconnect();
//   } catch (error) {
//     console.error("Error adding categories:", error);
//     mongoose.disconnect();
//   }
// };

// insertCategories();
// const mongoose = require("mongoose");
// const Tag = require("./models/Tag"); // Update the path to where your Tag model is located

// // Assuming the same MongoDB connection setup as provided for categories

// const tags = [
//   "ელექტრონიკა",
//   "მოდა",
//   "სპორტი",
//   "სახლის დეკორი",
//   "წიგნები",
//   "კომპიუტერები",
//   "ტელეფონები",
//   "საბავშვო საქონელი",
//   "ჯანმრთელობა და სილამაზე",
//   "საკვები",
//   "ხელოვნება",
//   "ელექტრო ტექნიკა",
//   "სამზარეულოს ნივთები",
//   "სათამაშოები",
//   "სპორტული ინვენტარი",
//   "მუსიკალური ინსტრუმენტები",
//   "გარემოს დაცვა",
//   "სამოსელი",
//   "ფოტოტექნიკა",
//   "კოსმეტიკა",
// ].map((name) => ({ name }));

// const insertTags = async () => {
//   try {
//     await Tag.deleteMany(); // Optional: Clears the tag collection before insertion
//     await Tag.insertMany(tags);
//     console.log("Tags added successfully!");
//   } catch (error) {
//     console.error("Error adding tags:", error);
//   } finally {
//     mongoose.disconnect();
//   }
// };

// // Connect to MongoDB and insert tags
// mongoose
//   .connect(
//     "mongodb+srv://promo:pyoxLaBQHLPhqIXF@cluster0.whg0tef.mongodb.net/?retryWrites=true&w=majority",
//     { useNewUrlParser: true, useUnifiedTopology: true }
//   )
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.log(err));

// insertTags();

const mongoose = require("mongoose");
const State = require("./models/State"); // Update the path to where your State model is located

// MongoDB connection setup (as provided)
mongoose
  .connect(
    "mongodb+srv://promo:pyoxLaBQHLPhqIXF@cluster0.whg0tef.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const georgianStates = [
  "თბილისი",
  "ქუთაისი",
  "ბათუმი",
  "რუსთავი",
  "ზუგდიდი",
  "გორი",
  "ფოთი",
  "თელავი",
  "ახალციხე",
  "ქობულეთი",
  "სამტრედია",
  "კასპი",
  "ჩიატურა",
  "მარნეული",
  "ყვარელი",
].map((name) => ({ name }));

const insertStates = async () => {
  try {
    await State.deleteMany(); // Optional: Clears the state collection before insertion
    await State.insertMany(georgianStates);
    console.log("Georgian states added successfully!");
  } catch (error) {
    console.error("Error adding Georgian states:", error);
  } finally {
    mongoose.disconnect();
  }
};

insertStates();
