import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { FaLariSign } from "react-icons/fa6";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";

const OffersCard = ({
  id,
  imageUrl,
  title,
  originalPrice,
  discountPrice,
  views,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toggleFavorite = (event) => {
    // Stop the click event from bubbling up to the parent
    event.stopPropagation();

    if (!isAuthenticated) {
      // If the user is not authenticated, show a warning message
      toast.warn("ფავორიტებში დასამატებლად გთხოვთ გაიაროთ რეგისტრაცია");
    } else {
      setIsLiked(!isLiked); // Toggle the like state
      // Add logic to handle adding/removing from favorites in your backend or state management
    }
  };
  const handleCardClick = async () => {
    if (!id) {
      console.error("Offer ID is undefined.");
      return; // Prevent further execution if id is undefined
    }
    try {
      // Assuming you're using fetch to send the POST request
      await fetch(`http://localhost:5000/api/offers/increment-views/${id}`, {
        method: "POST",
      });
      // After incrementing views, navigate to the OffersInfo page
      navigate(`/offer-card/${id}`);
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  // // Logic to handle the display of prices
  // Determine if there's a valid discount price to show
  const showDiscountPrice = discountPrice && discountPrice < originalPrice;

  return (
    <section
      className="flex relative flex-col items-araound justify-center md:p-4 p-2 h-[185px] max-w-[280px]  md:h-[285px] border border-gray-300 bg-productBg lg:cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="h-[80%] ">
        <img
          src={imageUrl}
          alt="Offer"
          className="w-full h-full md:object-cover lg:px-4 object-contain"
        />
        <FaHeart
          className={`absolute  top-2 right-2 cursor-pointer ${
            isLiked ? "fill-red-500" : "stroke-current text-gray-500"
          }`}
          onClick={(event) => toggleFavorite(event)}
        />
      </div>
      <div>
        <h1 className="md:text-base text-xs font-semibold mt-2">{title}</h1>
        <div className="flex items-center justify-between w-full mt-2">
          <div className="flex items-start gap-2">
            <div className="flex items-center ">
              {/* Conditional rendering based on discount availability */}
              {showDiscountPrice && (
                <>
                  {/* Discounted price */}
                  <div className="flex items-center">
                    <span className="md:text-base text-xs font-semibold">
                      {discountPrice}
                    </span>
                    <FaLariSign className="md:text-sm text-[10px]" />
                  </div>
                  {/* Original price, struck through */}
                  <div className="flex items-center">
                    <span className="md:text-base text-xs font-semibold text-[12px]  text-[#FF6262] line-through ">
                      {originalPrice}
                    </span>
                    <FaLariSign className="text-[10px]" color="#FF6262" />
                  </div>
                </>
              )}
              {!showDiscountPrice && (
                // Only original price when no discount
                <div className="flex items-center">
                  <span className="md:text-base text-xs font-semibold">
                    {originalPrice}
                  </span>
                  <FaLariSign className="md:text-sm text-[10px]" />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center md:mt-1 mt-[2px]">
            <IoEyeOutline className="text-base text-[#9D9D9D]" />
            <span className="ml-1 md:text-xs text-[8px] text-[#9D9D9D]">
              {views}
            </span>
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default OffersCard;
