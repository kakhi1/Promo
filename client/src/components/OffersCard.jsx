import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { FaLariSign } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { RxPencil1 } from "react-icons/rx";
import { FaRegTrashCan } from "react-icons/fa6";

const OffersCard = ({
  id,
  imageUrls = [],
  title,
  originalPrice,
  discountPrice,
  views,
  userRole,
  onFavoriteToggle,
  offer,
  onModify,
  onDelete,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showActions, setShowActions] = useState(false);
  // const { isAuthenticated, userRole } = useAuth();

  const { isAuthenticated } = useAuth();
  const { user } = useAuth();
  const token = user?.token;
  const userId = user?.id || user?._id;
  useEffect(() => {}, [token]);

  const navigate = useNavigate();

  useEffect(() => {
    // Now also checking if the user's role is "user"
    if (isAuthenticated && userRole === "user") {
      checkFavoriteStatus();
    }
  }, [id, isAuthenticated, userId, userRole]); // Dependencies for triggering this effect

  const checkFavoriteStatus = async () => {
    if (userRole !== "user") return; // Exit if not a "user" role

    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/${userId}/favorites/${id}`, // Adjusted URL to match the expected endpoint
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsLiked(response.data.isInFavorites);
    } catch (error) {
      console.error("Failed to fetch favorite status:", error);
    }
  };

  const toggleFavorite = async (event) => {
    event.stopPropagation();

    if (!isAuthenticated || userRole !== "user") {
      toast.warn("ფავორიტებში დასამატებლად გთხოვთ გაიაროთ რეგისტრაცია");
      return;
    }

    try {
      const method = isLiked ? "DELETE" : "POST";
      const response = await axios({
        method,
        url: `http://localhost:5000/api/users/${userId}/favorites/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsLiked(!isLiked); // Optimistically toggle the like state
      toast.success(`პროდუქცია ${isLiked ? "წაიშალა" : "დაემატა"} ფავორიტებში`);
      if (onFavoriteToggle) onFavoriteToggle(); // Call the prop function to refresh favorites in UserArea
    } catch (error) {
      console.error("Failed to update favorites:", error);
      toast.error("პროდუქციის დასამატებლად გთხოვთ გაიაროთ რეგისტრაცია");
      // More detailed error handling
      if (error.response) {
      } else {
        // Handling errors not related to the network request itself
        console.log("Error message:", error.message);
      }
    }
  };

  // Modify the handleCardClick function to support toggling admin actions for the 'admin' role
  const handleCardClick = async () => {
    // Toggle admin actions for admin users without navigating
    if (userRole === "admin" || userRole === "brand") {
      setShowActions(!showActions);
      return; // Prevent further execution for admin
    }

    // Existing logic for navigating or other roles remains the same
    if (!id) {
      console.error("Offer ID is undefined.");
      return;
    }
    try {
      await fetch(`http://localhost:5000/api/offers/increment-views/${id}`, {
        method: "POST",
      });
      navigate(`/offer-card/${id}`);
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };
  // Function to handle action button clicks
  const handleActionClick = (e, action) => {
    e.stopPropagation(); // Stop the click from bubbling up to the div
    if (action === "modify") onModify(id);
    if (action === "delete") onDelete(id);
    // Optionally close the action buttons after an action is taken
    setShowActions(false);
  };

  // Before accessing imageUrls.length, ensure imageUrls is defined and is an array
  const hasImages = Array.isArray(imageUrls) && imageUrls.length > 0;

  // // Logic to handle the display of prices
  // Determine if there's a valid discount price to show
  const showDiscountPrice = discountPrice && discountPrice < originalPrice;

  // Function to cycle images
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
  };

  return (
    <section
      className="flex relative flex-col items-araound justify-center md:p-4 p-4 h-[200px] max-w-[280px] shadow-lg  md:h-[285px] border border-gray-300 bg-productBg lg:cursor-pointer"
      onClick={handleCardClick}
    >
      {userRole === "admin" && showActions && (
        <div className="absolute -top-0 left-0 z-10 shadow-lg overflow-hidden w-full h-full cursor-pointer bg-[#1E1F53] opacity-95  flex flex-col justify-center items-center ">
          <div className="w-full flex h-1/3 items-center">
            <button
              onClick={(e) => handleActionClick(e, "modify")}
              className="bg-[#A8EB80] text-white lg:hover:bg-green-400 flex w-[50%] flex-col  h-full  items-center justify-center "
            >
              <RxPencil1 size={20} className="" />
              ჩასწორება
            </button>
            <button
              onClick={(e) => handleActionClick(e, "delete")}
              className="bg-red-500 text-white  lg:hover:bg-red-700 w-[50%] h-full flex flex-col items-center justify-center "
            >
              <FaRegTrashCan size={20} className="" />
              წაშლა
            </button>
          </div>

          <button
            onClick={() => setShowActions(false)}
            className="px-5  bg-gray-300 text-black justify-center items-center  hover:bg-gray-400 flex h-1/4 w-full "
          >
            გაუქმება
          </button>
        </div>
      )}
      <div className="h-[75%] flex justify-center relative" onClick={nextImage}>
        {hasImages && (
          <img
            src={imageUrls[currentImageIndex]}
            alt="Offer"
            className="max-w-full h-full bg-cover lg:px-4  "
          />
        )}

        <div className="absolute inset-0 flex justify-between items-center">
          {imageUrls.length > 1 && ( // Only show navigation buttons if there are multiple images
            <>
              <button
                className="text-[30px] hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
              >
                &lt;
              </button>
              <button
                className="text-[30px] hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
              >
                &gt;
              </button>
            </>
          )}
        </div>

        <FaHeart
          className={`absolute  top-0 right-0 cursor-pointer text-[25px] ${
            isLiked ? "fill-red-500" : "stroke-current text-gray-500"
          }`}
          onClick={(event) => toggleFavorite(event)}
        />
      </div>
      <div>
        <h1 className=" text-xs font-semibold mt-2">{title}</h1>
        {status === "pending" && (
          <div className="mt-2">
            <p className="text-red-500 font-bold">დასადასტურებელია</p>
          </div>
        )}
        <div className="flex items-center justify-between  mt-2">
          <div className="flex items-start gap-2">
            <div className="flex items-center gap-2">
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
                    <span className="text-xs md:text-sm font-semibold text-[12px]  text-[#FF6262] line-through ">
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
    </section>
  );
};

export default OffersCard;
