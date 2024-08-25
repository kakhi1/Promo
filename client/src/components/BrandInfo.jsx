import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import config from "../config";
import OffersCard from "./OffersCard";
import BrandCard from "./BrandCard";
import { useAuth } from "../context/AuthContext";
import AdComponent from "./AdComponent";
import { toast } from "react-toastify";
import axios from "axios";

const BrandInfo = () => {
  const { brandId } = useParams();
  const [brands, setBrands] = useState([]);
  const [brand, setBrand] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [columns, setColumns] = useState(2); // Default to mobile view
  const [currentPage, setCurrentPage] = useState(1);

  const { user, isAuthenticated, token, userRole } = useAuth();
  const userId = user?.id || user?._id;

  const [showAllProducts, setShowAllProducts] = useState(false);

  const handleShowAllProducts = () => {
    setShowAllProducts(!showAllProducts);
  };

  const handleShowAllBrands = () => {
    setShowAllBrands(!showAllBrands);
  };

  const onFavoriteToggle = async () => {
    fetchFavorites();
  };

  const baseUrl = `${config.apiBaseUrl}/`;

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch(
          `${config.apiBaseUrl}/api/brands/${brandId}/suggestions`
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
          `${config.apiBaseUrl}/api/brands/${brandId}`
        );
        const brandData = await brandResponse.json();
        if (!brandResponse.ok)
          throw new Error(brandData.message || "Failed to fetch brand.");

        const offersResponse = await fetch(
          `${config.apiBaseUrl}/api/brands/${brandId}/offers`
        );
        const offersData = await offersResponse.json();
        if (!offersResponse.ok)
          throw new Error(offersData.message || "Failed to fetch offers.");

        setBrand(brandData);
        setOffers(offersData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
    fetchBrandAndOffers();
  }, [brandId]);

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth >= 1000) {
        setColumns(6);
      } else if (window.innerWidth >= 768) {
        setColumns(5);
      } else {
        setColumns(2);
      }
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const itemsPerPage = columns * 6;
  const totalPages = Math.ceil(offers.length / itemsPerPage);

  const paginatedOffers = offers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!brand) return <div>No brand found.</div>;

  const imageUrl = `${config.apiBaseUrl}/${brand.imageUrl.replace(/\\/g, "/")}`;

  return (
    <div className="flex md:flex-row flex-col-reverse px-10">
      <div className="md:w-4/5 w-full">
        <div className="flex justify-start py-4">
          <h1 className="text-[24px] font-semibold">{brand.name}</h1>
        </div>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:flex-row flex flex-col">
            <div className="flex justify-center items-center p-4 md:w-[40%] w-full">
              <img
                src={imageUrl}
                alt={brand.name}
                className="max-h-full max-w-full"
              />
            </div>
            <div className="flex-1 p-4 overflow-auto">
              <p>{brand.description}</p>
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="flex justify-between items-center py-4">
            <h2 className="text-lg font-semibold">
              ამ ბრენდის ტოპ შეთავაზებები
            </h2>
          </div>
          <div
            className={`grid grid-cols-2 md:grid-cols-${columns} gap-4 mb-8`}
          >
            {paginatedOffers.map((offer) => {
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
                  offer={offer}
                  numberField={offer.numberField}
                />
              );
            })}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={`mx-1 px-3 py-1 rounded ${
                    currentPage === index + 1
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-between items-center py-4">
          <h2 className="text-lg font-semibold">ტოპ ბრენდები</h2>
          {!showAllBrands && (
            <button
              onClick={handleShowAllBrands}
              className="text-indigo-600 hover:text-indigo-800"
            >
              {showAllBrands ? "ნაკლები" : "ყველა"}
            </button>
          )}
        </div>
        <div className={`grid grid-cols-2 md:grid-cols-${columns} gap-4`}>
          {(showAllBrands ? brands : brands.slice(0, columns * 2)).map(
            (brand) => {
              const imagePath = brand.imageUrl.replace(/\\/g, "/");
              const fullImageUrl = baseUrl + imagePath;

              return (
                <BrandCard
                  key={brand._id}
                  id={brand._id}
                  name={brand.name}
                  imageUrl={fullImageUrl}
                  offerCount={brand.offers.length}
                />
              );
            }
          )}
        </div>
      </div>
      <div className="w-full bg-gray-300 h-56 mb-4 md:mb-0 md:w-1/5 md:h-screen md:ml-4">
        <div className="p-4">
          <AdComponent pageType="userarea" />
        </div>
      </div>
    </div>
  );
};

export default BrandInfo;
