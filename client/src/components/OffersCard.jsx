import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { FaLariSign } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { RxPencil1 } from "react-icons/rx";
import { FaRegTrashCan } from "react-icons/fa6";
import config from "../config";

const OffersCard = ({
  id,
  imageUrls = [],
  title,
  originalPrice,
  discountPrice,
  brandid,
  views,
  userRole,
  onFavoriteToggle,
  offer = {}, // Ensure offer is an object by default
  onModify,
  onDelete,
  numberField,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showActions, setShowActions] = useState(false);
  const { isAuthenticated, user, token } = useAuth();
  const userId = user?.id || user?._id;
  const navigate = useNavigate();
  const [brandName, setBrandName] = useState("");
  const truncateText = (text, maxLength) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };
  useEffect(() => {
    const fetchBrandName = async () => {
      try {
        const response = await axios.get(
          `${config.apiBaseUrl}/api/brands/${brandid}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBrandName(response.data.name);
      } catch (error) {
        console.error("Failed to fetch brand details:", error);
      }
    };
    fetchBrandName();
  }, [brandid, token]);

  useEffect(() => {
    if (isAuthenticated && userRole === "user") {
      checkFavoriteStatus();
    }
  }, [id, isAuthenticated, userId, userRole]);

  const checkFavoriteStatus = async () => {
    if (userRole !== "user") return;

    try {
      const response = await axios.get(
        `${config.apiBaseUrl}/api/users/${userId}/favorites/${id}`,
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
      await axios({
        method,
        url: `${config.apiBaseUrl}/api/users/${userId}/favorites/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsLiked(!isLiked);
      toast.success(`პროდუქცია ${isLiked ? "წაიშალა" : "დაემატა"} ფავორიტებში`);
      if (onFavoriteToggle) onFavoriteToggle();
    } catch (error) {
      console.error("Failed to update favorites:", error);
      toast.error("პროდუქციის დასამატებლად გთხოვთ გაიაროთ რეგისტრაცია1111");
      if (error.response) {
      } else {
        console.log("Error message:", error.message);
      }
    }
  };

  // const handleCardClick = async () => {
  //   if (userRole === "admin" || userRole === "brand") {
  //     setShowActions(!showActions);
  //     return;
  //   }

  //   if (!id) {
  //     console.error("Offer ID is undefined.");
  //     return;
  //   }

  //   const url = offer.url;

  //   if (!url) {
  //     console.error("Offer URL is undefined.");
  //     return;
  //   }

  //   try {
  //     await fetch(`${config.apiBaseUrl}/api/offers/increment-views/${id}`, {
  //       method: "POST",
  //     });

  //     // Navigate only if offer.description is not present
  //     if (!offer.description) {
  //       // Check if the URL is an external link and open in a new tab
  //       if (url.startsWith("http://") || url.startsWith("https://")) {
  //         window.open(url, "_blank");
  //       } else {
  //         navigate(url); // Navigate within the app
  //       }
  //     } else {
  //       navigate(`/offer-card/${id}`); // Navigate to the offer card page
  //     }
  //   } catch (error) {
  //     console.error("Error incrementing views:", error);
  //   }
  // };
  const handleCardClick = async () => {
    if (userRole === "admin" || userRole === "brand") {
      setShowActions(!showActions);
      return;
    }

    if (!id) {
      console.error("Offer ID is undefined.");
      return;
    }

    const url = offer.url;

    try {
      await fetch(`${config.apiBaseUrl}/api/offers/increment-views/${id}`, {
        method: "POST",
      });

      // Navigate based on the presence of the offer.description
      if (!offer.description) {
        // Check if the URL is an external link and open in a new tab
        if (url.startsWith("http://") || url.startsWith("https://")) {
          window.open(url, "_blank");
        } else {
          navigate(url); // Navigate within the app
        }
      } else {
        navigate(`/offer-card/${id}`); // Navigate to the offer card page
      }
    } catch (error) {
      console.error("Error incrementing views:", error);
      toast.error("Failed to navigate to the offer.");
    }
  };

  const handleActionClick = (e, action) => {
    e.stopPropagation();
    if (action === "modify") onModify(id);
    if (action === "delete") onDelete(id);
    setShowActions(false);
  };

  const hasImages = Array.isArray(imageUrls) && imageUrls.length > 0;
  const showDiscountPrice = discountPrice && discountPrice < originalPrice;

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + imageUrls.length) % imageUrls.length
    );
  };

  return (
    <section
      className="flex relative flex-col items-araound justify-center md:p-4 p-4 h-[200px] max-w-[280px] shadow-lg  md:h-[285px] border border-gray-300 bg-productBg lg:cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Display the numberField on the left side */}
      {numberField > 0 && (
        <div className="absolute top-4 left-4 bg-green-500 rounded-lg text-white text-center font-bold md:text-[36px] text-[30px] w-[40%] h-[20%] z-50 flex  justify-center items-center">
          -{numberField}%
        </div>
      )}

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
          {imageUrls.length > 1 && (
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
          className={`absolute  top-3 md:top-0 -right-2 cursor-pointer text-[25px] ${
            isLiked ? "fill-red-500" : "stroke-current text-gray-500"
          }`}
          onClick={(event) => toggleFavorite(event)}
        />
      </div>
      <div className="flex flex-col">
        <div>
          <h1 className="text-xs font-bold mt-4">{brandName}</h1>
        </div>
      </div>
      <div className="flex justify-between ">
        <h1 className="text-xs font-semibold mt-4 md:whitespace-normal">
          <span className="block md:hidden">{truncateText(title, 30)}</span>
          <span className="hidden md:block">{title}</span>
        </h1>
        {status === "pending" && (
          <div className="mt-2">
            <p className="text-red-500 font-bold">დასადასტურებელია</p>
          </div>
        )}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-start gap-2"></div>
          <div className="flex items-center md:mt-1">
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
