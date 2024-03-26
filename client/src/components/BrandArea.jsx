// export default BrandArea;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import OffersCard from "./OffersCard";
import { FaPlus } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import OfferModal from "./OfferModal";

const BrandArea = () => {
  const [brandDetails, setBrandDetails] = useState(null);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { userRole } = useAuth();
  const [modalPosition, setModalPosition] = useState({ top: 5, left: 0 });
  const navigate = useNavigate();
  const [totalFavorites, setTotalFavorites] = useState(0);
  const [metrics, setMetrics] = useState({
    totalViews: 0,
    totalShares: 0,
    totalVisits: 0,
  });

  //statistic

  useEffect(() => {
    const brandId = localStorage.getItem("brandId");
    const fetchMetrics = async () => {
      try {
        const response = await fetch(
          `https://promo-iror.onrender.com/api/brands/${brandId}/metrics`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setMetrics(data); // Adjust this line based on the actual structure
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  useEffect(() => {
    const brandId = localStorage.getItem("brandId");
    const fetchFavoritesCount = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://promo-iror.onrender.com/api/brands/${brandId}/offers-favorites-count`
        ); // Adjust the URL as necessary
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("data", data);
        // If data is an array of offers, calculate the sum of all favorites counts
        const total = data.data.reduce(
          (acc, offer) => acc + offer.favoritesCount,
          0
        );
        setTotalFavorites(total);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritesCount();
  }, []);

  const handleClickOffer = (e, offer) => {
    e.stopPropagation(); // Prevent event bubbling

    const rect = e.currentTarget.getBoundingClientRect();
    const modalStyle = {
      top: rect.top + window.scrollY + rect.height / 2, // Center modal vertically
      left: rect.left + window.scrollX + rect.width / 2, // Center modal horizontally
      width: rect.width, // Capture width of the clicked div
      height: rect.height, // Capture height of the clicked div
    };

    setSelectedOffer(offer);
    setModalPosition(modalStyle); // Now includes width and height
    setIsModalOpen(true);
  };

  useEffect(() => {
    const brandId = localStorage.getItem("brandId");

    const fetchBrandDetails = async () => {
      if (!brandId) {
        console.error("Brand ID is not provided.");
        return;
      }

      try {
        const response = await axios.get(
          `https://promo-iror.onrender.com/api/brands/${brandId}`
        );
        setBrandDetails(response.data);
      } catch (error) {
        console.error("Failed to fetch brand details:", error);
      }
    };

    fetchBrandDetails();
  }, []);

  const handleModify = () => {
    navigate(`/modifyoffer/${selectedOffer._id}`);
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://promo-iror.onrender.com/api/offers/${selectedOffer._id}`
      );
      setBrandDetails({
        ...brandDetails,
        offers: brandDetails.offers.filter(
          (offer) => offer._id !== selectedOffer._id
        ),
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to delete offer:", error);
    }
  };

  const baseUrl = "https://promo-iror.onrender.com/";
  const navigateToAddOffers = () => {
    navigate("/adoffers");
  };

  // Safe guard to ensure brandDetails is not null before accessing offers
  const offers = brandDetails ? brandDetails.offers : [];

  // Optionally, control the display of offers based on `showAllBrands`
  const displayedOffers = showAllBrands ? offers : offers.slice(0, 4);

  return (
    <div className="pt-8 w-full bg-white flex  md:flex-row flex-col items-center">
      <div className="flex flex-col items-center md:w-3/4  w-full">
        <section className="w-full px-5">
          <div className="flex justify-between items-center py-4">
            <h2 className="text-lg font-semibold">არსებული შეთავაზებები</h2>
            <button
              onClick={() => setShowAllBrands(!showAllBrands)}
              className="text-indigo-600 hover:text-indigo-800"
            >
              {showAllBrands ? " ნაკლები " : "ყველა"}
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {displayedOffers.map((offer) => (
              <div
                key={offer._id}
                className="cursor-pointer"
                onClick={(e) => handleClickOffer(e, offer)}
              >
                <OffersCard
                  id={offer._id}
                  imageUrls={
                    offer.imageUrls
                      ? offer.imageUrls.map(
                          (path) => `${baseUrl}${path.replace(/\\/g, "/")}`
                        )
                      : []
                  }
                  title={offer.title}
                  originalPrice={offer.originalPrice}
                  discountPrice={offer.discountPrice}
                  views={offer.views}
                  userRole={userRole}
                />
              </div>
            ))}
            <div
              onClick={navigateToAddOffers}
              className="max-w-[280px] min-w-[200px] md:h-[285px] h-[200px] flex items-center justify-center cursor-pointer text-sm gap-4 shadow-lg flex-col bg-productBg text-[#5E5FB2]"
            >
              <FaPlus size={24} color="#5E5FB2" />
              <p>დამატება</p>
            </div>
          </div>
        </section>
      </div>
      {isModalOpen && selectedOffer && (
        <OfferModal
          offer={selectedOffer}
          position={modalPosition}
          style={{
            position: "fixed", // Or 'absolute', depending on your layout
            top: modalPosition.top + "px",
            left: modalPosition.left + "px",
            width: modalPosition.width + "px", // Apply width
            height: modalPosition.height + "px", // Apply height
            transform: "translate(-50%, -250%)", // Adjust if needed to center
          }}
          onClick={(e) => {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            setSelectedOffer(offer);
            setIsModalOpen(true);
            // Set the modal position
            setModalPosition({ top: rect.top, left: rect.left });
          }}
          onClose={() => setIsModalOpen(false)}
          onModify={handleModify}
          onDelete={handleDelete}
        />
      )}
      <div className=" md:w-1/4 w-full md:h-[200px] mt-4 md:mt-0">
        <div className="p-4 max-w-sm mx-auto bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            ანალიტიკა
          </h5>
          <div className="font-normal text-gray-700 dark:text-gray-400 text-left">
            <p>შემოთავაზებაზე გადასვლის რაოდენობა:</p>
            <p>{metrics.totalViews}</p>
            <br />
          </div>
          <div className="font-normal text-gray-700 dark:text-gray-400">
            <p>შემოთავაზების სოც მედიაში გაზიარების რაოდენობა:</p>
            <p>{metrics.totalShares}</p>
            <br />
          </div>
          <div className="font-normal text-gray-700 dark:text-gray-400">
            <p>შემოთავაზების ლინკზე გადასვლის რაოდენობა:</p>
            <p>{metrics.totalVisits}</p>
            <br />
          </div>
          <div>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              ფავორიტებში დამატებული სულ : {totalFavorites}
            </p>
          </div>
          <br />
        </div>
      </div>
    </div>
  );
};

export default BrandArea;
