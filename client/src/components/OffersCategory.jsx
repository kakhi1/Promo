import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import OffersCard from "./OffersCard";
import AdComponent from "./AdComponent";
import config from "../config";

const OffersCategory = () => {
  const [offers, setOffers] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [columns, setColumns] = useState(2); // Default to mobile view
  const [currentPage, setCurrentPage] = useState(1);
  const { categoryId } = useParams();

  const baseUrl = `${config.apiBaseUrl}/`;

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
    window.addEventListener("resize", () => {
      setIsMobile(window.innerWidth <= 768);
      updateColumns();
    });
    return () =>
      window.removeEventListener("resize", () => {
        setIsMobile(window.innerWidth <= 768);
        updateColumns();
      });
  }, []);

  useEffect(() => {
    const fetchOffers = async () => {
      if (!categoryId) {
        console.error("Category ID is not specified.");
        return;
      }

      try {
        const response = await axios.get(
          `${config.apiBaseUrl}/api/offers?category=${categoryId}`
        );
        if (response.data && response.data.data) {
          setOffers(response.data.data);
          setCategoryName(
            response.data.data.length > 0
              ? response.data.data[0].categoryName
              : "Unknown Category"
          );
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

  const offersPerPage = columns * 6; // 6 rows per page
  const indexOfLastOffer = currentPage * offersPerPage;
  const indexOfFirstOffer = indexOfLastOffer - offersPerPage;
  const currentOffers = offers.slice(indexOfFirstOffer, indexOfLastOffer);
  const totalPages = Math.ceil(offers.length / offersPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="pt-8 bg-white w-full">
      <div className="flex md:flex-row flex-col-reverse">
        <div className="md:flex-grow ml-6">
          <div className="flex justify-between items-center py-4">
            <h2 className="text-lg font-semibold">{categoryName} პროდუქტი</h2>
          </div>
          {offers.length > 0 ? (
            <div
              className={`grid grid-cols-2 md:grid-cols-${columns} gap-4 mb-8`}
            >
              {currentOffers.map((offer) => (
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
                  numberField={offer.numberField}
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
