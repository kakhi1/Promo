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
  const { userRole } = useAuth();

  console.log("brandetails:", brandDetails);
  const navigate = useNavigate();

  useEffect(() => {
    const brandId = localStorage.getItem("brandId");

    const fetchBrandDetails = async () => {
      if (!brandId) {
        console.error("Brand ID is not provided.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/brands/${brandId}`
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
      // await axios.delete(
      //   `http://localhost:5000/api/offers/${selectedOffer._id}`
      // );
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

  const baseUrl = "http://localhost:5000/";
  const navigateToAddOffers = () => {
    navigate("/adoffers");
  };

  // Safe guard to ensure brandDetails is not null before accessing offers
  const offers = brandDetails ? brandDetails.offers : [];

  // Optionally, control the display of offers based on `showAllBrands`
  const displayedOffers = showAllBrands ? offers : offers.slice(0, 4);
  console.log("userRole in OffersCard:", userRole);

  // if (!brandDetails || offers.length === 0) {
  //   return <div>Loading...</div>; // Or any other indicator you prefer
  // }

  return (
    <div className="pt-8 bg-white">
      <div className="flex flex-col items-center">
        <section className="w-full px-5">
          <div className="flex justify-between items-center py-4">
            <h2 className="text-lg font-semibold">არსებული შეთავაზებები</h2>
            <button
              onClick={() => setShowAllBrands(!showAllBrands)}
              className="text-indigo-600 hover:text-indigo-800"
            >
              {showAllBrands ? "ყველა " : "ნაკლები"}
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {displayedOffers.map((offer) => (
              <div
                key={offer._id}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedOffer(offer);
                  setIsModalOpen(true);
                }}
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
              className="min-w-[140px]  flex items-center justify-center cursor-pointer text-sm gap-4 shadow-lg flex-col bg-productBg text-[#5E5FB2]"
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
          onClose={() => setIsModalOpen(false)}
          onModify={handleModify}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default BrandArea;
