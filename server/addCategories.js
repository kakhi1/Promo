const mongoose = require("mongoose");
const Category = require("./models/Category"); // Update the path to where your model is located

mongoose
  .connect(
    "mongodb+srv://promo:pyoxLaBQHLPhqIXF@cluster0.whg0tef.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const categories = [
  "ელექტრონიკა",
  "მოდა",
  "სპორტი",
  "სახლის დეკორი",
  "წიგნები",
  "კომპიუტერები",
  "ტელეფონები",
  "საბავშვო საქონელი",
  "ჯანმრთელობა და სილამაზე",
  "საკვები",
  "ხელოვნება",
  "ელექტრო ტექნიკა",
  "სამზარეულოს ნივთები",
  "სათამაშოები",
  "სპორტული ინვენტარი",
  "მუსიკალური ინსტრუმენტები",
  "გარემოს დაცვა",
  "სამოსელი",
  "ფოტოტექნიკა",
  "კოსმეტიკა",
].map((name) => ({ name }));

const insertCategories = async () => {
  try {
    await Category.deleteMany(); // Optional: Clears the category collection before insertion
    await Category.insertMany(categories);
    console.log("Categories added successfully!");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error adding categories:", error);
    mongoose.disconnect();
  }
};

insertCategories();
