// export default Brands;
import React, { useState, useEffect } from "react";
import BrandCard from "./BrandCard";
import axios from "axios";
import AdComponent from "./AdComponent";

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [brandsPerPage] = useState(20); // Maximum brands per page
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/brands");
        const brandsData = response.data;
        if (brandsData.success && Array.isArray(brandsData.data)) {
          // Sort brands by offer count in descending order
          const sortedBrands = brandsData.data.sort(
            (a, b) => b.offerCount - a.offerCount
          );
          setBrands(sortedBrands);
        } else {
          throw new Error("Failed to fetch brands");
        }
      } catch (error) {
        console.error("Failed to fetch brands:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  // Calculate the current brands to display
  const indexOfLastBrand = currentPage * brandsPerPage;
  const indexOfFirstBrand = indexOfLastBrand - brandsPerPage;
  const currentBrands = brands.slice(indexOfFirstBrand, indexOfLastBrand);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="pt-8 bg-white w-full flex md:flex-row flex-col-reverse">
      <div className="flex flex-col justify-between h-full px-5">
        <div className="mb-8">
          <h2 className="text-lg font-semibold py-4">ტოპ ბრენდები</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {currentBrands.map((brand) => {
              const baseUrl = "http://localhost:5000/";
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
