import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BrandCard from "./BrandCard";
import { FaPlus } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import OffersCard from "./OffersCard";
import OfferModal from "./OfferModal";
import { RxPencil1 } from "react-icons/rx";
import { FaRegTrashCan } from "react-icons/fa6";
import { useParams } from "react-router-dom";

const Admin = () => {
  // Simulated arrays for brands, offers, and ads, leaving space for the "Add" button

  const [offers, setOffers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [showAllOffers, setShowAllOffers] = useState(false);
  const [showAllAds, setShowAllAds] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [brandDetails, setBrandDetails] = useState(null);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 5, left: 0 });
  const [selectedAdId, setSelectedAdId] = useState(null);
  const [showActionButtons, setShowActionButtons] = useState(false);
  const [totalFavorites, setTotalFavorites] = useState(0);
  const [ads, setAds] = useState([]);

  const { userRole } = useAuth();
  // statistic
  const [metrics, setMetrics] = useState({
    totalViews: 0,
    totalShares: 0,
    totalVisits: 0,
    totalLoginCount: 0,
    totalUsers: 0,
    lastLogin: "",
    estimatedTotalTimeSpent: 0,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/offers/metrics"
        ); // Replace '/your-endpoint-here' with your actual endpoint
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setMetrics(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/userActivityStats")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Update your state with the new data
          setMetrics((prevMetrics) => ({
            ...prevMetrics, // Keep existing metrics
            totalLoginCount: data.data.totalLoginCount,
            totalUsers: data.data.totalUsers,
            lastLogin: new Date(data.data.lastLogin).toLocaleString(),
            estimatedTotalTimeSpent:
              data.data.estimatedTotalTimeSpent / (1000 * 60 * 60), // Convert from milliseconds to hours
          }));
        }
      })
      .catch((error) => {
        console.error("Error fetching user activity stats:", error);
      });
  }, []);
  useEffect(() => {
    const fetchFavoritesCount = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "http://localhost:5000/api/users/favorites/count"
        ); // Adjust the URL as necessary
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);
        setTotalFavorites(data.totalFavorites);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritesCount();
  }, []);

  // Fetch your brands similar to previous examples

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  // Assuming `brands` is your state variable containing an array of brand objects
  const sortedBrands = brands.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // State variables to control the visibility

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/ads/ads");
        setAds(response.data);
      } catch (error) {
        console.error("Failed to fetch ads:", error);
        setError("Failed to fetch ads: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  const handleModifyAd = (id) => {
    navigate(`/modify-ad/${id}`);
  };
  const handleDeleteAd = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/ads/ads/${id}`);
      // Optionally, refresh the list of ads or manage state to remove the deleted ad
      setAds(ads.filter((ad) => ad._id !== id));
      setShowActionButtons(false); // Hide buttons after deletion
    } catch (error) {
      console.error("Failed to delete ad:", error);
    }
  };

  const handleCancel = (e) => {
    e.stopPropagation(); // Stop event from propagating to parent elements
    setShowActionButtons(false);
  };

  const handleDeleteBrand = async (brandId) => {
    try {
      // Send a DELETE request to your backend
      const response = await axios.delete(
        `http://localhost:5000/api/brands/${brandId}`
      );
      if (response.status === 200 || response.status === 204) {
        // If deletion is successful, update the 'brands' state to remove the brand
        const updatedBrands = brands.filter((brand) => brand._id !== brandId);
        setBrands(updatedBrands); // Update the state with the filtered brands
      } else {
        // If the server response indicates failure, handle accordingly
        console.error("Failed to delete the brand", response.data);
      }
    } catch (error) {
      console.error("Failed to delete brand:", error);
    }
  };
  // brand modify logic

  const handleModifyBrand = (brandId) => {
    navigate(`/modify-brand/${brandId}`);
  };

  ////////////////////////////////////////////////////////////

  const handleClickOffer = (e, offer) => {
    e.stopPropagation(); // Prevent event bubbling

    const rect = e.currentTarget.getBoundingClientRect();
    const modalStyle = {
      top: rect.top + window.scrollY + rect.height / 2, // Center modal vertically
      left: rect.left + window.scrollX + rect.width / 2, // Center modal horizontally
      width: rect.width, // Capture width of the clicked div
      height: rect.height, // Capture height of the clicked div
    };

    setSelectedOffer(offer);
    setModalPosition(modalStyle); // Now includes width and height
    setIsModalOpen(true);
  };

  const navigate = useNavigate();
  const imageBaseUrl = "http://localhost:5000/";

  useEffect(() => {
    const fetchAllOffers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/offers/all"
        );
        const offersData = response.data.data;

        // Check if offersData is an array before attempting to sort
        if (Array.isArray(offersData)) {
          const sortedOffers = offersData.sort((a, b) => {
            // Prioritize 'pending' status
            if (a.status === "pending" && b.status !== "pending") return -1;
            if (b.status === "pending" && a.status !== "pending") return 1;
            // Then sort by createdAt date
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
          setOffers(sortedOffers);
        } else {
          throw new Error("Data is not an array");
        }
      } catch (error) {
        console.error("Failed to fetch or process offers:", error.message);
        setError("Failed to fetch or process offers: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllOffers();
  }, []);

  const handleModify = () => {
    navigate(`/modifyoffer/${selectedOffer._id}`);
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    try {
      // Assuming 'selectedOffer' contains the ID of the offer you want to delete
      const response = await axios.delete(
        `http://localhost:5000/api/offers/${selectedOffer._id}`
      );
      if (response.status === 200 || response.status === 204) {
        // Filter out the deleted offer from the 'offers' array
        const updatedOffers = offers.filter(
          (offer) => offer._id !== selectedOffer._id
        );
        setOffers(updatedOffers); // Update the state to reflect the deletion
        setIsModalOpen(false); // Close the modal if it's open
      } else {
        // Handle any unsuccessful deletion here
        console.error("Failed to delete the offer", response.data);
      }
    } catch (error) {
      console.error("Failed to delete offer:", error);
    }
  };
  const baseUrl = "http://localhost:5000/";
  const navigateToAddOffers = () => {
    navigate("/adoffers");
  };

  // Safe guard to ensure brandDetails is not null before accessing offers

  // Optionally, control the display of offers based on `showAllBrands`
  const displayedOffers = showAllBrands ? offers : offers.slice(0, 4);

  const navigateToAdd = (section) => {
    navigate(`/${section}`);
    // Simulate navigation, in a real app you would use routing (e.g., React Router's useHistory or useNavigate)
    // e.g., history.push(`/add-${section}`);
    console.log(`Navigating to add ${section}`);
  };
  const navigateToAddAd = () => {
    navigate("/adadd"); // Adjust the route as necessary to match your routing setup
  };
  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/brands");
        const data = await response.json();
        if (data.success) {
          setBrands(data.data); // Assuming your API returns an array of brands in data.data
        } else {
          throw new Error("Failed to fetch brands");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return (
    <div className="pt-8 bg-white flex relative w-ful md:flex-row flex-col">
      <div className="flex md:flex-row flex-col w-full justify-center px-5">
        <div className="md:flex-grow ">
          {/* Brands Section */}
          <section>
            <div className="flex justify-between items-center py-4">
              <h2 className="text-lg font-semibold ">არსებული ბრენდები</h2>
              <button
                onClick={toggleShowAll}
                className="mt-4 text-indigo-600 hover:text-indigo-800"
              >
                {showAll ? "ნაკლები" : "ყველა"}
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 xl:grid-cols-6 md:gap-3">
              {(showAll
                ? brands
                : isMobile
                ? brands.slice(0, 4)
                : brands.slice(0, 8)
              ).map((brand) => (
                <div key={brand._id} className="cursor-pointer">
                  <BrandCard
                    key={brand._id}
                    id={brand._id}
                    name={brand.name}
                    imageUrl={`http://localhost:5000/${brand.imageUrl.replace(
                      /\\/g,
                      "/"
                    )}`}
                    offerCount={brand.offerCount}
                    createdAt={brand.createdAt}
                    onDelete={handleDeleteBrand}
                    onModify={handleModifyBrand}
                  />
                </div>
              ))}
              {/* Adjusted TailwindCSS classes for "Add Brand" div to match the new BrandCard size */}
              <div
                onClick={() => navigateToAdd("adbrands")}
                className="min-w-[140px] max-w-[280px] h-[164px] flex items-center justify-center cursor-pointer text-sm shadow-lg flex-col bg-productBg text-[#5E5FB2]"
              >
                <FaPlus size={24} color="#5E5FB2" />
                <p>დამატება</p>
              </div>
            </div>
          </section>

          {/* Offers Section */}
          <section className="w-full ">
            <div className="flex justify-between items-center py-4">
              <h2 className="text-lg font-semibold">არსებული შეთავაზებები</h2>
              <button
                onClick={() => setShowAllBrands(!showAllBrands)}
                className="text-indigo-600 hover:text-indigo-800"
              >
                {showAllBrands ? " ნაკლები " : "ყველა"}
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
              {displayedOffers.map((offer) => (
                <div
                  key={offer._id}
                  className="cursor-pointer "
                  onClick={(e) => handleClickOffer(e, offer)} // Use handleClickOffer here
                >
                  <OffersCard
                    id={offer._id}
                    imageUrls={
                      offer.imageUrls
                        ? offer.imageUrls.map(
                            (path) => `${baseUrl}${path.replace(/\\/g, "/")}`
                          )
                        : []
                    }
                    title={offer.title}
                    originalPrice={offer.originalPrice}
                    discountPrice={offer.discountPrice}
                    views={offer.views}
                    userRole={userRole}
                    onModify={handleModify}
                    onDelete={handleDelete}
                    status={offer.status}
                  />
                  {/* Additional element to display pending status */}
                  {offer.status === "pending" && (
                    <p className="text-red-500 font-bold">დასადასტურებელია</p>
                  )}
                </div>
              ))}
              <div
                onClick={navigateToAddOffers}
                className="max-w-[280px] md:h-[285px] h-[200px] flex items-center justify-center cursor-pointer text-sm gap-4 shadow-lg flex-col bg-productBg text-[#5E5FB2]"
              >
                <FaPlus size={24} color="#5E5FB2" />
                <p>დამატება</p>
              </div>
            </div>
          </section>

          {/* Ads Section */}

          <section>
            <div className="flex justify-between items-center py-4">
              <h2 className="text-lg font-semibold">რეკლამები</h2>
              <button
                onClick={() => setShowAllAds(!showAllAds)}
                className="text-indigo-600 hover:text-indigo-800"
              >
                {showAllAds ? "ნაკლები" : "ყველა"}
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
              {ads.slice(0, showAllAds ? ads.length : 3).map((ad) => (
                <div
                  key={ad._id}
                  className="bg-white p-4 flex flex-col items-center justify-center relative"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the grid click event
                    setShowActionButtons(true);
                    setSelectedAdId(ad._id);
                  }}
                >
                  <img
                    src={`${imageBaseUrl}${ad.imageUrlDesktop}`}
                    alt={ad.title}
                    className="w-full h-32 object-cover rounded-xl"
                  />
                  <h3 className="text-center mt-2">{ad.title}</h3>
                  <div className="text-sm">
                    {new Date(ad.startDate).toLocaleDateString()} -{" "}
                    {new Date(ad.endDate).toLocaleDateString()}
                  </div>

                  {showActionButtons && selectedAdId === ad._id && (
                    <div className="absolute -top-0 left-0 shadow-lg overflow-hidden w-full h-full cursor-pointer bg-[#1E1F53] opacity-95  flex flex-col justify-center items-center ">
                      <div className="w-full h-full flex ">
                        {" "}
                        <button
                          onClick={() => handleModifyAd(ad._id)}
                          className="bg-[#A8EB80] text-white lg:hover:bg-green-400  w-[50%] flex flex-col p-6   items-center justify-center "
                        >
                          <RxPencil1 size={20} className="" />
                          ჩასწორება
                        </button>
                        <button
                          onClick={() => handleDeleteAd(ad._id)}
                          className="bg-red-500 text-white p-6  lg:hover:bg-red-700 w-[50%] flex flex-col items-center justify-center "
                        >
                          <FaRegTrashCan size={20} className="" />
                          წაშლა
                        </button>
                      </div>

                      <button
                        onClick={handleCancel}
                        className="px-5 py-2 bg-gray-300 text-black  hover:bg-gray-400 flex  w-full items-center justify-center"
                      >
                        გაუქმება
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <div
                onClick={navigateToAddAd}
                className="max-w-[280px] h-[147px] flex items-center justify-center cursor-pointer text-sm gap-4 shadow-lg flex-col bg-productBg text-[#5E5FB2]"
              >
                <FaPlus size={24} color="#5E5FB2" />
                <p>დამატება</p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div className="space-y-4 md:w-[300px] w-full md:h-[200px]">
        <div className="p-4 max-w-sm mx-auto bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            ანალიტიკა
          </h5>
          <div className="font-normal text-gray-700 dark:text-gray-400 text-left">
            <p>შემოთავაზებაზე გადასვლის რაოდენობა:</p>
            <p>{metrics.totalViews}</p>
            <br />
          </div>
          <div className="font-normal text-gray-700 dark:text-gray-400">
            <p>შემოთავაზების სოც მედიაში გაზიარების რაოდენობა:</p>
            <p>{metrics.totalShares}</p>
            <br />
          </div>
          <div className="font-normal text-gray-700 dark:text-gray-400">
            <p>შემოთავაზების ლინკზე გადასვლის რაოდენობა:</p>
            <p>{metrics.totalVisits}</p>
            <br />
          </div>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            დარეგისტრირებული მომხმარებელის შემოსვლა: {metrics.totalLoginCount}
          </p>
          <br />
          <p className="font-normal text-gray-700 dark:text-gray-400">
            ყველა მომხმარებელის შემოსვლა: {metrics.totalUsers}
          </p>
          <br />
          <p className="font-normal text-gray-700 dark:text-gray-400">
            მთლიანად გატარებული დრო (საათებში):{" "}
            {metrics.estimatedTotalTimeSpent
              ? metrics.estimatedTotalTimeSpent.toFixed(2)
              : "Loading..."}
          </p>
          <br />
          <div>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              ფავორიტებში დამატებული სულ : {totalFavorites}
            </p>
          </div>
          <br />
        </div>
      </div>
    </div>
  );
};

export default Admin;
