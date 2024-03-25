import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { RxPencil1 } from "react-icons/rx";
import { FaRegTrashCan } from "react-icons/fa6";

const BrandCard = ({ id, name, imageUrl, offerCount, onDelete, onModify }) => {
  const navigate = useNavigate();
  const { userRole } = useAuth();

  const [showActions, setShowActions] = useState(false);

  const handleDivClick = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    // For admin users, toggle action visibility. For others, navigate.
    if (userRole === "admin") {
      setShowActions(!showActions);
    } else {
      navigate(`/brand-card/${id}`);
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

  return (
    <div
      onClick={handleDivClick}
      className="brand-card bg-[#F1F1F1] shadow-lg overflow-hidden max-w-[280px] max-h-[164px] relative cursor-pointer "
    >
      <img
        src={imageUrl}
        alt={name}
        className="max-w-[280px] max-h-[164px] object-cover opacity-70"
      />
      <div className="p-4 items-end justify-center w-full absolute bottom-0">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm font-normal">{offerCount} შეთავაზება</p>
      </div>
      {userRole === "admin" && showActions && (
        <div className="absolute -top-0 left-0 shadow-lg overflow-hidden w-full h-full cursor-pointer bg-[#1E1F53] opacity-95  flex flex-col justify-center items-center ">
          <div className="w-full h-full flex ">
            {" "}
            <button
              onClick={(e) => handleActionClick(e, "modify")}
              className="bg-[#A8EB80] text-white lg:hover:bg-green-400 flex  w-[50%] flex-col p-6   items-center justify-center "
            >
              <RxPencil1 size={20} className="" />
              ჩასწორება
            </button>
            <button
              onClick={(e) => handleActionClick(e, "delete")}
              className="bg-red-500 text-white p-6  lg:hover:bg-red-700 w-[50%] flex flex-col items-center justify-center "
            >
              <FaRegTrashCan size={20} className="" />
              წაშლა
            </button>
          </div>

          <button
            onClick={() => setShowActions(false)}
            className="px-5 py-2 bg-gray-300 text-black  hover:bg-gray-400 flex  w-full items-center justify-center"
          >
            გაუქმება
          </button>
        </div>
      )}
    </div>
  );
};

export default BrandCard;
