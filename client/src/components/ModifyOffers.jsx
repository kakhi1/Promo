import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Select from "react-select";
import { FaPlus, FaTrash } from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

function ModifyOffers() {
  const { userRole } = useAuth();
  const { offerId } = useParams();
  console.log(offerId);
  const fileInputRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [brandId, setBrandId] = useState(null);
  const [offerImage, setOfferImage] = useState(null);
  const [offerInfo, setOfferInfo] = useState({
    title: "",
    description: "",
    category: null, // Now a single string, not String constructor
    url: "", // Changed from 'url' to 'link' to match schema
    tags: [], // An array of strings, initialized as empty
    state: [], // An array of strings, initialized as empty
    originalPrice: "", // New state for original price
    discountPrice: "",
  });
  const [image, setImage] = useState(null);
  const [offerImages, setOfferImages] = useState([]); // Holds the File objects
  const [imagesPreview, setImagesPreview] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [states, setStates] = useState([]);
  const [tags, setTags] = useState([]);
  const [errors, setErrors] = useState({});
  console.log("All Categories:", allCategories);
  console.log("States:", states);
  console.log("Tags:", tags);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);

    // Assuming setOfferImages and setImagesPreview are meant to manage an array of file objects and their preview URLs respectively
    const newFiles = files.filter(
      (file) =>
        !offerImages.some((existingFile) => existingFile.name === file.name)
    );
    const newImageUrls = newFiles.map((file) => URL.createObjectURL(file));

    setOfferImages((prevImages) => [...prevImages, ...newFiles]);
    setImagesPreview((prevUrls) => [...prevUrls, ...newImageUrls]);

    // Reset errors if necessary
    if (errors.offerImage) {
      setErrors((prevErrors) => ({ ...prevErrors, offerImage: undefined }));
    }
  };

  const handleImageDelete = (index) => {
    // Remove the image from the offerImages array
    const newOfferImages = offerImages.filter((_, i) => i !== index);
    setOfferImages(newOfferImages);

    // Remove the image preview URL from the imagesPreview array
    const newImagesPreview = imagesPreview.filter((_, i) => i !== index);
    setImagesPreview(newImagesPreview);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setOfferInfo((prev) => ({ ...prev, [name]: value }));
    setOfferInfo((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
    }
  };

  const handleStateChange = (selectedOptions) => {
    setOfferInfo((prev) => ({ ...prev, state: selectedOptions || [] }));
    console.log("Updated states selected:", selectedOptions);
  };

  const handleTagsChange = (selectedOptions) => {
    setOfferInfo((prev) => ({ ...prev, tags: selectedOptions || [] }));
    console.log("Updated tags selected:", selectedOptions);
  };

  const handleCategoryChange = (selectedOption) => {
    setOfferInfo((prev) => ({
      ...prev,
      category: selectedOption ? selectedOption.value : "",
    }));
  };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   // Validation checks remain the same

  //   const formData = new FormData();
  //   offerImages.forEach((file) => formData.append("images", file));
  //   // Append other offerInfo fields to formData
  //   Object.entries(offerInfo).forEach(([key, value]) => {
  //     if (Array.isArray(value)) {
  //       value.forEach((item) => formData.append(key, item.value || item));
  //     } else {
  //       formData.append(key, value);
  //     }
  //   });

  //   try {
  //     const response = await fetch(
  //       `http://localhost:5000/api/offers/${offerId}`,
  //       {
  //         method: "PUT",
  //         body: formData,
  //         // Ensure you include headers or authentication as required by your API
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Error updating offer");
  //     }

  //     const updatedOffer = await response.json();
  //     console.log("offerDetails", updatedOffer); // Check the fetched data structure

  //     console.log("Offer updated successfully:", updatedOffer);
  //     navigate(`/offer-details/${offerId}`); // Redirect to the updated offer's details page or another appropriate route
  //   } catch (error) {
  //     console.error("Error updating offer:", error);
  //     setErrors({
  //       general: "An error occurred during the update. Please try again.",
  //     });
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting form...");
    console.log("User role:", userRole);

    let updatedOfferInfo = { ...offerInfo };

    // If userRole is 'brand', then the offer's status should be set to 'pending'
    if (userRole === "brand") {
      console.log("User is a brand, setting status to pending...");
      updatedOfferInfo.status = "pending";
    } else {
      console.log("User is not a brand, applying non-brand specific logic...");
    }

    // Debugging: Log the updated offer info before sending
    console.log("Updated offer info before sending:", updatedOfferInfo);

    // Prepare FormData for submission
    const formData = new FormData();
    // offerImages.forEach((file) => formData.append("images", file));
    // Object.entries(updatedOfferInfo).forEach(([key, value]) => {
    //   if (Array.isArray(value)) {
    //     value.forEach((item) => formData.append(key, item.value || item));
    //   } else {
    //     formData.append(key, value);
    //   }
    // });
    offerImages.forEach((file) => formData.append("images", file));

    Object.entries(updatedOfferInfo).forEach(([key, value]) => {
      if (key === "tags" || key === "state" || key === "category") {
        // Convert object or array of objects to a JSON string
        formData.append(key, JSON.stringify(value));
      } else if (Array.isArray(value)) {
        value.forEach((item) => formData.append(key, item));
      } else {
        formData.append(key, value);
      }
    });
    // Debugging: Log FormData contents
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    // Retrieve the token
    const token = localStorage.getItem("userToken");

    try {
      const response = await fetch(
        `http://localhost:5000/api/offers/${offerId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
          // Include headers for authentication as required by your API
        }
      );

      if (!response.ok) {
        throw new Error("Error updating offer");
      }

      const updatedOffer = await response.json();
      console.log("Offer updated successfully:", updatedOffer);
      navigate(`/offer-details/${offerId}`); // Adjust this to match your routing setup
    } catch (error) {
      console.error("Error updating offer:", error);
      setErrors({
        general: "An error occurred during the update. Please try again.",
      });
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
  console.log("userRole in Offersmodify:", userRole);

  useEffect(() => {
    const fetchOfferDetails = async () => {
      if (allCategories.length > 0 && states.length > 0 && tags.length > 0) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/offers/${offerId}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch offer details");
          }
          const offerDetails = await response.json();
          const offer = offerDetails.data;

          setOfferInfo((prev) => ({
            ...prev,
            title: offer.title,
            description: offer.description,
            category:
              allCategories.find((cat) => cat.value === offer.category) || null,
            state: offer.state.map(
              (stateId) =>
                states.find((st) => st.value === stateId) || {
                  value: stateId,
                  label: "Unknown State",
                }
            ),
            tags: offer.tags.map(
              (tagId) =>
                tags.find((tag) => tag.value === tagId) || {
                  value: tagId,
                  label: "Unknown Tag",
                }
            ),
            url: offer.url,
            originalPrice: offer.originalPrice.toString(),
            discountPrice: offer.discountPrice.toString(),
          }));

          // Assuming your images URLs are stored in a way that needs transformation
          setImagesPreview(
            offer.imageUrls.map(
              (url) => `http://localhost:5000/${url.replace(/\\/g, "/")}`
            )
          );
        } catch (error) {
          console.error("Error fetching offer details:", error);
        }
      }
    };

    fetchOfferDetails();
    // This useEffect depends on allCategories, states, and tags being loaded, hence they are in the dependency array
  }, [offerId, allCategories, states, tags]);

  if (allCategories.length === 0 || states.length === 0 || tags.length === 0) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex">
      <div className="flex items-center flex-col justify-between h-full w-full">
        <h1 className="text-start w-full md:ml-24 ml-8 text-base font-semibold pt-4 ">
          შეთავაზების შესწორება
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

            {/* Hidden input for handling the actual file upload */}
            <input
              type="file"
              id="imageUpload"
              ref={fileInputRef}
              multiple
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />

            <div className="flex flex-wrap gap-2">
              {imagesPreview.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Upload ${index}`}
                    className="w-24 h-24 object-cover"
                  />
                  <button
                    onClick={() => handleImageDelete(index)}
                    className="absolute top-0 right-0 cursor-pointer bg-red-500 text-white p-1 rounded-full text-sm"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
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
                value={offerInfo.title}
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
                value={offerInfo.description}
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
                    value={offerInfo.tags}
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
                    value={offerInfo.state}
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
                    value={offerInfo.url}
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
                    value={offerInfo.category}
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
                  შესწორება
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModifyOffers;
