import React, { useEffect, useState, useRef } from "react";
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
  const [showShareOptions, setShowShareOptions] = useState(false);
  const shareOptionsRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Function to navigate to the next image
  const nextImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % offer.imageUrls.length
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + offer.imageUrls.length) % offer.imageUrls.length
    );
  };
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

  const facebookShare = () => {
    if (!isAuthenticated) {
      toast.warn("გაზიარებისთვის გთხოვთ გაიაროთ რეგისტრაცია");
      return;
    }
    const shareUrl = encodeURIComponent(window.location.href);
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
    window.open(facebookShareUrl, "_blank");
    setShowShareOptions(false); // Hide options after sharing
  };

  const copyLinkToClipboard = () => {
    if (!isAuthenticated) {
      toast.warn("გაზიარებისთვის გთხოვთ გაიაროთ რეგისტრაცია");
      return;
    }
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(
      () => {
        toast.success("Link copied to clipboard. Share it on Instagram!");
      },
      () => {
        toast.error("Failed to copy link.");
      }
    );
    setShowShareOptions(false); // Hide options after copying
  };

  useEffect(() => {
    // Function to hide share options if clicked outside
    const handleClickOutside = (event) => {
      if (
        shareOptionsRef.current &&
        !shareOptionsRef.current.contains(event.target)
      ) {
        setShowShareOptions(false);
      }
    };
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
    // Add and remove the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
  // const imagePath = offer.imageUrl.replace(/\\/g, "/");
  // const fullImageUrl = baseUrl + imagePath;
  if (!offer || !offer.imageUrls || offer.imageUrls.length === 0) {
    // Handle the case where there's no image URLs available
    return <div>No image available</div>;
  }

  // Now it's safe to access offer.imageUrls
  const imageUrl = offer.imageUrls[currentImageIndex];
  const fullImageUrl = `${baseUrl}${imageUrl.replace(/\\/g, "/")}`;

  const imagePath = brand.imageUrl.replace(/\\/g, "/"); // Replace backslashes with forward slashes if needed
  const brandImageUrl = baseUrl + imagePath;

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
            <div className="h-[50px] w-[100px] col-span-2 rounded-lg md:order-first order-none">
              <img src={brandImageUrl} alt={offer.title} />
            </div>
          </div>
          {/* share and favorites */}
          <div className="md:flex gap-2 mb-2 hidden ">
            <div>
              {" "}
              <RiShareForwardBoxLine
                onClick={() => setShowShareOptions(!showShareOptions)}
                size={22}
                color="#6D9FBB"
                className="lg:cursor-pointer "
              />{" "}
              {showShareOptions && (
                <div
                  className="absolute z-10 w-40 bg-white shadow-md rounded-lg overflow-hidden mt-2 p-4 flex flex-col items-center gap-4"
                  ref={shareOptionsRef}
                >
                  {" "}
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={facebookShare}
                  >
                    Facebook Icon
                  </button>
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={copyLinkToClipboard}
                  >
                    Instagram Icon
                  </button>
                </div>
              )}
            </div>
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
          {/* offer image */}
          <div className="w-full h-full flex md:flex-row flex-col gap-6 ">
            <div className=" relative flex items-center justify-center md:w-[35%] w-full">
              {offer.imageUrls && offer.imageUrls.length > 0 && (
                <img
                  // src={`${baseUrl}${offer.imageUrls[currentImageIndex].replace(
                  //   /\\/g,
                  //   "/"
                  // )}`}
                  src={fullImageUrl}
                  alt={offer.title}
                  className=" h-[300px] bg-cover"
                />
              )}
              <div className="absolute inset-0 flex justify-between items-center">
                <button className="text-[30px]" onClick={prevImage}>
                  &lt;
                </button>
                <button className="text-[30px]" onClick={nextImage}>
                  &gt;
                </button>
              </div>
              <div className="flex gap-2 mb-2 absolute md:hidden right-5 -bottom-7 ">
                <div>
                  {" "}
                  <RiShareForwardBoxLine
                    onClick={() => setShowShareOptions(!showShareOptions)}
                    size={22}
                    color="#6D9FBB"
                    className="lg:cursor-pointer "
                  />{" "}
                  {showShareOptions && (
                    <div
                      className="absolute z-10 w-40 bg-white shadow-md rounded-lg overflow-hidden mt-2 p-4 flex flex-col right-0 items-center gap-4"
                      ref={shareOptionsRef}
                    >
                      {" "}
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={facebookShare}
                      >
                        Facebook Icon
                      </button>
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={copyLinkToClipboard}
                      >
                        Instagram Icon
                      </button>
                    </div>
                  )}
                </div>
                <FaHeart
                  className={`top-2 right-2 cursor-pointer ${
                    isLiked ? "fill-red-500" : "stroke-current text-gray-500"
                  }`}
                  onClick={() => toggleFavorite()}
                  size={22}
                />
              </div>{" "}
            </div>

            {/* Display the offer's description. If isTextExpanded is false, show a truncated version */}
            <p className="whitespace-pre-line text-left mt-10">
              {isTextExpanded
                ? offer.description
                : `${offer.description.substring(0, 100)}...`}
            </p>
          </div>
          <div className="flex w-full md:flex-row flex-col-reverse gap-6 items-start">
            <div className="flex items-center   md:w-[35%] ">
              {" "}
              <button className="lg:w-[300px] w-[300px] md:w-[200px] h-[40px] flex order-last md:order-none rounded-sm  items-center justify-center text-white text-xl bg-[#5E5FB2] lg:hover:bg-Bgcolor">
                შეიძინე
              </button>{" "}
            </div>
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
