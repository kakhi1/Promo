// export default Categories;
import React, { useState, useEffect } from "react";
import { FaBeer, FaApple, FaCar, FaTree, FaCameraRetro } from "react-icons/fa"; // Import the icons you need
import { MdElectricBolt, MdOutlineSportsSoccer } from "react-icons/md";
import { RiShirtFill } from "react-icons/ri";
import { GiSofa, GiMusicalKeyboard } from "react-icons/gi";
import { SiBookstack } from "react-icons/si";
import { FaComputer } from "react-icons/fa6";
import { CiMobile3 } from "react-icons/ci";
import { TbMoodKid } from "react-icons/tb";
import {
  MdHealthAndSafety,
  MdToys,
  MdElectricalServices,
  MdOutlineSportsTennis,
} from "react-icons/md";
import { IoFastFoodOutline } from "react-icons/io5";
import { SiArtifacthub } from "react-icons/si";
import { FaBlenderPhone } from "react-icons/fa";
import { PiPants } from "react-icons/pi";
import { MdOutlineGirl } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function Categories() {
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  const handleCategorySelect = (category) => {
    navigate(`/offers-category/${category._id}`); // Navigate to OffersCategory component with the category ID
  };

  useEffect(() => {
    fetch("https://promo-iror.onrender.com/api/data/categories")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  }, []);

  const getIcon = (categoryName) => {
    const icons = {
      ელექტრონიკა: MdElectricBolt,
      მოდა: RiShirtFill,
      სპორტი: MdOutlineSportsSoccer,
      "სახლის დეკორი": GiSofa,
      წიგნები: SiBookstack,
      კომპიუტერები: FaComputer,
      ტელეფონები: CiMobile3,
      "საბავშვო საქონელი": TbMoodKid,
      "ჯანმრთელობა და სილამაზე": MdHealthAndSafety,
      ხელოვნება: SiArtifacthub,
      "ელექტრო ტექნიკა": MdElectricalServices,
      "სამზარეულოს ნივთები": FaBlenderPhone,
      სათამაშოები: MdToys,
      "სპორტული ინვენტარი": MdOutlineSportsTennis,
      "მუსიკალური ინსტრუმენტები": GiMusicalKeyboard,
      "გარემოს დაცვა": FaTree,
      სამოსელი: PiPants,
      ფოტოტექნიკა: FaCameraRetro,
      კოსმეტიკა: MdOutlineGirl,
    };
    return icons[categoryName] || FaBeer || FaApple; // Default icon if no match found
  };

  return (
    <div className="overflow-y-scroll">
      <h2 className="text-lg font-semibold p-4">კატეგორიები</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
        {categories.map((category) => {
          const Icon = getIcon(category.name);
          return (
            <div
              key={category._id}
              onClick={() => handleCategorySelect(category)}
              className="flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer bg-[#dfecff]"
            >
              <Icon className="text-2xl mb-2" />
              <span>{category.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Categories;
