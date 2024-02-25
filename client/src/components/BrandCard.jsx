import React from "react";
import { useNavigate } from "react-router-dom";

const BrandCard = ({ id, name, imageUrl, offerCount }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/brand-card/${id}`);
  };

  return (
    <div
      onClick={handleNavigate}
      className="brand-card bg-[#F1F1F1] shadow-lg  overflow-hidden "
    >
      <img
        src={imageUrl}
        alt={name}
        className="w-full h-32 sm:h-48 object-cover"
      />
      <div className="p-4 items-end justify-center w-full">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm font-normal">{offerCount} შეთავაზება</p>
      </div>
    </div>
  );
};
export default BrandCard;
