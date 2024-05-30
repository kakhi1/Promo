import React, { useState, useEffect } from "react";
import Select from "react-select";
import config from "../config";
import { FaPlus, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Adbrands() {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Resetting error states before making the request
    setEmailError("");
    setNameError("");

    const formData = new FormData();
    Object.entries(brandInfo).forEach(([key, value]) => {
      if (key === "tags" || key === "state") {
        formData.append(key, JSON.stringify(value.map((v) => v.value)));
      } else if (key === "category") {
        formData.append(key, value.value);
      } else {
        formData.append(key, value);
      }
    });

    if (brandImage) {
      formData.append("image", brandImage);
    }

    console.log([...formData.entries()]);

    try {
      const response = await fetch(`${config.apiBaseUrl}/api/brands/create`, {
        method: "POST",
        body: formData,
        // Include headers if your backend expects Content-Type for form data
        // headers: { 'Content-Type': 'multipart/form-data' }, // Note: When using fetch with FormData, you don't need to set Content-Type header manually. It's set automatically.
      });

      const data = await response.json(); // Parse JSON response in any case to access the error message

      if (response.ok) {
        // Handle success scenario
        console.log(data);
        navigate("/"); // Redirect or handle the success response
      } else {
        // Handle errors based on the backend response
        if (data.message.includes("იმეილი")) {
          setEmailError(data.message);
        } else if (data.message.includes("სახელი")) {
          setNameError(data.message);
        }
        // Optionally, handle other kinds of errors
      }
    } catch (error) {
      console.error("Network error:", error);
      // Handle network errors or show a generic error message
    }
  };

  // Fetch categories, states, and tags from the backend
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
                  onChange={handleChange}
                  className="input input-bordered md:w-1/3 w-[220px] mb-2 border-2 border-[#CED4DA]  h-8 rounded-md pl-6"
                />
                {nameError && <div style={{ color: "red" }}>{nameError}</div>}
                <textarea
                  name="description"
                  placeholder="შეიყვანეთ ბრენდის აღწერა"
                  onChange={handleChange}
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
                  // onClick={handleCancel}
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
}

export default Adbrands;
