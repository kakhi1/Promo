import { useEffect, useState } from "react";
import React from "react";
import ReactDOM from "react-dom";
import { RxPencil1 } from "react-icons/rx";
import { FaRegTrashCan } from "react-icons/fa6";

const OfferModal = ({ offer, onClose, onModify, onDelete, position }) => {
  // Then use safePosition for styling
  const [modalStyle, setModalStyle] = useState({
    position: "absolute",
    top: `${position.top}px`,
    left: `${position.left}px`,
    transform: "translate(-50%, -50%)",
  });

  useEffect(() => {
    const updateStyleBasedOnWidth = () => {
      const newStyle = { ...modalStyle };

      if (window.innerWidth >= 1024) {
        // Assuming 'lg' breakpoint is 1024px
        newStyle.transform = "translate(-50%, -50%)";
      } else {
        newStyle.transform = "translate(-50%, -50%)";
      }

      setModalStyle(newStyle);
    };

    window.addEventListener("resize", updateStyleBasedOnWidth);
    updateStyleBasedOnWidth(); // Call it initially to set the correct style

    return () => window.removeEventListener("resize", updateStyleBasedOnWidth);
  }, []);

  return (
    <div
      className="absolute inset-0 z-50 overflow-auto bg-[#1E1F53] opacity-95 modalClass w-[241px] items-center justify-center lg:max-w-[280px] md:h-[285px] h-[200px]"
      style={modalStyle}
    >
      <div className="relative flex-col flex items-center justify-end md:h-[285px] h-[200px] rounded-lg">
        <div className="md:mt-20 mt-10 w-full h-full  ">
          <div className="w-full flex flex-row">
            <button
              className=" px-5 py-2 bg-[#A8EB80] text-white lg:hover:bg-green-400 flex flex-col items-center w-[50%] h-1/3"
              onClick={onModify}
            >
              <RxPencil1 size={30} />
              ჩასწორება
            </button>
            <button
              className="px-5 py-2 bg-red-500 text-white  lg:hover:bg-red-700 flex flex-col items-center w-[50%] h-1/3"
              onClick={onDelete}
            >
              <FaRegTrashCan size={30} />
              წაშლა
            </button>
          </div>

          <button
            className="px-5 py-2 bg-gray-300 text-black  hover:bg-gray-400 flex  w-full items-center justify-center"
            onClick={onClose}
          >
            გაუქმება
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferModal;
