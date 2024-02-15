// import React, { useState } from "react";

// const UserArea = () => {
//   const [favorites] = useState([...Array(20).keys()]); // Simulated array of favorite items
//   const [suggestedOffers] = useState([...Array(20).keys()]); // Simulated array of suggested offers
//   const [interestingBrands] = useState([...Array(20).keys()]); // Simulated array of interesting brands
//   const [showAllFavorites, setShowAllFavorites] = useState(false);
//   const [showAllSuggestedOffers, setShowAllSuggestedOffers] = useState(false);
//   const [showAllInterestingBrands, setShowAllInterestingBrands] =
//     useState(false);

//   return (
//     <div className="pt-8 bg-white flex ">
//       <div className="flex md:flex-row flex-col-reverse w-full justify-center px-5">
//         <div className="md:flex-grow">
//           {/* For each section, apply similar logic */}

//           {/* Section 1: Favorites */}
//           <section>
//             <div className="flex justify-between items-center py-4">
//               <h2 className="text-lg font-semibold">ფავორიტები</h2>
//               {!showAllFavorites && (
//                 <button
//                   onClick={() => setShowAllFavorites(true)}
//                   className="text-indigo-600 hover:text-indigo-800"
//                 >
//                   ყველა
//                 </button>
//               )}
//             </div>
//             <div
//               className={`${
//                 showAllFavorites
//                   ? "grid grid-cols-2 md:grid-cols-4 gap-4"
//                   : "flex overflow-x-auto space-x-4"
//               }`}
//             >
//               {favorites
//                 .slice(0, showAllFavorites ? favorites.length : 1)
//                 .map((favorite, index) => (
//                   <div
//                     key={index}
//                     className="min-w-[160px] h-40 bg-gray-200 flex items-center justify-center"
//                   >
//                     Favorite {favorite + 1}
//                   </div>
//                 ))}
//             </div>
//           </section>

//           {/* Section 2: Suggested Offers */}
//           <section>
//             <div className="flex justify-between items-center py-4">
//               <h2 className="text-lg font-semibold">
//                 ასევე შეიძლება მოგეწონოთ
//               </h2>
//               {!showAllSuggestedOffers && (
//                 <button
//                   onClick={() => setShowAllSuggestedOffers(true)}
//                   className="text-indigo-600 hover:text-indigo-800"
//                 >
//                   ყველა
//                 </button>
//               )}
//             </div>
//             <div
//               className={`${
//                 showAllSuggestedOffers
//                   ? "grid grid-cols-2 md:grid-cols-4 gap-4"
//                   : "flex overflow-x-auto space-x-4"
//               }`}
//             >
//               {suggestedOffers
//                 .slice(0, showAllSuggestedOffers ? suggestedOffers.length : 3)
//                 .map((offer, index) => (
//                   <div
//                     key={index}
//                     className="min-w-[160px] h-40 bg-gray-200 flex items-center justify-center"
//                   >
//                     Offer {offer + 1}
//                   </div>
//                 ))}
//             </div>
//           </section>

//           {/* Section 3: Interesting Brands */}
//           <section>
//             <div className="flex justify-between items-center py-4">
//               <h2 className="text-lg font-semibold">
//                 თქვენთვის საინტერესო ბრენდები
//               </h2>
//               {!showAllInterestingBrands && (
//                 <button
//                   onClick={() => setShowAllInterestingBrands(true)}
//                   className="text-indigo-600 hover:text-indigo-800"
//                 >
//                   ყველა
//                 </button>
//               )}
//             </div>
//             <div
//               className={`${
//                 showAllInterestingBrands
//                   ? "grid grid-cols-2 md:grid-cols-4 gap-4"
//                   : "flex overflow-x-auto space-x-4"
//               }`}
//             >
//               {interestingBrands
//                 .slice(
//                   0,
//                   showAllInterestingBrands ? interestingBrands.length : 4
//                 )
//                 .map((brand, index) => (
//                   <div
//                     key={index}
//                     className="min-w-[160px] h-20 bg-gray-200 flex items-center justify-center"
//                   >
//                     Brand {brand + 1}
//                   </div>
//                 ))}
//             </div>
//           </section>
//         </div>
//         {/* Ad Section - On top for mobile */}
//         <div className="w-full bg-gray-300 h-56 mb-4 md:mb-0 md:w-1/5 md:h-screen md:ml-4">
//           <div className="p-4">Ad Content Here</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserArea;
import React, { useState } from "react";

const UserArea = () => {
  const [favorites] = useState([...Array(20).keys()]); // Simulated array of favorite items
  const [suggestedOffers] = useState([...Array(20).keys()]); // Simulated array of suggested offers
  const [interestingBrands] = useState([...Array(20).keys()]); // Simulated array of interesting brands
  const [showAllFavorites, setShowAllFavorites] = useState(false);
  const [showAllSuggestedOffers, setShowAllSuggestedOffers] = useState(false);
  const [showAllInterestingBrands, setShowAllInterestingBrands] =
    useState(false);

  return (
    <div className="pt-8 bg-white flex">
      <div className="flex md:flex-row flex-col-reverse w-full justify-center px-5">
        <div className="md:flex-grow">
          {/* Section 1: Favorites */}
          <section>
            <div className="flex justify-between items-center py-4">
              <h2 className="text-lg font-semibold">ფავორიტები</h2>
              {!showAllFavorites && (
                <button
                  onClick={() => setShowAllFavorites(true)}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  ყველა
                </button>
              )}
            </div>
            <div
              className={`${
                showAllFavorites
                  ? "grid grid-cols-2 md:grid-cols-4 gap-4"
                  : "flex overflow-x-auto space-x-4"
              }`}
            >
              {favorites
                .slice(0, showAllFavorites ? favorites.length : 1)
                .map((favorite, index) => (
                  <div
                    key={index}
                    className="min-w-[160px] h-40 bg-gray-200 flex items-center justify-center"
                  >
                    Favorite {favorite + 1}
                  </div>
                ))}
            </div>
          </section>

          {/* Section 2: Suggested Offers */}
          <section>
            <div className="flex justify-between items-center py-4">
              <h2 className="text-lg font-semibold">
                ასევე შეიძლება მოგეწონოთ
              </h2>
              {!showAllSuggestedOffers && (
                <button
                  onClick={() => setShowAllSuggestedOffers(true)}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  ყველა
                </button>
              )}
            </div>
            <div
              className={`${
                showAllSuggestedOffers
                  ? "md:grid-cols-4 md:grid-rows-1" // For "show all", adjust if you want a different layout when all items are shown
                  : "grid grid-cols-2 gap-4 md:grid-cols-4 md:grid-rows-1"
              }`}
            >
              {suggestedOffers
                .slice(0, showAllSuggestedOffers ? suggestedOffers.length : 4)
                .map((offer, index) => (
                  <div
                    key={index}
                    className="h-40 bg-gray-200 flex items-center justify-center"
                    style={{ minWidth: "160px" }} // Ensure items have a minimum width
                  >
                    Offer {offer + 1}
                  </div>
                ))}
            </div>
          </section>

          {/* Section 3: Interesting Brands */}
          <section>
            <div className="flex justify-between items-center py-4">
              <h2 className="text-lg font-semibold">
                თქვენთვის საინტერესო ბრენდები
              </h2>
              {!showAllInterestingBrands && (
                <button
                  onClick={() => setShowAllInterestingBrands(true)}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  ყველა
                </button>
              )}
            </div>
            <div
              className={`${
                showAllInterestingBrands
                  ? "md:grid-cols-4 md:grid-rows-1" // For "show all", adjust if you want a different layout when all items are shown
                  : "grid grid-cols-2 gap-4 md:grid-cols-4 md:grid-rows-1"
              }`}
            >
              {interestingBrands
                .slice(
                  0,
                  showAllInterestingBrands ? interestingBrands.length : 4
                )
                .map((brand, index) => (
                  <div
                    key={index}
                    className="min-w-[160px] h-20 bg-gray-200 flex items-center justify-center"
                  >
                    Brand {brand + 1}
                  </div>
                ))}
            </div>
          </section>
        </div>

        {/* Ad Section - On top for mobile */}
        <div className="w-full bg-gray-300 h-56 mb-4 md:mb-0 md:w-1/5 md:h-screen md:ml-4">
          <div className="p-4">Ad Content Here</div>
        </div>
      </div>
    </div>
  );
};

export default UserArea;
