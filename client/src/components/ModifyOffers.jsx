// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import Select from "react-select";
// import CreatableSelect from "react-select/creatable";
// import { FaPlus, FaTrash } from "react-icons/fa";
// import { useAuth } from "../context/AuthContext";
// import config from "../config";

// function ModifyOffers() {
//   const { userRole } = useAuth();
//   const { offerId } = useParams();
//   const fileInputRef = useRef(null);
//   const { user, token } = useAuth();
//   const navigate = useNavigate();
//   const [offerInfo, setOfferInfo] = useState({
//     title: "",
//     description: "",
//     category: [],
//     url: "",
//     tags: [],
//     state: [],
//   });
//   const [offerImages, setOfferImages] = useState([]);
//   const [imagesPreview, setImagesPreview] = useState([]);
//   const [allCategories, setAllCategories] = useState([]);
//   const [states, setStates] = useState([]);
//   const [tags, setTags] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [allStates, setAllStates] = useState([]);
//   const [visibleStates, setVisibleStates] = useState([]);

//   const [allowWithoutDescription, setAllowWithoutDescription] = useState(false);
//   const [allowWithoutUrl, setAllowWithoutUrl] = useState(false);

//   const handleImageUpload = (event) => {
//     const files = Array.from(event.target.files);

//     const newFiles = files.filter(
//       (file) =>
//         !offerImages.some((existingFile) => existingFile.name === file.name)
//     );
//     const newImageUrls = newFiles.map((file) => URL.createObjectURL(file));

//     setOfferImages((prevImages) => [...prevImages, ...newFiles]);
//     setImagesPreview((prevUrls) => [...prevUrls, ...newImageUrls]);

//     if (errors.offerImage) {
//       setErrors((prevErrors) => ({ ...prevErrors, offerImage: undefined }));
//     }
//   };

//   const handleImageDelete = (index) => {
//     const newOfferImages = offerImages.filter((_, i) => i !== index);
//     setOfferImages(newOfferImages);

//     const newImagesPreview = imagesPreview.filter((_, i) => i !== index);
//     setImagesPreview(newImagesPreview);
//   };

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setOfferInfo((prev) => ({ ...prev, [name]: value }));
//     if (errors[name]) {
//       setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
//     }
//   };

//   const handleCreateTag = async (inputValue) => {
//     try {
//       const response = await fetch(`${config.apiBaseUrl}/api/data/tags`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ name: inputValue }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to create tag");
//       }

//       const newTag = await response.json();
//       setTags((prevTags) => [
//         ...prevTags,
//         { value: newTag._id, label: newTag.name },
//       ]);
//       setOfferInfo((prev) => ({
//         ...prev,
//         tags: [...prev.tags, { value: newTag._id, label: newTag.name }],
//       }));
//     } catch (error) {
//       console.error("Error creating new tag:", error);
//     }
//   };

//   const handleStateChange = (selectedOptions) => {
//     const isSelectAll = selectedOptions.some(
//       (option) => option.value === "all"
//     );

//     if (isSelectAll) {
//       const allSelectedStates = allStates.filter(
//         (option) => option.value !== "all"
//       );
//       setOfferInfo((prev) => ({
//         ...prev,
//         state: allSelectedStates,
//       }));
//     } else {
//       setOfferInfo((prev) => ({
//         ...prev,
//         state: selectedOptions,
//       }));
//     }
//   };

//   const handleTagsChange = (selectedOptions) => {
//     setOfferInfo((prev) => ({ ...prev, tags: selectedOptions || [] }));
//   };

//   const handleCategoryChange = (selectedOptions) => {
//     setOfferInfo((prev) => ({ ...prev, category: selectedOptions || [] }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     let newErrors = {};

//     if (!offerInfo.title) newErrors.title = "გთხოვ შეავსოთ დასახელება";
//     if (!allowWithoutDescription && !offerInfo.description) {
//       newErrors.description = "გთხოვ შეავსოთ პროდუქციის აღწერა";
//     }
//     if (!offerInfo.category.length) newErrors.category = "მიუთითეთ კატეგორია";
//     if (!allowWithoutUrl && !offerInfo.url) {
//       newErrors.url = "გთხოვ მიუთით მისამართი (url)";
//     }
//     if (
//       allowWithoutDescription &&
//       allowWithoutUrl &&
//       (!offerInfo.description || !offerInfo.url)
//     ) {
//       newErrors.descriptionUrl =
//         "შეთავაზება უნდა შეიცავდეს ან აღწერას ან URL-ს";
//     }
//     if (!offerInfo.tags.length) newErrors.tags = "გთხოვ მონიშნოთ თაგი(ები)";
//     if (!offerInfo.state.length) newErrors.state = "გთხოვ მიუთითოთ ქალაქი";
//     if (offerImages.length === 0 && imagesPreview.length === 0) {
//       newErrors.offerImage = "გთხოვ ატვირთოთ სურათი";
//     }

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     let updatedOfferInfo = { ...offerInfo };

//     if (userRole === "brand") {
//       updatedOfferInfo.status = "pending";
//     }

//     const formData = new FormData();

//     formData.append("role", user.role);
//     offerImages.forEach((file) => formData.append("images", file));

//     Object.entries(updatedOfferInfo).forEach(([key, value]) => {
//       if (key === "tags" || key === "state" || key === "category") {
//         formData.append(key, JSON.stringify(value));
//       } else if (Array.isArray(value)) {
//         value.forEach((item) => formData.append(key, item));
//       } else {
//         formData.append(key, value);
//       }
//     });

//     const token = localStorage.getItem("userToken");

//     try {
//       const response = await fetch(
//         `${config.apiBaseUrl}/api/offers/${offerId}`,
//         {
//           method: "PUT",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           body: formData,
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Error updating offer");
//       }

//       const updatedOffer = await response.json();
//       navigate(`/offer-details/${offerId}`);
//     } catch (error) {
//       console.error("Error updating offer:", error);
//       setErrors({
//         general: "An error occurred during the update. Please try again.",
//       });
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const categoriesResponse = await fetch(
//           `${config.apiBaseUrl}/api/data/categories`
//         );
//         const statesResponse = await fetch(
//           `${config.apiBaseUrl}/api/data/states`
//         );
//         const tagsResponse = await fetch(`${config.apiBaseUrl}/api/data/tags`);

//         const categoriesData = await categoriesResponse.json();
//         const statesData = await statesResponse.json();
//         const allStatesData = [
//           { value: "all", label: "ყველას არჩევა" },
//           ...statesData.map((state) => ({
//             value: state._id,
//             label: state.name,
//           })),
//         ];

//         setAllStates(allStatesData);
//         setVisibleStates(allStatesData);
//         const tagsData = await tagsResponse.json();

//         setAllCategories(
//           categoriesData.map((cat) => ({ value: cat._id, label: cat.name }))
//         );
//         setStates(
//           statesData.map((state) => ({ value: state._id, label: state.name }))
//         );
//         setTags(tagsData.map((tag) => ({ value: tag._id, label: tag.name })));
//       } catch (error) {
//         console.error("Failed to fetch data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     const fetchOfferDetails = async () => {
//       if (allCategories.length > 0 && states.length > 0 && tags.length > 0) {
//         try {
//           const response = await fetch(
//             `${config.apiBaseUrl}/api/offers/${offerId}`
//           );
//           if (!response.ok) {
//             throw new Error("Failed to fetch offer details");
//           }
//           const offerDetails = await response.json();
//           const offer = offerDetails.data;

//           setOfferInfo((prev) => ({
//             ...prev,
//             title: offer.title,
//             description: offer.description,
//             category: offer.category.map(
//               (catId) =>
//                 allCategories.find((cat) => cat.value === catId) || {
//                   value: catId,
//                   label: "Unknown Category",
//                 }
//             ),
//             state: offer.state.map(
//               (stateId) =>
//                 states.find((st) => st.value === stateId) || {
//                   value: stateId,
//                   label: "Unknown State",
//                 }
//             ),
//             tags: offer.tags.map(
//               (tagId) =>
//                 tags.find((tag) => tag.value === tagId) || {
//                   value: tagId,
//                   label: "Unknown Tag",
//                 }
//             ),
//             url: offer.url,
//           }));

//           setImagesPreview(
//             offer.imageUrls.map(
//               (url) => `${config.apiBaseUrl}/${url.replace(/\\/g, "/")}`
//             )
//           );
//         } catch (error) {
//           console.error("Error fetching offer details:", error);
//         }
//       }
//     };

//     fetchOfferDetails();
//   }, [offerId, allCategories, states, tags]);

//   if (allCategories.length === 0 || states.length === 0 || tags.length === 0) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="flex">
//       <div className="flex items-center flex-col justify-between h-full w-full">
//         <h1 className="text-start w-full md:ml-24 ml-8 text-base font-semibold pt-4 ">
//           შეთავაზების შესწორება
//         </h1>
//         <div className="flex md:flex-row flex-col justify-between md:h-full w-full pt-4">
//           <div className="md:w-1/3 w-full h-full flex flex-col items-start justify-start gap-10 md:ml-10 md:mt-10 ml-4">
//             <div
//               onClick={() => document.getElementById("imageUpload").click()}
//               className="cursor-pointer md:w-2/3 w-[93%] h-[250px] flex justify-center items-center flex-col bg-productBg text-[#5E5FB2]"
//               style={{ fontSize: "16px" }}
//             >
//               <FaPlus size={24} color="#5E5FB2" />
//               <p>სურათის ატვირთვა</p>
//             </div>

//             <input
//               type="file"
//               id="imageUpload"
//               ref={fileInputRef}
//               multiple
//               style={{ display: "none" }}
//               onChange={handleImageUpload}
//             />

//             <div className="flex flex-wrap gap-2">
//               {imagesPreview.map((image, index) => (
//                 <div key={index} className="relative">
//                   <img
//                     src={image}
//                     alt={`Upload ${index}`}
//                     className="w-24 h-24 object-cover"
//                   />
//                   <button
//                     onClick={() => handleImageDelete(index)}
//                     className="absolute top-0 right-0 cursor-pointer bg-red-500 text-white p-1 rounded-full text-sm"
//                   >
//                     <FaTrash />
//                   </button>
//                 </div>
//               ))}
//             </div>
//             {errors.offerImage && (
//               <span className="text-red-500 text-sm">{errors.offerImage}</span>
//             )}
//           </div>

//           <div className="flex flex-col w-full md:w-2/3 md:flex-row h-full md:mt-6 gap-4 p-4">
//             <div className="flex flex-col gap-4 w-full">
//               <input
//                 type="text"
//                 name="title"
//                 value={offerInfo.title}
//                 placeholder="დასახელება"
//                 onChange={handleChange}
//                 className="input input-bordered w-full mb-2 border-2 border-[#CED4DA] h-8 rounded-md pl-6"
//               />
//               {errors.title && (
//                 <span className="text-red-500 text-sm">{errors.title}</span>
//               )}
//               <textarea
//                 name="description"
//                 placeholder="შეიყვანე პროდუქტის აღწერა"
//                 value={offerInfo.description}
//                 onChange={handleChange}
//                 className="textarea textarea-bordered w-full h-32 mb-2 border-2 border-[#CED4DA] rounded-md p-6"
//               ></textarea>
//               {errors.description && (
//                 <span className="text-red-500 text-sm">
//                   {errors.description}
//                 </span>
//               )}
//               <div className="flex items-center">
//                 <input
//                   type="checkbox"
//                   id="allowWithoutDescription"
//                   checked={allowWithoutDescription}
//                   onChange={() =>
//                     setAllowWithoutDescription(!allowWithoutDescription)
//                   }
//                 />
//                 <label htmlFor="allowWithoutDescription" className="ml-2">
//                   დამატება აღწერის გარეშე
//                 </label>
//               </div>
//               <div className="flex items-center">
//                 <input
//                   type="checkbox"
//                   id="allowWithoutUrl"
//                   checked={allowWithoutUrl}
//                   onChange={() => setAllowWithoutUrl(!allowWithoutUrl)}
//                 />
//                 <label htmlFor="allowWithoutUrl" className="ml-2">
//                   დამატება URL-ის გარეშე
//                 </label>
//               </div>
//               {errors.descriptionUrl && (
//                 <span className="text-red-500 text-sm">
//                   {errors.descriptionUrl}
//                 </span>
//               )}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="w-full flex justify-start items-center flex-col gap-4">
//                   <h1 className="text-start w-full  text-base font-semibold">
//                     მიუთითეთ თეგები
//                   </h1>
//                   <CreatableSelect
//                     isMulti
//                     name="tags"
//                     options={tags}
//                     value={offerInfo.tags}
//                     onChange={handleTagsChange}
//                     onCreateOption={handleCreateTag}
//                     placeholder="აირჩიეთ თეგი (ებ)..."
//                     className="basic-multi-select w-full"
//                     classNamePrefix="select"
//                   />
//                   {errors.tags && (
//                     <span className="text-red-500 text-sm">{errors.tags}</span>
//                   )}
//                 </div>
//                 <div className="w-full flex justify-start items-center flex-col gap-4">
//                   <h1 className="text-start w-full  text-base font-semibold">
//                     აირჩიე ქალაქები
//                   </h1>
//                   <Select
//                     isMulti
//                     name="state"
//                     options={allStates}
//                     value={offerInfo.state}
//                     getOptionLabel={(option) => option.label}
//                     className="basic-multi-select w-full"
//                     classNamePrefix="select"
//                     onChange={handleStateChange}
//                     placeholder="აირჩიე ქალაქი (ები)..."
//                   />
//                   {errors.state && (
//                     <span className="text-red-500 text-sm">{errors.state}</span>
//                   )}
//                 </div>
//                 <div className="w-full flex justify-start items-center flex-col gap-4">
//                   <h1 className="text-start w-full  text-base font-semibold">
//                     ბმული
//                   </h1>
//                   <input
//                     type="text"
//                     name="url"
//                     value={offerInfo.url}
//                     placeholder="URL"
//                     onChange={handleChange}
//                     className="input input-bordered w-full mb-2 border-2 border-[#CED4DA] h-8 rounded-md pl-6"
//                   />
//                   {errors.url && (
//                     <span className="text-red-500 text-sm">{errors.url}</span>
//                   )}
//                 </div>
//                 <div className="flex flex-col justify-start items-start  md:w-[90%] w-full gap-4">
//                   <h1 className="text-start w-full  text-base font-semibold">
//                     მიუთითეთ კატეგორია
//                   </h1>
//                   <Select
//                     isMulti
//                     name="category"
//                     options={allCategories}
//                     value={offerInfo.category}
//                     onChange={handleCategoryChange}
//                     placeholder="კატეგორია"
//                     className="basic-multi-select w-full"
//                     classNamePrefix="select"
//                   />
//                   {errors.category && (
//                     <span className="text-red-500 text-sm">
//                       {errors.category}
//                     </span>
//                   )}
//                 </div>
//               </div>
//               <div className="flex justify-end items-center w-full gap-4">
//                 <button
//                   className="btn btn-primary mt-4 bg-[#DCEEF8] hover:bg-slate-200 text-[#9D9D9D] w-[156px] h-[46px]"
//                   onClick={() => navigate(-1)}
//                 >
//                   გაუქმება
//                 </button>
//                 <button
//                   className="btn btn-primary mt-4 bg-[#5E5FB2] hover:bg-slate-400 text-white w-[156px] h-[46px]"
//                   onClick={handleSubmit}
//                 >
//                   შესწორება
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ModifyOffers;

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import config from "../config";

function ModifyOffers() {
  const { userRole } = useAuth();
  const { offerId } = useParams();
  const fileInputRef = useRef(null);
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [offerInfo, setOfferInfo] = useState({
    title: "",
    description: "",
    category: [],
    url: "",
    tags: [],
    state: [],
  });
  const [offerImages, setOfferImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [states, setStates] = useState([]);
  const [tags, setTags] = useState([]);
  const [errors, setErrors] = useState({});
  const [allStates, setAllStates] = useState([]);
  const [visibleStates, setVisibleStates] = useState([]);

  const [allowWithoutDescription, setAllowWithoutDescription] = useState(false);
  const [allowWithoutUrl, setAllowWithoutUrl] = useState(false);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);

    const newFiles = files.filter(
      (file) =>
        !offerImages.some((existingFile) => existingFile.name === file.name)
    );
    const newImageUrls = newFiles.map((file) => URL.createObjectURL(file));

    setOfferImages((prevImages) => [...prevImages, ...newFiles]);
    setImagesPreview((prevUrls) => [...prevUrls, ...newImageUrls]);

    if (errors.offerImage) {
      setErrors((prevErrors) => ({ ...prevErrors, offerImage: undefined }));
    }
  };

  const handleImageDelete = (index) => {
    const newOfferImages = offerImages.filter((_, i) => i !== index);
    setOfferImages(newOfferImages);

    const newImagesPreview = imagesPreview.filter((_, i) => i !== index);
    setImagesPreview(newImagesPreview);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setOfferInfo((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
    }
  };

  const handleCreateTag = async (inputValue) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/data/tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: inputValue }),
      });

      if (!response.ok) {
        throw new Error("Failed to create tag");
      }

      const newTag = await response.json();
      setTags((prevTags) => [
        ...prevTags,
        { value: newTag._id, label: newTag.name },
      ]);
      setOfferInfo((prev) => ({
        ...prev,
        tags: [...prev.tags, { value: newTag._id, label: newTag.name }],
      }));
    } catch (error) {
      console.error("Error creating new tag:", error);
    }
  };

  const handleStateChange = (selectedOptions) => {
    const isSelectAll = selectedOptions.some(
      (option) => option.value === "all"
    );

    if (isSelectAll) {
      const allSelectedStates = allStates.filter(
        (option) => option.value !== "all"
      );
      setOfferInfo((prev) => ({
        ...prev,
        state: allSelectedStates,
      }));
    } else {
      setOfferInfo((prev) => ({
        ...prev,
        state: selectedOptions,
      }));
    }
  };

  const handleTagsChange = (selectedOptions) => {
    setOfferInfo((prev) => ({ ...prev, tags: selectedOptions || [] }));
  };

  const handleCategoryChange = (selectedOptions) => {
    setOfferInfo((prev) => ({ ...prev, category: selectedOptions || [] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!offerInfo.title) newErrors.title = "გთხოვ შეავსოთ დასახელება";
    if (!allowWithoutDescription && !offerInfo.description) {
      newErrors.description = "გთხოვ შეავსოთ პროდუქციის აღწერა";
    }
    if (!offerInfo.category.length) newErrors.category = "მიუთითეთ კატეგორია";
    if (!allowWithoutUrl && !offerInfo.url) {
      newErrors.url = "გთხოვ მიუთით მისამართი (url)";
    }
    if (
      allowWithoutDescription &&
      allowWithoutUrl &&
      (!offerInfo.description || !offerInfo.url)
    ) {
      newErrors.descriptionUrl =
        "შეთავაზება უნდა შეიცავდეს ან აღწერას ან URL-ს";
    }
    if (!offerInfo.tags.length) newErrors.tags = "გთხოვ მონიშნოთ თაგი(ები)";
    if (!offerInfo.state.length) newErrors.state = "გთხოვ მიუთითოთ ქალაქი";
    if (offerImages.length === 0 && imagesPreview.length === 0) {
      newErrors.offerImage = "გთხოვ ატვირთოთ სურათი";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    let updatedOfferInfo = { ...offerInfo };

    if (userRole === "brand") {
      updatedOfferInfo.status = "pending";
    }

    const formData = new FormData();

    formData.append("role", user.role);
    offerImages.forEach((file) => formData.append("images", file));

    Object.entries(updatedOfferInfo).forEach(([key, value]) => {
      if (key === "tags" || key === "state" || key === "category") {
        formData.append(key, JSON.stringify(value));
      } else if (Array.isArray(value)) {
        value.forEach((item) => formData.append(key, item));
      } else {
        formData.append(key, value);
      }
    });

    const token = localStorage.getItem("userToken");

    try {
      const response = await fetch(
        `${config.apiBaseUrl}/api/offers/${offerId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Error updating offer");
      }

      const updatedOffer = await response.json();
      navigate(`/offer-details/${offerId}`);
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
          `${config.apiBaseUrl}/api/data/categories`
        );
        const statesResponse = await fetch(
          `${config.apiBaseUrl}/api/data/states`
        );
        const tagsResponse = await fetch(`${config.apiBaseUrl}/api/data/tags`);

        const categoriesData = await categoriesResponse.json();
        const statesData = await statesResponse.json();
        const allStatesData = [
          { value: "all", label: "ყველას არჩევა" },
          ...statesData.map((state) => ({
            value: state._id,
            label: state.name,
          })),
        ];

        setAllStates(allStatesData);
        setVisibleStates(allStatesData);
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

  useEffect(() => {
    const fetchOfferDetails = async () => {
      if (allCategories.length > 0 && states.length > 0 && tags.length > 0) {
        try {
          const response = await fetch(
            `${config.apiBaseUrl}/api/offers/${offerId}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch offer details");
          }
          const offerDetails = await response.json();
          const offer = offerDetails.data;

          setOfferInfo((prev) => ({
            ...prev,
            title: offer.title,
            description: offer.description || "",
            category: offer.category.map(
              (catId) =>
                allCategories.find((cat) => cat.value === catId) || {
                  value: catId,
                  label: "Unknown Category",
                }
            ),
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
            url: offer.url || "",
          }));

          setAllowWithoutDescription(!offer.description);
          setAllowWithoutUrl(!offer.url);

          setImagesPreview(
            offer.imageUrls.map(
              (url) => `${config.apiBaseUrl}/${url.replace(/\\/g, "/")}`
            )
          );
        } catch (error) {
          console.error("Error fetching offer details:", error);
        }
      }
    };

    fetchOfferDetails();
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
          </div>

          <div className="flex flex-col w-full md:w-2/3 md:flex-row h-full md:mt-6 gap-4 p-4">
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
              ></textarea>
              {errors.description && (
                <span className="text-red-500 text-sm">
                  {errors.description}
                </span>
              )}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="allowWithoutDescription"
                  checked={allowWithoutDescription}
                  onChange={() =>
                    setAllowWithoutDescription(!allowWithoutDescription)
                  }
                />
                <label htmlFor="allowWithoutDescription" className="ml-2">
                  დამატება აღწერის გარეშე
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="allowWithoutUrl"
                  checked={allowWithoutUrl}
                  onChange={() => setAllowWithoutUrl(!allowWithoutUrl)}
                />
                <label htmlFor="allowWithoutUrl" className="ml-2">
                  დამატება URL-ის გარეშე
                </label>
              </div>
              {errors.descriptionUrl && (
                <span className="text-red-500 text-sm">
                  {errors.descriptionUrl}
                </span>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full flex justify-start items-center flex-col gap-4">
                  <h1 className="text-start w-full  text-base font-semibold">
                    მიუთითეთ თეგები
                  </h1>
                  <CreatableSelect
                    isMulti
                    name="tags"
                    options={tags}
                    value={offerInfo.tags}
                    onChange={handleTagsChange}
                    onCreateOption={handleCreateTag}
                    placeholder="აირჩიეთ თეგი (ებ)..."
                    className="basic-multi-select w-full"
                    classNamePrefix="select"
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
                    options={allStates}
                    value={offerInfo.state}
                    getOptionLabel={(option) => option.label}
                    className="basic-multi-select w-full"
                    classNamePrefix="select"
                    onChange={handleStateChange}
                    placeholder="აირჩიე ქალაქი (ები)..."
                  />
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
                    isMulti
                    name="category"
                    options={allCategories}
                    value={offerInfo.category}
                    onChange={handleCategoryChange}
                    placeholder="კატეგორია"
                    className="basic-multi-select w-full"
                    classNamePrefix="select"
                  />
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
