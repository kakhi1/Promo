import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import config from "../config";
import CreatableSelect from "react-select/creatable";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Adoffers() {
  const fileInputRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [brandId, setBrandId] = useState(null);
  const [offerImage, setOfferImage] = useState(null);

  const [offerInfo, setOfferInfo] = useState({
    title: "",
    description: "",
    category: [],
    url: "",
    tags: [],
    state: [],
    originalPrice: "",
    discountPrice: "",
    numberField: "",
  });
  const [image, setImage] = useState(null);
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
      setVisibleStates(allSelectedStates);
    } else {
      setOfferInfo((prev) => ({
        ...prev,
        state: selectedOptions,
      }));
      setVisibleStates(selectedOptions);
    }
  };

  const handleCategoryChange = (selectedOptions) => {
    setOfferInfo((prev) => ({
      ...prev,
      category: selectedOptions || [],
    }));
  };

  const handleTagsChange = async (selectedOptions, actionMeta) => {
    if (actionMeta.action === "create-option") {
      const newTagName = actionMeta.option.value;
      try {
        const response = await fetch(`${config.apiBaseUrl}/api/data/tags`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newTagName }),
        });

        if (!response.ok) {
          throw new Error("Failed to create tag");
        }

        const newTag = await response.json();
        selectedOptions[selectedOptions.length - 1] = {
          value: newTag._id,
          label: newTag.name,
        };
        setTags((prevTags) => [
          ...prevTags,
          { value: newTag._id, label: newTag.name },
        ]);
      } catch (error) {
        console.error("Error adding tag:", error);
      }
    }

    setOfferInfo((prev) => ({ ...prev, tags: selectedOptions || [] }));
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
    if (offerImages.length === 0)
      newErrors.offerImage = "გთხოვ ატვირთოთ სურათი";
    if (
      offerInfo.numberField &&
      (offerInfo.numberField < 1 || offerInfo.numberField > 100)
    ) {
      newErrors.numberField = "გთხოვ მიუთითოთ რიცხვი 1-დან 100-მდე";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const formData = new FormData();

    offerImages.forEach((file) => {
      formData.append("images", file);
    });
    formData.append("brand", user.brand);

    Object.entries(offerInfo).forEach(([key, value]) => {
      if (key === "originalPrice" || key === "discountPrice") {
        if (value) {
          formData.append(key, value);
        }
      } else {
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, item.value || item));
        } else {
          formData.append(key, value);
        }
      }
    });

    try {
      const response = await fetch(`${config.apiBaseUrl}/api/offers`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(
          "Server responded with an error: " + response.statusText
        );
      }

      const data = await response.json();

      navigate("/");
    } catch (error) {
      console.error("Submission error:", error);
      setErrors({ general: "A network error occurred. Please try again." });
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

  return (
    <div className="flex">
      <div className="flex items-center flex-col justify-between h-full w-full">
        <h1 className="text-start w-full md:ml-24 ml-8 text-base font-semibold pt-4">
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
              <div className="w-full md:w-[50%] flex justify-start items-center flex-col gap-4">
                <h1 className="text-start w-full text-base font-semibold">
                  ფასდაკლების რაოდენობა პროცენტებში
                </h1>
                <input
                  type="number"
                  name="numberField"
                  placeholder="%"
                  value={offerInfo.numberField}
                  onChange={handleChange}
                  className="input input-bordered w-full mb-2 border-2 border-[#CED4DA] h-8 rounded-md pl-6"
                  min="1"
                  max="100"
                />
                {errors.numberField && (
                  <span className="text-red-500 text-sm">
                    {errors.numberField}
                  </span>
                )}
              </div>

              {errors.descriptionUrl && (
                <span className="text-red-500 text-sm">
                  {errors.descriptionUrl}
                </span>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full flex justify-start items-center flex-col gap-4">
                  <h1 className="text-start w-full text-base font-semibold">
                    მიუთითეთ თეგები
                  </h1>
                  <CreatableSelect
                    isMulti
                    name="tags"
                    options={tags}
                    className="basic-multi-select w-full"
                    classNamePrefix="select"
                    onChange={handleTagsChange}
                    placeholder="აირჩიეთ თეგი (ები)..."
                  />
                  {errors.tags && (
                    <span className="text-red-500 text-sm">{errors.tags}</span>
                  )}
                </div>
                <div className="w-full flex justify-start items-center flex-col gap-4">
                  <h1 className="text-start w-full text-base font-semibold">
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
                  <h1 className="text-start w-full text-base font-semibold">
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
                <div className="w-full flex justify-start items-center flex-col gap-4">
                  <h1 className="text-start w-full text-base font-semibold">
                    მიუთითეთ კატეგორია
                  </h1>
                  <Select
                    isMulti
                    name="category"
                    options={allCategories}
                    className="basic-multi-select w-full"
                    classNamePrefix="select"
                    onChange={handleCategoryChange}
                    placeholder="კატეგორია"
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
