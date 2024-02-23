import React from "react";

const BrandCard = ({ name, imageUrl }) => {
  return (
    <div className="brand-card bg-[#F1F1F1] shadow-lg  overflow-hidden ">
      <img
        src={imageUrl}
        alt={name}
        className="w-full h-32 sm:h-48 object-cover"
      />
      <div className="p-4 items-end justify-center w-full">
        <h3 className="text-lg font-semibold ">{name}</h3>
      </div>
    </div>
  );
};

export default BrandCard;
