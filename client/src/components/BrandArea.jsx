import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BrandArea = () => {
  // Simulating an array for brands for demonstration
  const [brands, setBrands] = useState([...Array(19).keys()]);
  const [showAllBrands, setShowAllBrands] = useState(false);

  const navigate = useNavigate(); // Hook for navigation

  // Function to navigate to Add Offers page
  const navigateToAddOffers = () => {
    navigate("/adoffers"); // Update the path as needed
  };

  // Determine the number of brands to show
  const displayedBrands = showAllBrands ? brands : brands.slice(0, 2);

  return (
    <div className="pt-8 bg-white">
      <div className="flex flex-col items-center">
        {/* Brands Section */}
        <section className="w-full px-5">
          <div className="flex justify-between items-center py-4">
            <h2 className="text-lg font-semibold">არსებული შეთავაზებები</h2>
            <button
              onClick={() => setShowAllBrands(!showAllBrands)}
              className="text-indigo-600 hover:text-indigo-800"
            >
              {showAllBrands ? "ნაკლების ჩვენება" : "ყველას ჩვენება"}
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {displayedBrands.map((brand, index) => (
              <div
                key={index}
                className="min-w-[160px] h-40 bg-gray-200 flex items-center justify-center"
              >
                შეთავაზება {brand + 1}
              </div>
            ))}
            <div
              onClick={navigateToAddOffers}
              className="min-w-[160px] h-40 bg-gray-100 flex items-center justify-center text-center cursor-pointer"
              style={{ minHeight: "100px" }} // Adjust height as needed
            >
              შეთავაზებების დამატება
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BrandArea;
