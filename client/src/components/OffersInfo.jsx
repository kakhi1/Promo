import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";
import { FaLariSign } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiShareForwardBoxLine } from "react-icons/ri";
import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";

const OffersInfo = () => {
  const { offerId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const [offer, setOffer] = useState(null);
  const [brand, setBrand] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isTextExpanded, setTextExpanded] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const toggleTextExpansion = () => {
    setTextExpanded(!isTextExpanded);
  };

  console.log("offer", offer);
  console.log("brand", brand);
  const toggleFavorite = () => {
    // Stop the click event from bubbling up to the parent
    // event.stopPropagation();

    if (!isAuthenticated) {
      // If the user is not authenticated, show a warning message
      toast.warn("ფავორიტებში დასამატებლად გთხოვთ გაიაროთ რეგისტრაცია");
    } else {
      setIsLiked(!isLiked); // Toggle the like state
      // Add logic to handle adding/removing from favorites in your backend or state management
    }
  };

  const handleImageClick = () => {
    setClickCount((prevCount) => prevCount + 1);
    // Here you would also send the click count to the database
    // This can be done using an API call to your backend
  };

  // Assuming you have a method to send data to your backend
  const sendClickDataToDatabase = async () => {
    const response = await fetch("/api/track-click", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ offerId: offer.id, clicks: clickCount }),
    });

    if (!response.ok) {
      console.error("Failed to send click data");
    }
  };

  useEffect(() => {
    if (clickCount > 0) {
      sendClickDataToDatabase();
    }
  }, [clickCount]);

  useEffect(() => {
    const fetchOfferAndBrand = async () => {
      setLoading(true); // Assuming you have a loading state
      setError(null); // Assuming you have an error state
      try {
        const offerUrl = `http://localhost:5000/api/offers/${offerId}`;
        const brandUrl = `http://localhost:5000/api/brands/offers/${offerId}`;

        const [offerResponse, brandResponse] = await Promise.all([
          fetch(offerUrl),
          fetch(brandUrl),
        ]);

        if (!offerResponse.ok) {
          throw new Error(
            `HTTP error! Status: ${offerResponse.status} for offer`
          );
        }
        if (!brandResponse.ok) {
          throw new Error(
            `HTTP error! Status: ${brandResponse.status} for brand`
          );
        }

        const offerData = await offerResponse.json();
        const brandData = await brandResponse.json();

        // Log to verify structures
        console.log("Offer Data:", offerData);
        console.log("Brand Data:", brandData);

        // Adjust state setting based on response structure
        setOffer(offerData.data); // This remains the same as your offer data contains a .data property

        // Adjust how you set brand data based on its structure
        if (brandData._id) {
          // or any other property that is expected to exist in your brand data
          setBrand(brandData); // Directly use brandData as it doesn't have a .data property
        } else {
          console.error("Brand data structure is not as expected:", brandData);
          // Handle unexpected structure or set an error state here
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
        // Set error state here if you have one
      } finally {
        setLoading(false); // Assuming you have a loading state
      }
    };

    fetchOfferAndBrand();
  }, [offerId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error message to the user
  }

  if (!offer || !brand) {
    return <div>Data not available</div>; // Fallback content if data is missing
  }

  // Logic to handle the display of prices
  const showDiscountPrice =
    offer.discountPrice && offer.discountPrice < offer.originalPrice;
  // Construct the full URL for the image
  const baseUrl = "http://localhost:5000/";
  const imagePath = offer.imageUrl.replace(/\\/g, "/");
  const fullImageUrl = baseUrl + imagePath;

  // Use brand's imageUrl for the background image
  const brandImageUrl = baseUrl + brand.imageUrl.replace(/\\/g, "/");
  // const brandImagePath = brand?.imageUrl
  //   ? brand.imageUrl.replace(/\\/g, "/")
  //   : "path/to/default/brandImage.png";
  // const brandImageUrl = `${baseUrl}${brandImagePath}`;

  return (
    <main className="flex md:flex-row flex-col-reverse  px-5">
      <div className="md:w-4/5 w-full">
        <section className="md:h-[10%] md:flex md:flex-row flex-col justify-between w-full items-center gap-2  ">
          <div className="md:flex  justify-start items-center gap-2 h-full  grid grid-cols-4 ">
            {/* views  */}
            <div className="flex items-center justify-end gap-1 ml-2  order-none md:order-last">
              <IoEyeOutline className="text-xs text-[#9D9D9D]" />
              <span className="text-xs  text-[#9D9D9D]">{offer.views}</span>
            </div>
            {/* title */}
            <h1 className="md:text-[24px] text-xl font-semibold flex justify-start items-center h-full col-span-3 order-first md:order-none">
              {offer.title}
            </h1>
            {/* Display prices */}
            <div className="flex items-center justify-end order-last md:order-none gap-1 col-span-2 ">
              {showDiscountPrice ? (
                <>
                  <div className="flex items-center ml-4  ">
                    <span className="text-xl font-semibold">
                      {offer.discountPrice}
                    </span>
                    <FaLariSign className="text-lg mb-1" />
                  </div>
                  <div className="flex items-center ">
                    <span className="text-lg font-medium text-[#FF6262] line-through">
                      {offer.originalPrice}
                    </span>
                    <FaLariSign className="text-[12px]" color="#FF6262" />
                  </div>
                </>
              ) : (
                <div className="flex items-center ">
                  <span className="text-lg font-semibold">
                    {offer.originalPrice}
                  </span>
                  <FaLariSign className="text-lg mb-1" />
                </div>
              )}
            </div>
            {/* brand logo */}
            <div className="h-[50px] w-[100px] bg-yellow-300 col-span-2 rounded-lg md:order-first order-none">
              {/* <img src={brandImageUrl} alt={offer.title} /> */}
            </div>
          </div>
          {/* share and favorites */}
          <div className="md:flex gap-2 mb-2 hidden  ">
            <RiShareForwardBoxLine
              size={22}
              color="#6D9FBB"
              className="lg:cursor-pointer"
            />
            <FaHeart
              className={`top-2 right-2 cursor-pointer ${
                isLiked ? "fill-red-500" : "stroke-current text-gray-500"
              }`}
              onClick={() => toggleFavorite()}
              size={22}
            />
          </div>
        </section>
        {/* main section  */}
        <section className="md:h-[50%] flex flex-col items-center  mt-4  ">
          <div className="flex gap-2 mb-2 absolute md:hidden ">
            <RiShareForwardBoxLine
              size={22}
              color="#6D9FBB"
              className="lg:cursor-pointer"
            />
            <FaHeart
              className={`top-2 right-2 cursor-pointer ${
                isLiked ? "fill-red-500" : "stroke-current text-gray-500"
              }`}
              onClick={() => toggleFavorite()}
              size={22}
            />
          </div>
          {/* offer iamage */}
          <div className="w-full h-full flex md:flex-row flex-col gap-6 ">
            <div className="h-[300px] md:w-[300px] relative">
              <img
                src={fullImageUrl}
                alt={offer.title}
                className="h-[300px] md:w-[300px]"
              />
              <div className="flex gap-2 mb-2 absolute  right-5 ">
                <RiShareForwardBoxLine
                  size={22}
                  color="#6D9FBB"
                  className="lg:cursor-pointer"
                />
                <FaHeart
                  className={`top-2 right-2 cursor-pointer ${
                    isLiked ? "fill-red-500" : "stroke-current text-gray-500"
                  }`}
                  onClick={() => toggleFavorite()}
                  size={22}
                />
              </div>
            </div>

            {/* Display the offer's description. If isTextExpanded is false, show a truncated version */}
            <p className="whitespace-pre-line text-left mt-10">
              {isTextExpanded
                ? offer.description
                : `${offer.description.substring(0, 100)}...`}
            </p>
          </div>
          <div className="flex w-full md:flex-row flex-col gap-6 items-start">
            <button
              onClick={handleImageClick}
              className="lg:w-[300px] w-[300px] md:w-[200px] h-[40px] flex order-last md:order-none rounded-sm  items-center justify-center text-white text-xl bg-[#5E5FB2] lg:hover:bg-Bgcolor"
            >
              შეიძინე
            </button>{" "}
            <div className=" flex  items-center  md:justify-center justify-end lg:w-[300px] w-[300px] md:w-[200px]  h-[40px] gap-2">
              {/* Button to toggle text expansion */}
              <button
                onClick={toggleTextExpansion}
                className=" justify-center  text-[#5E5FB2] md:text-base text-sm font-normal rounded-sm flex items-center gap-2 lg:w-[300px] md:w-[200px]  w-[90px] h-[40px] bg-productBg  "
              >
                {isTextExpanded ? (
                  <>
                    ნაკლები{" "}
                    <IoChevronUpOutline color="#5E5FB2" className="mb-1" />
                  </>
                ) : (
                  <>
                    მეტი{" "}
                    <IoChevronDownOutline color="#5E5FB2" className="mb-1" />
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
        <ToastContainer />
        <section className=" h-[40%]"></section>
      </div>
      {/* Ad Section - On top for mobile */}
      <div className="w-full bg-gray-300 h-56 mb-4 md:mb-0 md:w-1/5 md:h-screen md:ml-4">
        <div className="p-4">Ad Content Here</div>
      </div>
    </main>
  );
};
export default OffersInfo;
