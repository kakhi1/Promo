import React, { useState, useEffect } from "react";

// Assuming you're using react-router-dom for routing
import { useParams } from "react-router-dom";

const BrandInfo = () => {
  const { brandId } = useParams(); // Extract brandId from URL
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/brands/${brandId}`
        );
        const data = await response.json();
        if (response.ok) {
          setBrand(data);
        } else {
          throw new Error(
            data.message ||
              "An error occurred while fetching the brand details."
          );
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBrand();
  }, [brandId]); // Dependency array to refetch if brandId changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!brand) return <div>No brand found.</div>;

  // Adjust the image path as needed
  const imageUrl = `http://localhost:5000/${brand.imageUrl.replace(
    /\\/g,
    "/"
  )}`;

  return (
    <div className="flex md:flex-row flex-col-reverse  px-10">
      <div className="md:w-4/5 w-full">
        <div className="flex justify-start py-4">
          <h1 className="text-[24px] font-semibold">{brand.name}</h1>
        </div>
        <div className="flex  flex-col md:flex-row">
          <div className="w-full md:flex-row flex flex-col">
            {" "}
            {/* Image */}
            <div className="flex justify-center items-center p-4 md:w-[40%] w-full">
              <img
                src={imageUrl}
                alt={brand.name}
                className="max-h-full max-w-full"
              />
            </div>
            {/* Description */}
            <div className="flex-1 p-4 overflow-auto">
              <p>{brand.description}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-gray-300 h-56 mb-4 md:mb-0 md:w-1/5 md:h-screen md:ml-4">
        <div className="p-4">Ad Content Here</div>
      </div>
    </div>
  );
};

export default BrandInfo;
