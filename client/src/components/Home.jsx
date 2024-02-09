import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // If needed for navigation

const Home = () => {
  const [products] = useState([...Array(20).keys()]); // Simulated array of products
  const [brands] = useState([...Array(20).keys()]); // Simulated array of brands
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const handleShowAllProducts = () => setShowAllProducts(true);
  const handleShowAllBrands = () => setShowAllBrands(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="pt-8 bg-white">
      {/* Responsive Grid Layout */}
      <div className="flex md:flex-row flex-col-reverse justify-center px-5">
        {/* Main Content Section */}
        <div className="md:flex-grow">
          {/* Top Offers Section */}
          <div className="flex justify-between items-center py-4">
            <h2 className="text-lg font-semibold">ტოპ შემოთავაზებები</h2>
            {!showAllProducts && (
              <button
                onClick={handleShowAllProducts}
                className="text-indigo-600 hover:text-indigo-800"
              >
                ყველა
              </button>
            )}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {(showAllProducts
              ? products
              : isMobile
              ? products.slice(0, 4)
              : products.slice(0, 8)
            ).map((product, index) => (
              <div
                key={index}
                className="bg-gray-200 h-40 flex items-center justify-center"
              >
                Product {product + 1}
              </div>
            ))}
          </div>

          {/* Top Brands Section */}
          <div className="flex justify-between items-center py-4">
            <h2 className="text-lg font-semibold">ტოპ ბრენდები</h2>
            {!showAllBrands && (
              <button
                onClick={handleShowAllBrands}
                className="text-indigo-600 hover:text-indigo-800"
              >
                ყველა
              </button>
            )}
          </div>

          {/* Brands Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(showAllBrands
              ? brands
              : isMobile
              ? brands.slice(0, 4)
              : brands.slice(0, 8)
            ).map((brand, index) => (
              <div
                key={index}
                className="bg-gray-200 h-20 flex items-center justify-center"
              >
                Brand {brand + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Ad Section - On top for mobile */}
        <div className="w-full bg-gray-300 h-56 mb-4 md:mb-0 md:w-1/5 md:h-screen md:ml-4">
          <div className="p-4">Ad Content Here</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
