import React, { useState, useEffect } from "react";
import Select from "react-select";
import { FaPlus, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ModifyBrands = () => {
  const { id } = useParams(); // Extracting `id` from the URL
  const isUpdateMode = id !== undefined;
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [brandImage, setBrandImage] = useState(null);
  const [brandInfo, setBrandInfo] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    description: "",
    tags: [],
    category: "",
    url: "",
    state: [],
  });
  const [image, setImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [states, setStates] = useState([]);
  const [tags, setTags] = useState([]);

  // Function to fetch brand by ID

  console.log("BrandIfo", brandInfo);

  const mapBrandDetailsToState = (brand) => {
    const mappedCategory =
      allCategories.find((cat) => cat.value === brand.category) || null;
    const mappedTags = brand.tags.map(
      (tagId) => tags.find((tag) => tag.value === tagId) || null
    );
    const mappedStates = brand.state.map(
      (stateId) => states.find((st) => st.value === stateId) || null
    );
    const imageUrl = brand.imageUrl.startsWith("http")
      ? brand.imageUrl
      : `http://localhost:5000${brand.imageUrl.startsWith("/") ? "" : "/"}${
          brand.imageUrl
        }`;
    console.log("imageUrl", imageUrl);
    setBrandInfo({
      name: brand.name,
      email: brand.email,
      description: brand.description,
      tags: mappedTags,
      category: mappedCategory,
      url: brand.url,
      state: mappedStates,
      imageUrl: imageUrl,
    });
  };

  // Function to fetch brand by ID and map details
  const fetchBrandById = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/brands/${id}`);
      if (!response.ok) throw new Error("Failed to fetch brand data");
      const brand = await response.json();
      if (brand.imageUrl) {
        // Check if imageUrl starts with 'http', use as is, otherwise, prepend your server's base URL
        const imageUrl = brand.imageUrl.startsWith("http")
          ? brand.imageUrl
          : `http://localhost:5000${brand.imageUrl.startsWith("/") ? "" : "/"}${
              brand.imageUrl
            }`;
        setImage(imageUrl); // For displaying the existing image in the preview

        // Update brandInfo state with the fetched brand details
        // Here, just the relative path or identifier is stored in brandInfo
        setBrandInfo((prev) => ({ ...prev, imageUrl: brand.imageUrl }));
      }

      mapBrandDetailsToState(brand);
    } catch (error) {
      console.error("Error fetching brand details:", error);
    }
  };

  // Fetch brand data when component mounts or when id changes
  useEffect(() => {
    if (isUpdateMode) {
      fetchBrandById();
    }
  }, [id, isUpdateMode, allCategories, tags, states]);

  useEffect(() => {
    // Fetch Categories
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/data/categories"
        );
        const data = await response.json();

        if (response.ok) {
          setAllCategories(
            data.map((cat) => ({ value: cat._id, label: cat.name }))
          );
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    console.log(brandInfo.category);

    // Fetch States
    const fetchStates = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/data/states");
        const data = await response.json();
        if (response.ok) {
          setStates(
            data.map((state) => ({ value: state._id, label: state.name }))
          );
        } else {
          console.error("Failed to fetch states");
        }
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };

    // Fetch Tags
    const fetchTags = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/data/tags");
        const data = await response.json();
        if (response.ok) {
          setTags(data.map((tag) => ({ value: tag._id, label: tag.name })));
        } else {
          console.error("Failed to fetch tags");
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchCategories();
    fetchStates();
    fetchTags();

    if (isUpdateMode) {
      // Fetch existing brand data for update
      const fetchBrandById = async () => {
        const response = await fetch(`http://localhost:5000/api/brands/${id}`);
        const data = await response.json();
        if (response.ok) {
          setBrandInfo({
            name: data.name,
            email: data.email,
            description: data.description,
            tags: data.tags.map((t) => ({ value: t._id, label: t.name })),
            category: { value: data.category._id, label: data.category.name },
            url: data.url,
            state: data.state.map((s) => ({ value: s._id, label: s.name })),
          });
          if (data.image) {
            setImage(`PathToYourImages/${data.image}`); // Adjust based on your setup
          }
        }
      };
      fetchBrandById();
    }
  }, [id, isUpdateMode]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setBrandImage(file);
    setImage(URL.createObjectURL(file));
  };

  const handleImageDelete = () => {
    setBrandImage(null);
    setImage(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setBrandInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleStateChange = (selectedOption) => {
    setBrandInfo((prev) => ({ ...prev, state: selectedOption }));
  };
  const handleCategoryChange = (selectedOption) => {
    setBrandInfo((prev) => ({
      ...prev,
      category: selectedOption || "", // Adjust based on your state structure
    }));
  };

  const handleTagsChange = (selectedOptions) => {
    setBrandInfo((prevState) => ({
      ...prevState,
      tags: selectedOptions || [], // Ensure it's always an array
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Fetch categories, states, and tags from the backend

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Assuming setEmailError and setNameError are methods to set error messages in your component's state
    setEmailError("");
    setNameError("");

    const formData = new FormData();
    // Object.entries(brandInfo).forEach(([key, value]) => {
    //   if (key === "tags" || key === "state") {
    //     formData.append(key, JSON.stringify(value.map((v) => v.value)));
    //   } else if (key === "category") {
    //     formData.append(key, value.value);
    //   } else {
    //     formData.append(key, value);
    //   }
    // });
    Object.entries(brandInfo).forEach(([key, value]) => {
      if (key === "tags" || key === "state") {
        formData.append(key, JSON.stringify(value.map((v) => v.value)));
      } else if (key === "category") {
        formData.append(key, value.value);
      } else if (key === "imageUrl") {
        // Assuming the imageUrl in brandInfo is the full URL, extract the path part
        let imagePath = new URL(value).pathname; // Extracts the path part
        // Remove the leading "/" if it exists
        imagePath = imagePath.startsWith("/")
          ? imagePath.substring(1)
          : imagePath;
        formData.append(key, imagePath);
      } else {
        formData.append(key, value);
      }
    });

    if (brandImage) {
      formData.append("image", brandImage);
    }

    const endpoint = `http://localhost:5000/api/brands/update/${id}`;
    const method = "PUT";

    try {
      const response = await fetch(endpoint, {
        method: method,
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Brand updated successfully:", data);
        // Navigate to a success page, or perhaps to the brand's detail view
        navigate(`/brands/detail/${id}`); // Adjust based on your actual route
      } else {
        // Dynamically handle errors based on the response
        if (data.errors) {
          // Assume errors is an array of error objects
          data.errors.forEach((error) => {
            if (error.param === "email") setEmailError(error.msg);
            if (error.param === "name") setNameError(error.msg);
          });
        } else {
          console.error("Server error:", data.message);
          // Optionally, display this error message to the user
        }
      }
    } catch (error) {
      console.error("Network error:", error);
      // Optionally, update UI to inform the user that a network error has occurred
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
  console.log("brandinfoo in addbrand", brandInfo);

  return (
    <div className="flex ">
      {" "}
      <div className="flex items-center flex-col justify-between h-full w-full ">
        <h1 className="text-start w-full md:ml-24 ml-8 text-base font-semibold md:mt-10">
          ახალი ბრენდის დამატება
        </h1>
        <div className="flex md:flex-row flex-col justify-between md:h-full  w-full md:pt-10 pt-4">
          {/* first columm */}
          <div className="md:w-1/3 w-full h-full flex flex-col items-start  justify-start gap-10 md:ml-10 md:mt-10 ml-4">
            {/* image upload and preview logic here */}
            <div
              onClick={() => document.getElementById("imageUpload").click()}
              className="cursor-pointer md:w-2/3 w-[93%]  h-[250px]  flex justify-center items-center flex-col bg-productBg text-[#5E5FB2]"
              style={{ fontSize: "16px" }}
            >
              <FaPlus size={24} color="#5E5FB2" />
              <p>სურათის ატვირთვა</p>
            </div>
            <input
              type="file"
              id="imageUpload"
              multiple
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
            <form
              className="flex flex-col gap-4 text-[#6C757D] text-xs "
              onSubmit={handleSubmit}
            >
              <input
                className="border-2 border-[#CED4DA] w-[220px] h-8 rounded-md pl-6"
                type="email "
                name="email"
                placeholder="მეილი"
                onChange={handleChange}
              />
              {emailError && <div style={{ color: "red" }}>{emailError} </div>}

              {/* Password input with visibility toggle */}
              <div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  className="border-2 border-[#CED4DA] w-[220px] h-8 rounded-md pl-6"
                />
                <button onClick={togglePasswordVisibility}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {/* Confirm Password input with visibility toggle */}
              <div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  onChange={handleChange}
                  className="border-2 border-[#CED4DA] w-[220px] h-8 rounded-md pl-6"
                />
                <button onClick={togglePasswordVisibility}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </form>
          </div>
          {/* Second columm  */}
          <div className="flex flex-col w-full md:w-2/3 md:flex-row h-full md:mt-6 gap-4 p-4">
            <div className=" flex flex-col gap-4 w-full">
              <div className="md:w-[90%] w-full ">
                <input
                  type="text"
                  name="name"
                  placeholder="დასახელება"
                  value={brandInfo.name}
                  onChange={handleChange}
                  className="input input-bordered md:w-1/3 w-[220px] mb-2 border-2 border-[#CED4DA]  h-8 rounded-md pl-6"
                />
                {nameError && <div style={{ color: "red" }}>{nameError}</div>}
                <textarea
                  name="description"
                  placeholder="შეიყვანეთ ბრენდის აღწერა"
                  onChange={handleChange}
                  value={brandInfo.description}
                  className="textarea textarea-bordered w-full h-32 mb-2 border-2 border-[#CED4DA]  rounded-md p-6"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:w-[90%] w-full">
                <div className="w-full flex justify-start items-center flex-col gap-4">
                  <h1 className="text-start w-full  text-base font-semibold">
                    მიუთითეთ თეგები
                  </h1>
                  <Select
                    isMulti
                    name="tags"
                    options={tags}
                    value={brandInfo.tags}
                    className="basic-multi-select w-full"
                    classNamePrefix="select"
                    onChange={handleTagsChange}
                    placeholder="აირჩიეთ თეგი (ები)..."
                  />
                </div>
                <div className="w-full flex justify-start items-center flex-col gap-4">
                  <h1 className="text-start w-full  text-base font-semibold">
                    შიპინგის ქალაქები
                  </h1>
                  <Select
                    isMulti
                    name="state"
                    options={states}
                    value={brandInfo.state}
                    className="basic-multi-select w-full"
                    classNamePrefix="select"
                    onChange={handleStateChange}
                    placeholder="აირჩიე ქალაქი (ები)..."
                  />
                </div>
                <div className="w-full flex justify-start items-center flex-col gap-4">
                  <h1 className="text-start w-full  text-base font-semibold">
                    ბმული
                  </h1>

                  <input
                    type="text"
                    name="url"
                    placeholder="URL"
                    value={brandInfo.url}
                    onChange={handleChange}
                    className="input input-bordered w-full mb-2 border-2 border-[#CED4DA]  h-8 rounded-md pl-6"
                  />
                </div>
              </div>
              <div className="flex flex-col justify-start items-start  md:w-[90%] w-full gap-4">
                <h1 className="text-start w-full  text-base font-semibold">
                  მიუთითეთ კატეგორია
                </h1>
                <Select
                  name="category"
                  options={allCategories} // Make sure allCategories is correctly formatted for react-select
                  value={brandInfo.category} // Ensure this is compatible with react-select's expected value format
                  onChange={handleCategoryChange}
                  className="input input-bordered  border-2 border-[#CED4DA] h-8 rounded-md   md:w-[49%] w-full"
                  classNamePrefix="select"
                  placeholder="კატეგორია"
                />
              </div>
              <div className="flex justify-between items-start md:w-[44%] w-full gap-4 ">
                <button
                  type="submit"
                  onClick={() => navigate(-1)}
                  className="btn btn-primary mt-4 text-xs font-normal bg-[#DCEEF8] lg:hover:bg-slate-200 text-[#9D9D9D] w-[156px] h-[46px]"
                >
                  გაუქმება
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="btn btn-primary mt-4 bg-[#5E5FB2] lg:hover:bg-slate-400 text-xs font-normal text-white w-[156px] h-[46px]"
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
};

export default ModifyBrands;
