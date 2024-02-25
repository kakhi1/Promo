import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BrandCard from "./BrandCard";
import { FaPlus } from "react-icons/fa";
const Admin = () => {
  // Simulated arrays for brands, offers, and ads, leaving space for the "Add" button

  const [offers, setOffers] = useState([...Array(19).keys()]);
  const [ads, setAds] = useState([...Array(19).keys()]);

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);

  // Fetch your brands similar to previous examples

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  // Assuming `brands` is your state variable containing an array of brand objects
  const sortedBrands = brands.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // State variables to control the visibility
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [showAllOffers, setShowAllOffers] = useState(false);
  const [showAllAds, setShowAllAds] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Uncomment if using React Router
  // const history = useHistory();
  const navigate = useNavigate();

  const navigateToAdd = (section) => {
    navigate(`/${section}`);
    // Simulate navigation, in a real app you would use routing (e.g., React Router's useHistory or useNavigate)
    // e.g., history.push(`/add-${section}`);
    console.log(`Navigating to add ${section}`);
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
    <div className="pt-8 bg-white flex">
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
              {(showAll
                ? brands
                : isMobile
                ? brands.slice(0, 4)
                : brands.slice(0, 8)
              ).map((brand) => (
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
                />
              ))}
              {/* Adjusted TailwindCSS classes for "Add Brand" div to match the new BrandCard size */}
              <div
                onClick={() => navigateToAdd("adbrands")}
                className="min-w-[140px] flex items-center justify-center cursor-pointer text-sm shadow-lg flex-col bg-productBg text-[#5E5FB2]"
              >
                <FaPlus size={24} color="#5E5FB2" />
                <p>დამატება</p>
              </div>
            </div>
          </section>

          {/* Offers Section */}
          <section className="md:my-8">
            <div className="flex justify-between items-center py-4">
              <h2 className="text-lg font-semibold">არსებული შეთავაზებები</h2>
              <button
                onClick={() => setShowAllOffers(!showAllOffers)}
                className="text-indigo-600 hover:text-indigo-800"
              >
                ყველა
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {offers
                .slice(0, showAllOffers ? offers.length : 3)
                .map((offer, index) => (
                  <div
                    key={index}
                    className="h-40 bg-gray-200 flex items-center justify-center"
                    style={{ minWidth: "160px" }}
                  >
                    Offer {offer + 1}
                  </div>
                ))}
              <div
                onClick={() => navigateToAdd("offers")}
                className="h-40 bg-gray-100 flex items-center justify-center cursor-pointer"
                style={{ minWidth: "160px" }}
              >
                Add Offer
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
                ყველა
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ads.slice(0, showAllAds ? ads.length : 3).map((ad, index) => (
                <div
                  key={index}
                  className="min-w-[160px] h-20 bg-gray-200 flex items-center justify-center"
                >
                  Ad {ad + 1}
                </div>
              ))}
              <div
                onClick={() => navigateToAdd("ads")}
                className="min-w-[160px] h-20 bg-gray-100 flex items-center justify-center cursor-pointer"
              >
                Add Ad
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Admin;
