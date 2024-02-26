// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { FaHeart } from "react-icons/fa";
// import { IoEyeOutline } from "react-icons/io5";
// import { FaLariSign } from "react-icons/fa6";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useAuth } from "../context/AuthContext";
// import { FaEdit, FaTrash } from "react-icons/fa"; // Adjust according to your actual import paths

// const OffersCard = ({
//   id,
//   imageUrls = [],
//   title,
//   originalPrice,
//   discountPrice,
//   views,
//   userRole,
// }) => {
//   const [isLiked, setIsLiked] = useState(false);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   // const { isAuthenticated, userRole } = useAuth();
//   const { isAuthenticated, userRole: authUserRole } = useAuth();
//   console.log("userRole", userRole);
//   const navigate = useNavigate();

//   // Assuming this hook provides user and authentication status

//   const toggleFavorite = (event) => {
//     // Stop the click event from bubbling up to the parent
//     event.stopPropagation();

//     if (!isAuthenticated) {
//       // If the user is not authenticated, show a warning message
//       toast.warn("ფავორიტებში დასამატებლად გთხოვთ გაიაროთ რეგისტრაცია");
//     } else {
//       setIsLiked(!isLiked); // Toggle the like state
//       // Add logic to handle adding/removing from favorites in your backend or state management
//     }
//   };
//   const handleCardClick = async () => {
//     if (!id) {
//       console.error("Offer ID is undefined.");
//       return; // Prevent further execution if id is undefined
//     }
//     try {
//       // Assuming you're using fetch to send the POST request
//       await fetch(`http://localhost:5000/api/offers/increment-views/${id}`, {
//         method: "POST",
//       });
//       // After incrementing views, navigate to the OffersInfo page
//       navigate(`/offer-card/${id}`);
//     } catch (error) {
//       console.error("Error incrementing views:", error);
//     }
//   };

//   const handleDelete = async (event) => {
//     event.stopPropagation();
//     try {
//       await axios.delete(`http://localhost:5000/api/offers/${id}`);
//       toast.success("Offer deleted successfully");
//       // Optionally, trigger a state update in a parent component to refresh the list of offers
//     } catch (error) {
//       console.error("Failed to delete offer:", error);
//       toast.error("Error deleting offer");
//     }
//   };

//   const navigateToModify = (event) => {
//     event.stopPropagation();
//     navigate(`/modify-offer/${id}`);
//   };

//   // Show edit and delete options only for admin or brand owner
//   const canEditOrDelete = ["admin", "brandOwner", "brand"].includes(userRole); // Ensure "brand" is included in the check

//   // Before accessing imageUrls.length, ensure imageUrls is defined and is an array
//   const hasImages = Array.isArray(imageUrls) && imageUrls.length > 0;

//   // // Logic to handle the display of prices
//   // Determine if there's a valid discount price to show
//   const showDiscountPrice = discountPrice && discountPrice < originalPrice;

//   // Function to cycle images
//   const nextImage = () => {
//     setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
//   };

//   return (
//     <section
//       className="flex relative flex-col items-araound justify-center md:p-4 p-2 h-[185px] max-w-[280px] shadow-lg  md:h-[285px] border border-gray-300 bg-productBg lg:cursor-pointer"
//       onClick={handleCardClick}
//     >
//       <div className="h-[75%] flex justify-center relative" onClick={nextImage}>
//         {hasImages && (
//           <img
//             src={imageUrls[currentImageIndex]}
//             alt="Offer"
//             className="max-w-full h-full bg-cover lg:px-4  "
//           />
//         )}
//         <div className="absolute inset-0 flex justify-between items-center">
//           {imageUrls.length > 1 && ( // Only show navigation buttons if there are multiple images
//             <>
//               <button
//                 className="text-[30px] hover:text-white"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   prevImage();
//                 }}
//               >
//                 &lt;
//               </button>
//               <button
//                 className="text-[30px] hover:text-white"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   nextImage();
//                 }}
//               >
//                 &gt;
//               </button>
//             </>
//           )}
//         </div>

//         <FaHeart
//           className={`absolute  top-2 right-2 cursor-pointer ${
//             isLiked ? "fill-red-500" : "stroke-current text-gray-500"
//           }`}
//           onClick={(event) => toggleFavorite(event)}
//         />
//       </div>
//       <div>
//         <h1 className=" text-xs font-semibold mt-2">{title}</h1>
//         <div className="flex items-center justify-between  mt-2">
//           <div className="flex items-start gap-2">
//             <div className="flex items-center gap-2">
//               {/* Conditional rendering based on discount availability */}
//               {showDiscountPrice && (
//                 <>
//                   {/* Discounted price */}
//                   <div className="flex items-center">
//                     <span className="md:text-base text-xs font-semibold">
//                       {discountPrice}
//                     </span>
//                     <FaLariSign className="md:text-sm text-[10px]" />
//                   </div>
//                   {/* Original price, struck through */}
//                   <div className="flex items-center">
//                     <span className="text-xs md:text-sm font-semibold text-[12px]  text-[#FF6262] line-through ">
//                       {originalPrice}
//                     </span>
//                     <FaLariSign className="text-[10px]" color="#FF6262" />
//                   </div>
//                 </>
//               )}
//               {!showDiscountPrice && (
//                 // Only original price when no discount
//                 <div className="flex items-center">
//                   <span className="md:text-base text-xs font-semibold">
//                     {originalPrice}
//                   </span>
//                   <FaLariSign className="md:text-sm text-[10px]" />
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="flex items-center md:mt-1 mt-[2px]">
//             <IoEyeOutline className="text-base text-[#9D9D9D]" />
//             <span className="ml-1 md:text-xs text-[8px] text-[#9D9D9D]">
//               {views}
//             </span>
//           </div>
//         </div>
//       </div>
//       <ToastContainer />
//     </section>
//   );
// };

// export default OffersCard;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { FaLariSign } from "react-icons/fa6";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";
import { FaEdit, FaTrash } from "react-icons/fa"; // Adjust according to your actual import paths

const OffersCard = ({
  id,
  imageUrls = [],
  title,
  originalPrice,
  discountPrice,
  views,
  userRole,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // const { isAuthenticated, userRole } = useAuth();
  const { isAuthenticated, userRole: authUserRole } = useAuth();
  const [isModifyDeleteView, setIsModifyDeleteView] = useState(false);
  console.log("userRole", userRole);
  const navigate = useNavigate();

  // Assuming this hook provides user and authentication status

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
    // For brand or admin users, do not navigate immediately; allow for modify/delete functionality
    if (["admin", "brand", "brandOwner"].includes(userRole)) return;

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

  // const canEditOrDelete = ["admin", "brand"].includes(userRole);

  // Show edit and delete options only for admin or brand owner
  const canEditOrDelete = ["admin", "brandOwner", "brand"].includes(userRole); // Ensure "brand" is included in the check
  console.log("Can Edit or Delete", { id, canEditOrDelete });
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
      className="flex relative flex-col items-araound justify-center md:p-4 p-2 h-[185px] max-w-[280px] shadow-lg  md:h-[285px] border border-gray-300 bg-productBg lg:cursor-pointer"
      onClick={handleCardClick}
    >
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
          className={`absolute  top-2 right-2 cursor-pointer ${
            isLiked ? "fill-red-500" : "stroke-current text-gray-500"
          }`}
          onClick={(event) => toggleFavorite(event)}
        />
      </div>
      <div>
        <h1 className=" text-xs font-semibold mt-2">{title}</h1>
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
      <ToastContainer />
    </section>
  );
};

export default OffersCard;
