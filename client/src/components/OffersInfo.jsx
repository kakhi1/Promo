import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";
import { FaLariSign } from "react-icons/fa6";

const OffersInfo = () => {
  const { offerId } = useParams();
  const [offer, setOffer] = useState(null);
  console.log(offerId);

  useEffect(() => {
    // Fetch the offer information from your API
    const fetchOffer = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/offers/${offerId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setOffer(data.data); // Adjust based on the actual structure of your response
      } catch (error) {
        console.error("Failed to fetch offer", error);
      }
    };

    fetchOffer();
  }, [offerId]);

  if (!offer) {
    return <div>Loading...</div>;
  }
  // Logic to handle the display of prices
  const showDiscountPrice =
    offer.discountPrice && offer.discountPrice < offer.originalPrice;
  // Construct the full URL for the image
  const baseUrl = "http://localhost:5000/";
  const imagePath = offer.imageUrl.replace(/\\/g, "/");
  const fullImageUrl = baseUrl + imagePath;

  return (
    <main className="flex md:flex-row flex-col-reverse justify-center px-5">
      <div>
        <section className="h-[10%]"></section>
        <section className="h-[10%] flex justify-around">
          <h1 className="md:text-2xl text-xl font-semibold mt-2">
            {offer.title}
          </h1>
          {/* Display prices */}
          {showDiscountPrice ? (
            <>
              <div className="flex items-center">
                <span className="text-[12px] font-medium text-[#FF6262] line-through">
                  {offer.originalPrice}
                </span>
                <FaLariSign className="text-[10px]" color="#FF6262" />
              </div>
              <div className="flex items-center">
                <span className="text-base font-semibold">
                  {offer.discountPrice}
                </span>
                <FaLariSign className="text-sm" />
              </div>
            </>
          ) : (
            <div className="flex items-center">
              <span className="text-base font-semibold">
                {offer.originalPrice}
              </span>
              <FaLariSign className="text-sm" />
            </div>
          )}

          <p> {offer.views}</p>
        </section>
        <section className="bg-yellow-200 h-[40%] flex justify-center items-center">
          <div>
            {" "}
            <img
              src={fullImageUrl}
              alt={offer.title}
              className="max-h-full max-w-full"
            />
          </div>
          <div>
            {" "}
            <p> {offer.description}</p>
          </div>
        </section>
        <section className="bg-blue-200 h-[40%]"></section>
      </div>
      {/* Ad Section - On top for mobile */}
      <div className="w-full bg-gray-300 h-56 mb-4 md:mb-0 md:w-1/5 md:h-screen md:ml-4">
        <div className="p-4">Ad Content Here</div>
      </div>
    </main>
  );
};
export default OffersInfo;
