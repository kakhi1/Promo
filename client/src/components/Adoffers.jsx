import React, { useState, useEffect } from "react";
import Select from "react-select";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Adoffers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [brandId, setBrandId] = useState(null);
  const [offerImage, setOfferImage] = useState(null);
  const [offerInfo, setOfferInfo] = useState({
    title: "",
    description: "",
    category: "", // Now a single string, not String constructor
    url: "", // Changed from 'url' to 'link' to match schema
    tags: [], // An array of strings, initialized as empty
    state: [], // An array of strings, initialized as empty
    originalPrice: "", // New state for original price
    discountPrice: "",
  });
  const [image, setImage] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [states, setStates] = useState([]);
  const [tags, setTags] = useState([]);
  const [errors, setErrors] = useState({});
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setOfferImage(file);
    setImage(URL.createObjectURL(file));
    if (errors.offerImage) {
      setErrors((prevErrors) => ({ ...prevErrors, offerImage: undefined }));
    }
  };

  const handleImageDelete = () => {
    setOfferImage(null);
    setImage(null);
    if (errors.offerImage) {
      setErrors((prevErrors) => ({ ...prevErrors, offerImage: undefined }));
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setOfferInfo((prev) => ({ ...prev, [name]: value }));
    setOfferInfo((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
    }
  };

  const handleStateChange = (selectedOption) => {
    setOfferInfo((prev) => ({ ...prev, state: selectedOption }));
    if (errors.state) {
      setErrors((prevErrors) => ({ ...prevErrors, state: undefined }));
    }
  };

  const handleCategoryChange = (selectedOption) => {
    setOfferInfo((prev) => ({ ...prev, category: selectedOption || "" }));
    if (errors.category) {
      setErrors((prevErrors) => ({ ...prevErrors, category: undefined }));
    }
  };

  const handleTagsChange = (selectedOptions) => {
    setOfferInfo((prev) => ({ ...prev, tags: selectedOptions || [] }));
    if (errors.tags) {
      setErrors((prevErrors) => ({ ...prevErrors, tags: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Initialize an errors object
    let newErrors = {};

    // Required fields validation
    if (!offerInfo.title) newErrors.title = "გთხოვ შეავსოთ დასახელება";
    if (!offerInfo.description)
      newErrors.description = "გთხოვ შეავსოთ პროდუქციის აღწერა";
    if (!offerInfo.category) newErrors.category = "მიუთითეთ კატეგორია";
    if (!offerInfo.url) newErrors.url = "გთხოვ მიუთით მისამართი (url)";
    if (!offerInfo.tags.length) newErrors.tags = "გთხოვ მონიშნოთ თაგი(ები)";
    if (!offerInfo.state.length) newErrors.state = "გთხოვ მიუთითოთ ქალაქი";
    if (!offerImage) newErrors.offerImage = "გთხოვ ატვირთოთ სურათი";

    // Check if there are any errors
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Stop the form submission
    }

    // If no errors, proceed with form submission
    setErrors({}); // Reset errors
    if (!user || !user.id) {
      console.error("User ID (brand ID) is not available.");
      return; // Handle this case appropriately
    }

    const formData = new FormData();
    // Append simple string values directly
    formData.append("title", offerInfo.title);
    formData.append("description", offerInfo.description);
    formData.append("url", offerInfo.url); // Make sure this matches your backend expectation, whether it's 'url' or 'link'
    formData.append("brand", brandId);
    formData.append("originalPrice", offerInfo.originalPrice);
    // Append discountPrice only if it's provided, given it can be optional
    if (offerInfo.discountPrice) {
      formData.append("discountPrice", offerInfo.discountPrice);
    }
    // Handle arrays; directly append each item as a separate entry if backend expects them as arrays
    offerInfo.tags.forEach((tag) => formData.append("tags", tag.value));
    offerInfo.state.forEach((state) => formData.append("state", state.value));

    // Handle category, assuming it's a single object selection
    if (offerInfo.category)
      formData.append("category", offerInfo.category.value);

    // Append image if present
    if (offerImage) formData.append("image", offerImage);
    formData.append("brandId", user.id);

    try {
      const response = await fetch("http://localhost:5000/api/offers", {
        method: "POST",
        body: formData,
      });

      const data = await response.json(); // Assuming the server responds with JSON
      if (response.ok) {
        console.log("Offer created:", data);
        navigate("/"); // Navigate to the homepage upon success
      } else {
        // Handle server-side validation errors (e.g., 400 responses)
        console.error("Error creating offer:", data.error || "Unknown error");
        // Optionally, update state to display error messages to the user
        setErrors(
          data.errors || { general: "An error occurred. Please try again." }
        );
      }
      console.log([...formData.entries()]);
    } catch (error) {
      // Handle network errors or other unexpected errors
      console.error("Submission error:", error);
      setErrors({ general: "A network error occurred. Please try again." });
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await fetch(
          "http://localhost:5000/api/data/categories"
        );
        const statesResponse = await fetch(
          "http://localhost:5000/api/data/states"
        );
        const tagsResponse = await fetch("http://localhost:5000/api/data/tags");

        const categoriesData = await categoriesResponse.json();
        const statesData = await statesResponse.json();
        const tagsData = await tagsResponse.json();

        setAllCategories(
          categoriesData.map((cat) => ({ value: cat._id, label: cat.name }))
        );
        setStates(
          statesData.map((state) => ({ value: state._id, label: state.name }))
        );
        setTags(tagsData.map((tag) => ({ value: tag._id, label: tag.name })));
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex">
      <div className="flex items-center flex-col justify-between h-full w-full">
        <h1 className="text-start w-full md:ml-24 ml-8 text-base font-semibold pt-4 ">
          ახალი შეთავაზების დამატება
        </h1>
        <div className="flex md:flex-row flex-col justify-between md:h-full w-full pt-4">
          <div className="md:w-1/3 w-full h-full flex flex-col items-start justify-start gap-10 md:ml-10 md:mt-10 ml-4">
            <div
              onClick={() => document.getElementById("imageUpload").click()}
              className="cursor-pointer md:w-2/3 w-[93%] h-[250px] flex justify-center items-center flex-col bg-productBg text-[#5E5FB2]"
              style={{ fontSize: "16px" }}
            >
              <FaPlus size={24} color="#5E5FB2" />
              <p>სურათის ატვირთვა</p>
            </div>
            <input
              type="file"
              id="imageUpload"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
            {image && (
              <div>
                <img
                  src={image}
                  alt="Uploaded"
                  style={{ width: "100px", height: "100px" }}
                />
                <button onClick={handleImageDelete}>
                  <FaTrash />
                </button>
              </div>
            )}
            {errors.offerImage && (
              <span className="text-red-500 text-sm">{errors.offerImage}</span>
            )}
            {/* Original Price Input */}
            <div className=" flex md:w-2/3 w-[93%] mt-4 justify-start items-center flex-col gap-4">
              <h1 className="text-start w-full  text-base font-semibold">
                მიუთითე თავდაპირველი ფასი
              </h1>
              <input
                type="text"
                name="originalPrice"
                placeholder="თავდაპირველი ფასი"
                value={offerInfo.originalPrice}
                onChange={handleChange}
                className="input input-bordered w-full mb-2 border-2 border-[#CED4DA] h-8 rounded-md pl-6"
              />
            </div>
            {/* Discount Price Input */}
            <div className=" flex md:w-2/3 w-[93%] mt-4 justify-start items-center flex-col gap-4">
              <h1 className="text-start w-full  text-base font-semibold">
                მიუთითე ფასი ფასდაკლებით
              </h1>
              <input
                type="text"
                name="discountPrice"
                placeholder="ფასი ფასდაკლების შემდეგ"
                value={offerInfo.discountPrice}
                onChange={handleChange}
                className="input input-bordered w-full mb-2 border-2 border-[#CED4DA] h-8 rounded-md pl-6"
              />
            </div>
          </div>

          <div className="flex flex-col w-full md:w-2/3 md:flex-row h-full md:mt-6  gap-4 p-4">
            <div className="flex flex-col gap-4 w-full">
              <input
                type="text"
                name="title"
                placeholder="დასახელება"
                onChange={handleChange}
                className="input input-bordered w-full mb-2 border-2 border-[#CED4DA] h-8 rounded-md pl-6"
              />
              {errors.title && (
                <span className="text-red-500 text-sm">{errors.title}</span>
              )}
              <textarea
                name="description"
                placeholder="შეიყვანე პროდუქტის აღწერა"
                onChange={handleChange}
                className="textarea textarea-bordered w-full h-32 mb-2 border-2 border-[#CED4DA] rounded-md p-6"
              ></textarea>{" "}
              {errors.description && (
                <span className="text-red-500 text-sm">
                  {errors.description}
                </span>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full flex justify-start items-center flex-col gap-4">
                  <h1 className="text-start w-full  text-base font-semibold">
                    მიუთითეთ თეგები
                  </h1>{" "}
                  <Select
                    isMulti
                    name="tags"
                    options={tags}
                    className="basic-multi-select w-full"
                    classNamePrefix="select"
                    onChange={handleTagsChange}
                    placeholder="აირჩიეთ თეგი (ებ)..."
                  />
                  {errors.tags && (
                    <span className="text-red-500 text-sm">{errors.tags}</span>
                  )}
                </div>
                <div className="w-full flex justify-start items-center flex-col gap-4">
                  <h1 className="text-start w-full  text-base font-semibold">
                    აირჩიე ქალაქები
                  </h1>
                  <Select
                    isMulti
                    name="state"
                    options={states}
                    className="basic-multi-select w-full"
                    classNamePrefix="select"
                    onChange={handleStateChange}
                    placeholder="აირჩიე ქალაქი (ები)..."
                  />{" "}
                  {errors.state && (
                    <span className="text-red-500 text-sm">{errors.state}</span>
                  )}
                </div>
                <div className="w-full flex justify-start items-center flex-col gap-4">
                  <h1 className="text-start w-full  text-base font-semibold">
                    ბმული
                  </h1>
                  <input
                    type="text"
                    name="url"
                    placeholder="URL"
                    onChange={handleChange}
                    className="input input-bordered w-full mb-2 border-2 border-[#CED4DA] h-8 rounded-md pl-6"
                  />
                  {errors.url && (
                    <span className="text-red-500 text-sm">{errors.url}</span>
                  )}
                </div>
                <div className="flex flex-col justify-start items-start  md:w-[90%] w-full gap-4">
                  <h1 className="text-start w-full  text-base font-semibold">
                    მიუთითეთ კატეგორია
                  </h1>
                  <Select
                    name="category"
                    options={allCategories}
                    className="input border-2 border-[#CED4DA] h-8 rounded-md w-full"
                    classNamePrefix="select"
                    onChange={handleCategoryChange}
                    placeholder="კატეგორია"
                  />{" "}
                  {errors.category && (
                    <span className="text-red-500 text-sm">
                      {errors.category}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-end items-center w-full gap-4">
                <button
                  className="btn btn-primary mt-4 bg-[#DCEEF8] hover:bg-slate-200 text-[#9D9D9D] w-[156px] h-[46px]"
                  onClick={() => navigate(-1)}
                >
                  გაუქმება
                </button>
                <button
                  className="btn btn-primary mt-4 bg-[#5E5FB2] hover:bg-slate-400 text-white w-[156px] h-[46px]"
                  onClick={handleSubmit}
                >
                  გამოქვეყნება
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Adoffers;
