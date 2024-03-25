import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";
import { FaLariSign } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { RiShareForwardBoxLine } from "react-icons/ri";
import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";
import BrandCard from "./BrandCard";
import OffersCard from "./OffersCard";
import { FaCopy } from "react-icons/fa";
import AdComponent from "./AdComponent";

const OffersInfo = () => {
  const { offerId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const [offer, setOffer] = useState(null);
  const [brand, setBrand] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isTextExpanded, setTextExpanded] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const shareOptionsRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [suggestedOffers, setSuggestedOffers] = useState([]);
  const [isFetchingOffers, setIsFetchingOffers] = useState(false);
  const [fetchOffersError, setFetchOffersError] = useState(null);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [displayedOffers, setDisplayedOffers] = useState([]);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [brands, setBrands] = useState([]);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const { isAuthenticated, userRole } = useAuth();
  console.log(offerId);
  const { user } = useAuth();
  const token = user?.token;
  const userId = user?.id || user?._id;
  useEffect(() => {
    console.log("Token updated in Offersინფო:", token);
  }, [token]);
  const isMobile = window.innerWidth < 768;

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

  const incrementVisitCount = async (offerId) => {
    if (!offerId) {
      console.error("offerId is undefined or not provided");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/offers/visit/${offerId}`
      );
    } catch (error) {
      console.error("Failed to increment visit:", error);
    }
  };

  const handleBuyClick = () => {
    // Check if the offer object has a url property
    if (offer && offer.url) {
      incrementVisitCount(offerId);
      // Open the offer's url in a new tab
      window.open(offer.url, "_blank");
    } else {
      // Optionally handle the case where the URL is not available
      console.error("No URL available for this offer.");
      // You could display a message to the user here if needed
    }
  };
  const recordShare = async () => {
    if (!isAuthenticated) {
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/offers/${offerId}/share`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Optionally, update your UI or state to reflect the share
    } catch (error) {
      console.error("Failed to record share:", error);
      // Handle error (e.g., display an error message)
    }
  };
  const facebookShare = (event) => {
    event.stopPropagation();
    if (!isAuthenticated) {
      toast.warn("გთხოვთ გაიაროთ რეგისტრაცია.");
      return;
    }
    const shareUrl = encodeURIComponent(window.location.href);
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
    console.log(`Opening Facebook share URL: ${facebookShareUrl}`);
    window.open(facebookShareUrl, "_blank");
    recordShare();
    // setShowShareOptions(false); // Hide options after sharing
  };

  const copyLinkToClipboard = (event) => {
    event.stopPropagation();
    console.log("Copying link to clipboard");
    if (!isAuthenticated) {
      toast.warn("Please log in to copy the link.");
      return;
    }
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(
      () => {
        toast.success("Link copied to clipboard!");
      },
      () => {
        toast.error("Failed to copy link.");
      }
    );
    // setShowShareOptions(false); // Hide options after copying
  };

  // favorites check add remove logic

  useEffect(() => {
    const fetchOfferDetails = async () => {
      try {
        // Fetch offer details
        const offerResponse = await axios.get(
          `http://localhost:5000/api/offers/${offerId}`
        );
        setOffer(offerResponse.data);
        // Check if the offer is in the user's favorites if authenticated
        if (!isAuthenticated || userRole !== "user") {
          return;
        }
      } catch (error) {
        console.error("Error fetching offer details:", error);
        toast.error("Failed to load offer details.");
      }
    };

    fetchOfferDetails();
  }, [offerId, userId, isAuthenticated, token]);

  useEffect(() => {
    // Only proceed if the user is authenticated and has the 'user' role
    if (isAuthenticated && userRole === "user") {
      const checkFavoriteStatus = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/users/${userId}/favorites/${offerId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setIsLiked(response.data.isInFavorites);
        } catch (error) {
          console.error("Failed to check favorite status:", error);
        }
      };

      checkFavoriteStatus();
    }
  }, [offerId, userId, isAuthenticated, userRole, token]);

  const toggleFavorite = async (event) => {
    event.stopPropagation();

    if (!isAuthenticated || userRole !== "user") {
      toast.warn("მხოლოდ მომხმარებელს შეუძლია ფავორიტებში დამატება");
      return;
    }

    const url = `http://localhost:5000/api/users/${userId}/favorites/${offerId}`; // Ensure the offerId is used here
    const method = isLiked ? "delete" : "post";

    try {
      const response = await axios({
        method: method,
        url: url,
        headers: { Authorization: `Bearer ${token}` },
        data: {}, // For POST, you might need to send data. If not, this can be an empty object.
      });

      setIsLiked(!isLiked);
      toast.success(`პროდუქცია ${isLiked ? "წაიშალა" : "დაემატა"} ფავორიტებში`);
      // Optionally, refresh the favorites status or the component to reflect the change
    } catch (error) {
      console.error("Failed to update favorites:", error);
      toast.error("Failed to update favorites. Make sure you're logged in.");
    }
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
  useEffect(() => {
    // Assuming you set brand data correctly and brandData contains _id
    if (brand && brand._id) {
      fetchBrands(brand._id); // Pass brand._id to fetchBrands function
    }
  }, [brand]);

  // fetch suggested offers and brands
  useEffect(() => {
    fetchBrands;
    fetchOffers();
  }, [offerId]);
  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const fetchBrands = async (brandId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/brands/${brandId}/suggestions`
      );
      const data = await response.json();
      setBrands(data.data);

      if (!response.ok)
        throw new Error(data.message || "Failed to fetch brands.");
      setBrands(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    }
  };

  const onFavoriteToggle = async () => {
    fetchOffers();

    // Additionally fetch favorites if needed
  };
  const handleShowAllProducts = () => {
    setShowAllProducts(!showAllProducts);
  };
  const handleShowAllbrands = () => {
    setShowAllBrands(!showAllBrands);
  };

  useEffect(() => {
    // Assuming `suggestedOffers` is already populated with the fetched offers
    const sliceAmount = viewportWidth < 768 ? 2 : 4; // Display 2 offers for mobile, 4 for larger screens
    setDisplayedOffers(suggestedOffers.slice(0, sliceAmount));
  }, [suggestedOffers, viewportWidth]);
  const fetchOffers = async () => {
    setIsFetchingOffers(true);
    setFetchOffersError(null);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/offers/suggestions/${offerId}`
      );
      setSuggestedOffers(response.data); // Assuming the API returns an array of offers directly
      setIsFetchingOffers(false);
    } catch (error) {
      console.error("Failed to fetch suggested offers:", error);
      setFetchOffersError(error.message || "Failed to fetch data");
      setIsFetchingOffers(false);
    }
  };

  /////////////////////////////////

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

  // Inline style for controlling max-height
  const descriptionStyle = {
    maxHeight: isTextExpanded ? "100vh" : "20rem", // '20rem' as a starting point, adjust as needed
  };

  return (
    <main className="flex md:flex-row flex-col-reverse  px-5">
      <div className="md:w-4/5 w-full gap-2">
        <section className=" md:flex md:flex-row flex-col justify-between w-full items-center gap-2  ">
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
            {/* <div className="flex items-center justify-end order-last md:order-none gap-1 col-span-2 ">
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
            </div> */}
            {/* brand logo */}
            <div className="h-[50px] w-[100px] col-span-2 rounded-lg md:order-first order-none">
              <img src={brandImageUrl} alt={offer.title} />
            </div>
          </div>
          {/* share and favorites */}
          <div className="md:flex gap-2 mb-2 hidden ">
            <div className="flex gap-1">
              <FaCopy
                onClick={copyLinkToClipboard}
                size={22}
                color="#6D9FBB"
                className="lg:cursor-pointer"
              />
              <RiShareForwardBoxLine
                onClick={facebookShare}
                size={22}
                color="#6D9FBB"
                className="lg:cursor-pointer"
              />
            </div>
            <FaHeart
              className={`top-2 right-2 lg:cursor-pointer text-[25px] ${
                isLiked ? "fill-red-500" : "stroke-current text-gray-500"
              }`}
              onClick={(event) => toggleFavorite(event)}
            />
          </div>
        </section>
        {/* main section  */}
        <section className="flex flex-col items-center  mt-4  ">
          {/* offer image */}
          <div className="w-full h-full flex md:flex-row flex-col gap-6 ">
            <div className=" relative flex items-center justify-center md:w-[35%] w-full">
              {offer.imageUrls && offer.imageUrls.length > 0 && (
                <img
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
                <div className="flex gap-1">
                  <FaCopy
                    onClick={copyLinkToClipboard}
                    size={22}
                    color="#6D9FBB"
                    className="lg:cursor-pointer"
                  />
                  <RiShareForwardBoxLine
                    onClick={facebookShare}
                    size={22}
                    color="#6D9FBB"
                    className="lg:cursor-pointer"
                  />
                </div>
                <FaHeart
                  className={`top-2 right-2 cursor-pointer ${
                    isLiked ? "fill-red-500" : "stroke-current text-gray-500"
                  }`}
                  onClick={(event) => toggleFavorite(event)}
                  size={22}
                />
              </div>{" "}
            </div>

            {/* Display the offer's description. If isTextExpanded is false, show a truncated version */}
            <div
              className={`mt-4 overflow-x-auto w-[65%] ${
                isTextExpanded ? "whitespace-nowrap" : "whitespace-normal"
              }`}
            >
              <p className="whitespace-pre-line text-left mt-10">
                {isTextExpanded
                  ? offer.description
                  : `${offer.description.substring(0, 100)}...`}
              </p>
            </div>
          </div>
          <div className="flex w-full md:flex-row flex-col-reverse gap-6 items-start">
            <div className="flex items-center   md:w-[35%] ">
              {" "}
              <button
                onClick={handleBuyClick}
                className="lg:w-[300px] w-[300px] md:w-[200px] h-[40px] flex order-last md:order-none rounded-sm  items-center justify-center text-white text-xl bg-[#5E5FB2] lg:hover:bg-Bgcolor"
              >
                შეიძინე
              </button>{" "}
            </div>
            <div className=" flex  items-center  md:justify-center justify-end lg:w-[300px] w-[300px] md:w-[200px]  h-[40px] gap-2">
              <button
                onClick={() => setTextExpanded(!isTextExpanded)}
                className="justify-center  text-[#5E5FB2] md:text-base text-sm font-normal rounded-sm flex items-center gap-2 lg:w-[300px] md:w-[200px]  w-[90px] h-[40px] bg-productBg transition duration-300 ease-in-out  focus:outline-none"
              >
                {isTextExpanded ? (
                  <>
                    ნაკლები <IoChevronUpOutline className="mb-1" />
                  </>
                ) : (
                  <>
                    მეტი <IoChevronDownOutline className="mb-1" />
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
        {/* suggest section */}
        <section className="">
          {/* Products Grid */}
          <div className="flex justify-between items-center pb-4 pt-6 ">
            <h2 className="text-lg font-semibold">მსგავსი შეთავაზებები</h2>
            <button
              onClick={handleShowAllProducts}
              className="text-indigo-600 hover:text-indigo-800"
            >
              {showAllProducts ? "ნაკლები" : "ყველა"}
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 xl2:grid-cols-6 gap-4 mb-8 ">
            {isFetchingOffers ? (
              <div>Loading suggested offers...</div>
            ) : fetchOffersError ? (
              <div>Error fetching offers: {fetchOffersError}</div>
            ) : (
              displayedOffers.map((offer) => (
                <OffersCard
                  key={offer._id}
                  id={offer._id}
                  imageUrls={offer.imageUrls.map(
                    (path) => `${baseUrl}${path.replace(/\\/g, "/")}`
                  )}
                  title={offer.title}
                  originalPrice={offer.originalPrice}
                  discountPrice={offer.discountPrice}
                  views={offer.views}
                  userRole={user?.role}
                  onFavoriteToggle={onFavoriteToggle}
                />
              ))
            )}
          </div>
          <div className="flex justify-between items-center py-4">
            <h2 className="text-lg font-semibold">მსგავსი ბრენდები</h2>
            <button
              onClick={handleShowAllbrands}
              className="text-indigo-600 hover:text-indigo-800"
            >
              {showAllBrands ? "ნაკლები" : "ყველა"}
            </button>
          </div>

          {/* Brands Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(showAllBrands
              ? brands
              : isMobile
              ? brands.slice(0, 4)
              : brands.slice(0, 8)
            ).map((brand) => {
              const baseUrl = "http://localhost:5000/";
              const imagePath = brand.imageUrl.replace(/\\/g, "/"); // Replace backslashes with forward slashes if needed
              const fullImageUrl = baseUrl + imagePath;

              return (
                <BrandCard
                  key={brand._id}
                  id={brand._id}
                  name={brand.name}
                  imageUrl={fullImageUrl} // Adjust as necessary for the path
                  offerCount={brand.offers.length} // Make sure your API provides this
                />
              );
            })}
          </div>
        </section>
      </div>

      {/* add section */}
      <div className="w-full bg-gray-300 h-56 mb-4 md:mb-0 md:w-1/5 md:h-screen md:ml-4">
        <div className="p-4">
          <AdComponent pageType="userarea" />
        </div>
      </div>
    </main>
  );
};
export default OffersInfo;
