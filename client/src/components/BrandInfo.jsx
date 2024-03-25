import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OffersCard from "./OffersCard";
import BrandCard from "./BrandCard";
import { useAuth } from "../context/AuthContext";
import AdComponent from "./AdComponent";
import { toast } from "react-toastify";
import axios from "axios";

// Assuming you're using react-router-dom for routing
import { useParams } from "react-router-dom";

const BrandInfo = () => {
  const { brandId } = useParams();
  const [brands, setBrands] = useState([]);
  const [brand, setBrand] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAllBrands, setShowAllBrands] = useState(false);

  const { user, isAuthenticated, token, userRole } = useAuth();
  const userId = user?.id || user?._id;

  const [showAllProducts, setShowAllProducts] = useState(false);

  const handleShowAllProducts = () => {
    setShowAllProducts(!showAllProducts);
  };

  const handleShowAllbrands = () => {
    setShowAllBrands(!showAllBrands);
  };
  // Function to refresh offers/favorites when a favorite is toggled
  const onFavoriteToggle = async () => {
    fetchFavorites();
    // Additionally fetch favorites if needed
  };

  // Placeholder for determining if the device is mobile
  const isMobile = window.innerWidth < 768;

  // Your API base URL
  const baseUrl = "http://localhost:5000/";

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/brands/${brandId}/suggestions`
        );
        const data = await response.json();
        setBrands(data.data);

        if (!response.ok)
          throw new Error(data.message || "Failed to fetch brands.");
        setBrands(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      }
    };

    const fetchBrandAndOffers = async () => {
      try {
        const brandResponse = await fetch(
          `http://localhost:5000/api/brands/${brandId}`
        );
        const brandData = await brandResponse.json();
        if (!brandResponse.ok)
          throw new Error(brandData.message || "Failed to fetch brand.");

        // Assuming there's an API to fetch all offers for a brand sorted by views
        const offersResponse = await fetch(
          `http://localhost:5000/api/brands/${brandId}/offers`
        );
        const offersData = await offersResponse.json();
        if (!offersResponse.ok)
          throw new Error(offersData.message || "Failed to fetch offers.");

        setBrand(brandData);
        setOffers(offersData); // Assuming this array is already sorted by views
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
    fetchBrandAndOffers();
  }, [brandId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!brand) return <div>No brand found.</div>;

  // Adjust the image path as needed
  const imageUrl = `http://localhost:5000/${brand.imageUrl.replace(
    /\\/g,
    "/"
  )}`;

  return (
    <div className="flex md:flex-row flex-col-reverse  px-10">
      <div className="md:w-4/5 w-full">
        <div className="flex justify-start py-4">
          <h1 className="text-[24px] font-semibold">{brand.name}</h1>
        </div>
        <div className="flex  flex-col md:flex-row">
          <div className="w-full md:flex-row flex flex-col">
            {" "}
            {/* Image */}
            <div className="flex justify-center items-center p-4 md:w-[40%] w-full">
              <img
                src={imageUrl}
                alt={brand.name}
                className="max-h-full max-w-full"
              />
            </div>
            {/* Description */}
            <div className="flex-1 p-4 overflow-auto">
              <p>{brand.description}</p>
            </div>
          </div>
        </div>
        {/* Brand and product details */}
        <div className="w-full">
          {/* Top Offers Section */}
          <div className="flex justify-between items-center py-4">
            <h2 className="text-lg font-semibold">
              ამ ბრენდის ტოპ შეთავაზებები
            </h2>
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
              const imageUrls = offer.imageUrls
                ? offer.imageUrls.map(
                    (path) => `${baseUrl}${path.replace(/\\/g, "/")}`
                  )
                : [];
              return (
                <OffersCard
                  key={offer._id}
                  id={offer._id}
                  imageUrls={imageUrls}
                  title={offer.title}
                  originalPrice={offer.originalPrice}
                  discountPrice={offer.discountPrice}
                  views={offer.views}
                  userRole={user?.role}
                  onFavoriteToggle={onFavoriteToggle}
                />
              );
            })}
          </div>
        </div>
        {/* Top Brands Section */}
        <div className="flex justify-between items-center py-4">
          <h2 className="text-lg font-semibold">ტოპ ბრენდები</h2>
          {!showAllBrands && (
            <button
              onClick={handleShowAllbrands}
              className="text-indigo-600 hover:text-indigo-800"
            >
              {showAllBrands ? "ნაკლები" : "ყველა"}
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
          ).map((brand) => {
            // and the images are served from the 'uploads' directory
            const baseUrl = "http://localhost:5000/";
            const imagePath = brand.imageUrl.replace(/\\/g, "/"); // Replace backslashes with forward slashes if needed
            const fullImageUrl = baseUrl + imagePath;

            return (
              <BrandCard
                key={brand._id}
                id={brand._id}
                name={brand.name}
                imageUrl={fullImageUrl} // Adjust as necessary for the path
                offerCount={brand.offers.length} // Make sure your API provides this
              />
            );
          })}
        </div>
      </div>
      {/* add section */}
      <div className="w-full bg-gray-300 h-56 mb-4 md:mb-0 md:w-1/5 md:h-screen md:ml-4">
        <div className="p-4">
          <AdComponent pageType="userarea" />
        </div>
      </div>
    </div>
  );
};

export default BrandInfo;
