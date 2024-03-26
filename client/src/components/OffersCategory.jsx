import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import OffersCard from "./OffersCard";
import AdComponent from "./AdComponent";

const OffersCategory = () => {
  const [offers, setOffers] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [currentPage, setCurrentPage] = useState(1);
  const offersPerPage = 12;
  const { categoryId } = useParams();

  const baseUrl = "https://promo-iror.onrender.com/"; // Adjust this to your actual base URL

  useEffect(() => {
    window.addEventListener("resize", () =>
      setIsMobile(window.innerWidth <= 768)
    );
    return () =>
      window.removeEventListener("resize", () =>
        setIsMobile(window.innerWidth <= 768)
      );
  }, []);

  useEffect(() => {
    const fetchOffers = async () => {
      if (!categoryId) {
        console.error("Category ID is not specified.");
        return;
      }

      try {
        const response = await axios.get(
          `https://promo-iror.onrender.com/api/offers?category=${categoryId}`
        );
        if (response.data && response.data.data) {
          setOffers(response.data.data);
          setCategoryName(
            response.data.data.length > 0
              ? response.data.data[0].categoryName
              : "Unknown Category"
          ); // Assuming categoryName is part of the offer data
        } else {
          console.error(
            "Received data is not in the expected format:",
            response.data
          );
          setOffers([]);
        }
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };

    fetchOffers();
  }, [categoryId]);

  const indexOfLastOffer = currentPage * offersPerPage;
  const indexOfFirstOffer = indexOfLastOffer - offersPerPage;
  const currentOffers = offers.slice(indexOfFirstOffer, indexOfLastOffer);
  const totalPages = Math.ceil(offers.length / offersPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleShowAllProducts = () => setShowAllProducts(!showAllProducts);

  return (
    <div className="pt-8 bg-white w-full">
      <div className="flex md:flex-row flex-col-reverse">
        <div className="md:flex-grow ml-6">
          <div className="flex justify-between items-center py-4">
            <h2 className="text-lg font-semibold">პროდუქტი</h2>
            {!isMobile || !showAllProducts ? (
              <button
                onClick={handleShowAllProducts}
                className="text-indigo-600 hover:text-indigo-800"
              >
                {showAllProducts ? "ნაკლები" : "ყველა"}
              </button>
            ) : null}
          </div>
          {offers.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 xl2:grid-cols-6 gap-4 mb-8">
              {(showAllProducts ? offers : currentOffers).map((offer) => (
                <OffersCard
                  key={offer._id}
                  id={offer._id}
                  imageUrls={offer.imageUrls.map(
                    (path) => `${baseUrl}${path.replace(/\\/g, "/")}`
                  )}
                  title={offer.title}
                  views={offer.views}
                  userRole={offer.userRole}
                  onFavoriteToggle={() => {}}
                />
              ))}
            </div>
          ) : (
            <div>ამ კატეგორიაში პროდუქცია არ არის</div>
          )}
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`mx-1 px-3 py-1 ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                } hover:bg-blue-500 hover:text-white rounded-md`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
        <div className="w-full bg-gray-300 h-56 mb-4 md:mb-0 md:w-1/5 md:h-screen md:ml-4">
          <AdComponent />
        </div>
      </div>
    </div>
  );
};

export default OffersCategory;
