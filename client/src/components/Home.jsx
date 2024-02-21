import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // If needed for navigation
import OffersCard from "./OffersCard";
import BrandCard from "./BrandCard";

const Home = () => {
  const [brands] = useState([...Array(20).keys()]); // Simulated array of brands
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleShowAllBrands = () => setShowAllBrands(true);
  const handleShowAllProducts = () => setShowAllProducts(!showAllProducts);
  const handleResize = () => {
    console.log("Window resized");
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    // Function to fetch offers from an API
    const fetchOffers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/offers");
        if (!response.ok) {
          throw new Error(
            `Network response was not ok, status: ${response.status}`
          );
        }
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setOffers(result.data);
          console.log("Fetched offers:", result.data);
          setError(""); // Clear any previous errors
        } else {
          throw new Error(
            "Data format is incorrect, expected an array of offers."
          );
        }
      } catch (error) {
        console.error("Failed to fetch offers:", error);
        setError(error.message);
      } finally {
        setLoading(false); // Ensure loading state is updated regardless of outcome
      }
    };

    // Call fetchOffers to load data when the component mounts
    fetchOffers();

    // Setup the resize event listener
    window.addEventListener("resize", handleResize);

    // Cleanup function to remove the event listener when the component unmounts or before the effect runs again
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty dependency array means this effect runs once on mount

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="pt-8 bg-white w-full">
      {/* Responsive Grid Layout */}
      <div className="flex md:flex-row flex-col-reverse justify-center px-5">
        {/* Main Content Section */}
        <div className="md:flex-grow ">
          {/* Top Offers Section */}
          <div className="flex justify-between items-center py-4">
            <h2 className="text-lg font-semibold">ტოპ შემოთავაზებები </h2>
            <button
              onClick={handleShowAllProducts}
              className="text-indigo-600 hover:text-indigo-800"
            >
              {showAllProducts ? "ნაკლები" : "ყველა"}
            </button>
          </div>

          {/* Products Grid */}

          <div className="grid grid-cols-2 md:grid-cols-4 xl2:grid-cols-6 gap-4 mb-8 ">
            {(showAllProducts
              ? offers
              : isMobile
              ? offers.slice(0, 4)
              : offers.slice(0, 8)
            ).map((offer) => {
              // Assuming your backend server is running on localhost:5000
              // and the images are served from the 'uploads' directory
              const baseUrl = "http://localhost:5000/";
              const imagePath = offer.imageUrl.replace(/\\/g, "/"); // Replace backslashes with forward slashes if needed
              const fullImageUrl = baseUrl + imagePath;

              return (
                <OffersCard
                  key={offer._id}
                  id={offer._id}
                  imageUrl={fullImageUrl} // Assuming fullImageUrl is correctly defined earlier
                  title={offer.title}
                  originalPrice={offer.originalPrice}
                  discountPrice={offer.discountPrice}
                  views={offer.views}
                />
              );
            })}
          </div>

          {/* Rendering Offers using OffersCard components */}

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
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
        </div> */}
          {/* Brands Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(showAllBrands
              ? brands // Assuming this now includes brand details fetched from an API
              : isMobile
              ? brands.slice(0, 4)
              : brands.slice(0, 8)
            ).map((brand) => (
              <BrandCard
                key={brand._id} // Use a unique identifier from your brand data
                name={brand.name}
                imageUrl={brand.imageUrl} // Ensure you construct the full URL if necessary
              />
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
