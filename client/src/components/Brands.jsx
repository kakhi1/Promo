// export default Brands;
import React, { useState, useEffect } from "react";
import BrandCard from "./BrandCard";
import axios from "axios";
import AdComponent from "./AdComponent";
import Tags from "./Tags";

const Brands = ({ selectedCategory, selectedTag, searchQuery }) => {
  const [brands, setBrands] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [brandsPerPage] = useState(20); // Maximum brands per page
  const [selectedTags, setSelectedTags] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const handleTagSelect = (tag) => {
    setSelectedTag(tag);
    // Note: Due to React's asynchronous state updates,
    // logging 'selectedTag' immediately after 'setSelectedTag' won't show the updated state.
  };

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      let url = "https://promo-iror.onrender.com/api/brands";

      // Initialize URLSearchParams to handle query parameters.
      const params = new URLSearchParams();

      // Append 'category' to the query params if a category is selected.
      if (selectedCategory && selectedCategory._id) {
        params.append("category", selectedCategory._id);
        // console.log(`Category filter applied: ${selectedCategory._id}`);
      }

      // Append 'tag' to the query params if a tag is selected.
      if (selectedTag) {
        params.append("tag", selectedTag._id); // Assuming the tag object has an _id property
        // console.log(`Tag filter applied: ${selectedTag._id}`);
      }

      // Construct the final URL with query parameters.
      url += `?${params.toString()}`;

      try {
        // Make the API call with the constructed URL.
        const response = await axios.get(url);

        // Update the 'brands' state with the fetched data.
        // Adjust based on the actual structure of the response.
        setBrands(response.data.data || response.data);
      } catch (err) {
        console.error("Error fetching brands:", err);
        setError(err.message || "Failed to fetch brands");
      } finally {
        setLoading(false); // End loading state.
      }
    };

    fetchBrands();
  }, [selectedCategory, selectedTag, searchQuery]); // Depend on selectedCategory and selectedTag to refetch when they change.
  // Filtering based on searchQuery
  const filteredBrands = searchQuery
    ? brands.filter((brand) =>
        brand.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : brands;
  // Now, calculate the pagination variables based on filteredBrands
  const indexOfLastBrand = currentPage * brandsPerPage;
  const indexOfFirstBrand = indexOfLastBrand - brandsPerPage;
  const currentBrands = filteredBrands.slice(
    indexOfFirstBrand,
    indexOfLastBrand
  );

  if (loading) {
    return <div>Loading brands...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Calculate the current brands to display
  // const indexOfLastBrand = currentPage * brandsPerPage;
  // const indexOfFirstBrand = indexOfLastBrand - brandsPerPage;
  // const currentBrands = brands.slice(indexOfFirstBrand, indexOfLastBrand);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="pt-8 bg-white w-full flex md:flex-row flex-col-reverse">
      <div className="flex flex-col justify-between h-full w-full px-5">
        <div className="mb-8">
          <h2 className="text-lg font-semibold py-4">ტოპ ბრენდები</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 xl2:grid-cols-6 gap-4">
            {currentBrands.map((brand) => {
              const baseUrl = "https://promo-iror.onrender.com/";
              const imagePath = brand.imageUrl.replace(/\\/g, "/");
              const fullImageUrl = baseUrl + imagePath;

              return (
                <BrandCard
                  key={brand._id}
                  id={brand._id}
                  name={brand.name}
                  imageUrl={fullImageUrl}
                  offerCount={brand.offerCount}
                />
              );
            })}
          </div>
          <Pagination
            brandsPerPage={brandsPerPage}
            totalBrands={brands.length}
            paginate={paginate}
          />
        </div>
      </div>
      {/* Ad Section  */}

      <div className="w-full bg-gray-300 h-56 mb-4 md:mb-0 md:w-1/5 md:h-screen md:ml-4">
        <div className="p-4">
          <AdComponent pageType="brand" />
        </div>
      </div>
    </div>
  );
};

const Pagination = ({ brandsPerPage, totalBrands, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalBrands / brandsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="flex justify-center space-x-2 mt-4">
        {pageNumbers.map((number) => (
          <li
            key={number}
            className="border px-4 py-2 rounded hover:bg-gray-200 cursor-pointer"
          >
            <a onClick={() => paginate(number)} href="!#">
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Brands;
