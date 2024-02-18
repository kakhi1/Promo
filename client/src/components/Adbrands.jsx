// import React, { useState } from "react";
// import Select from "react-select";
// import { FaPlus } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// const georgianStates = [
//   { value: "Tbilisi", label: "Tbilisi" },
//   { value: "Kutaisi", label: "Kutaisi" },
//   // Convert the rest of your states to this format
// ];
// const tagOptions = [
//   { value: "technique", label: "technique" },
//   { value: "furniture", label: "furniture" },
//   // Convert the rest of your states to this format
// ];

// function Adbrands() {
//   const navigate = useNavigate();
//   const [brandImage, setBrandImage] = useState(null);
//   const [brandInfo, setBrandInfo] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     description: "",
//     tags: [],
//     category: "",
//     url: "",
//     state: [],
//   });
//   const [image, setImage] = useState(null);

//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     setBrandImage(file);
//     setImage(URL.createObjectURL(file));
//   };

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setBrandInfo((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleStateChange = (selectedOption) => {
//     setBrandInfo((prev) => ({ ...prev, state: selectedOption }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     Object.entries(brandInfo).forEach(([key, value]) => {
//       if (key === "tags" || key === "state") {
//         formData.append(key, JSON.stringify(value.map((v) => v.value)));
//       } else {
//         formData.append(key, value);
//       }
//     });
//     if (brandImage) {
//       formData.append("image", brandImage);
//     }

//     try {
//       const response = await fetch("http://localhost:5000/brands/create", {
//         method: "POST",
//         body: formData,
//       });
//       if (!response.ok)
//         throw new Error(`HTTP error! status: ${response.status}`);
//       const data = await response.json();
//       console.log(data);
//       navigate("/success");
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };
//   const handleTagsChange = (selectedOptions) => {
//     setBrandInfo((prevState) => ({
//       ...prevState,
//       tags: selectedOptions || [], // Ensure it's always an array
//     }));
//   };
//   return (
//     <div className="flex  md:h-screen h-full">
//       {" "}
//       <div className="flex items-center flex-col justify-between h-full w-full ">
//         <h1 className="text-start w-full md:ml-24 ml-8 text-base font-semibold md:mt-10">
//           ახალი ბრენდის დამატება
//         </h1>
//         <div className="flex md:flex-row flex-col justify-between md:h-full  w-full md:pt-10 pt-4">
//           {/* first columm */}
//           <div className="md:w-1/3 w-full md:h-full flex flex-col items-start  justify-start gap-10 md:ml-10 md:mt-10 ml-4">
//             {/* image upload and preview logic here */}
//             <div
//               onClick={() => document.getElementById("imageUpload").click()}
//               className="cursor-pointer md:w-2/3 w-[93%] md:h-1/3 h-[250px]  flex justify-center items-center flex-col bg-productBg text-[#5E5FB2]"
//               style={{ fontSize: "16px" }}
//             >
//               <FaPlus size={24} color="#5E5FB2" />
//               <p>სურათის ატვირთვა</p>
//             </div>
//             <input
//               type="file"
//               id="imageUpload"
//               style={{ display: "none" }}
//               onChange={handleImageUpload}
//             />
//             {image && (
//               <img
//                 src={image}
//                 alt="Uploaded"
//                 style={{ width: "100px", height: "100px" }}
//               />
//             )}
//             <form
//               className="flex flex-col gap-4 text-[#6C757D] text-xs "
//               onSubmit={handleSubmit}
//             >
//               <input
//                 className="border-2 border-[#CED4DA] w-[220px] h-8 rounded-md pl-6"
//                 type="email "
//                 name="email"
//                 placeholder="მეილი"
//                 onChange={handleChange}
//               />
//               <input
//                 className="border-2 border-[#CED4DA] w-[220px] h-8 rounded-md pl-6"
//                 type="password"
//                 name="password"
//                 placeholder="პაროლი"
//                 onChange={handleChange}
//               />
//               <input
//                 className="border-2 border-[#CED4DA] w-[220px] h-8 rounded-md pl-6"
//                 type="confirmPassword"
//                 name="confirmPassword"
//                 placeholder="გაიმეორე პაროლი"
//                 onChange={handleChange}
//               />
//             </form>
//           </div>
//           {/* Second columm  */}
//           <div className="flex flex-col w-full md:w-2/3 md:flex-row h-full md:mt-6 gap-4 p-4">
//             <div className=" flex flex-col gap-4 w-full">
//               <div className="md:w-[90%] w-full ">
//                 <input
//                   type="text"
//                   name="name"
//                   placeholder="დასახელება"
//                   onChange={handleChange}
//                   className="input input-bordered md:w-1/3 w-[220px] mb-2 border-2 border-[#CED4DA]  h-8 rounded-md pl-6"
//                 />
//                 <textarea
//                   name="description"
//                   placeholder="შეიყვანეთ ბრენდის აღწერა"
//                   onChange={handleChange}
//                   className="textarea textarea-bordered w-full h-32 mb-2 border-2 border-[#CED4DA]  rounded-md p-6"
//                 ></textarea>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:w-[90%] w-full">
//                 <div className="w-full flex justify-start items-center flex-col gap-4">
//                   <h1 className="text-start w-full  text-base font-semibold">
//                     მიუთითეთ თეგები
//                   </h1>
//                   <Select
//                     isMulti
//                     name="tag"
//                     options={tagOptions}
//                     value={brandInfo.tags}
//                     className="basic-multi-select w-full"
//                     classNamePrefix="select"
//                     onChange={handleTagsChange}
//                     placeholder="აირჩიეთ თეგი..."
//                   />
//                 </div>
//                 <div className="w-full flex justify-start items-center flex-col gap-4">
//                   <h1 className="text-start w-full  text-base font-semibold">
//                     შიპინგის ქალაქები
//                   </h1>
//                   <Select
//                     isMulti
//                     name="state"
//                     options={georgianStates}
//                     className="basic-multi-select w-full"
//                     classNamePrefix="select"
//                     onChange={handleStateChange}
//                     placeholder="აირჩიე ქალაქი (ები)..."
//                   />
//                 </div>
//                 <div className="w-full flex justify-start items-center flex-col gap-4">
//                   <h1 className="text-start w-full  text-base font-semibold">
//                     ბმული
//                   </h1>
//                   <input
//                     type="text"
//                     name="url"
//                     placeholder="URL"
//                     onChange={handleChange}
//                     className="input input-bordered w-full mb-2 border-2 border-[#CED4DA]  h-8 rounded-md pl-6"
//                   />
//                 </div>
//               </div>
//               <div className="flex flex-col justify-start items-start  md:w-[90%] w-full gap-4 ">
//                 <h1 className="text-start w-full  text-base font-semibold">
//                   მიუთითეთ კატეგორია
//                 </h1>

//                 <input
//                   type="text"
//                   name="category"
//                   placeholder="კატეგორია"
//                   onChange={handleChange}
//                   className="input input-bordered  border-2 border-[#CED4DA] h-8 rounded-md pl-4  md:w-[49%] w-full"
//                 />
//               </div>
//               <div className="flex justify-between items-start md:w-[44%] w-full gap-4 ">
//                 <button
//                   type="submit"
//                   // onClick={handleCancel}
//                   className="btn btn-primary mt-4 text-xs font-normal bg-[#DCEEF8] lg:hover:bg-slate-200 text-[#9D9D9D] w-[156px] h-[46px]"
//                 >
//                   გაუქმება
//                 </button>
//                 <button
//                   type="submit"
//                   onClick={handleSubmit}
//                   className="btn btn-primary mt-4 bg-[#5E5FB2] lg:hover:bg-slate-400 text-xs font-normal text-white w-[156px] h-[46px]"
//                 >
//                   გამოქვეყნება
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Adbrands;

import React, { useState } from "react";
import Select from "react-select";
import { FaPlus, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const georgianStates = [
  { value: "Tbilisi", label: "Tbilisi" },
  { value: "Kutaisi", label: "Kutaisi" },
  // Continue with your states
];

const tagOptions = [
  { value: "technique", label: "technique" },
  { value: "furniture", label: "furniture" },
  // Continue with your tags
];

const categoryOptions = [
  { value: "electronics", label: "Electronics" },
  { value: "fashion", label: "Fashion" },
  // Add more categories as needed
];

function Adbrands() {
  const navigate = useNavigate();
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
    setBrandInfo((prev) => ({ ...prev, category: selectedOption }));
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
    const formData = new FormData();
    Object.entries(brandInfo).forEach(([key, value]) => {
      if (key === "tags" || key === "state") {
        formData.append(key, JSON.stringify(value.map((v) => v.value)));
      } else if (key !== "category") {
        // Exclude category for special handling
        formData.append(key, value);
      }
    });
    // Handle category separately to maintain its structure for the backend
    if (brandInfo.category) {
      formData.append("category", JSON.stringify(brandInfo.category.value));
    }
    if (brandImage) {
      formData.append("image", brandImage);
    }

    try {
      const response = await fetch("http://localhost:5000/brands/create", {
        method: "POST",
        body: formData,
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      console.log(data);
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex  md:h-screen h-full">
      {" "}
      <div className="flex items-center flex-col justify-between h-full w-full ">
        <h1 className="text-start w-full md:ml-24 ml-8 text-base font-semibold md:mt-10">
          ახალი ბრენდის დამატება
        </h1>
        <div className="flex md:flex-row flex-col justify-between md:h-full  w-full md:pt-10 pt-4">
          {/* first columm */}
          <div className="md:w-1/3 w-full md:h-full flex flex-col items-start  justify-start gap-10 md:ml-10 md:mt-10 ml-4">
            {/* image upload and preview logic here */}
            <div
              onClick={() => document.getElementById("imageUpload").click()}
              className="cursor-pointer md:w-2/3 w-[93%] md:h-1/3 h-[250px]  flex justify-center items-center flex-col bg-productBg text-[#5E5FB2]"
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
                    name="tag"
                    options={tagOptions}
                    value={brandInfo.tags}
                    className="basic-multi-select w-full"
                    classNamePrefix="select"
                    onChange={handleTagsChange}
                    placeholder="აირჩიეთ თეგი..."
                  />
                </div>
                <div className="w-full flex justify-start items-center flex-col gap-4">
                  <h1 className="text-start w-full  text-base font-semibold">
                    შიპინგის ქალაქები
                  </h1>
                  <Select
                    isMulti
                    name="state"
                    options={georgianStates}
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
              <div className="flex flex-col justify-start items-start  md:w-[90%] w-full gap-4 ">
                <h1 className="text-start w-full  text-base font-semibold">
                  მიუთითეთ კატეგორია
                </h1>

                <input
                  type="text"
                  options={categoryOptions}
                  name="category"
                  placeholder="კატეგორია"
                  onChange={handleCategoryChange}
                  className="input input-bordered  border-2 border-[#CED4DA] h-8 rounded-md pl-4  md:w-[49%] w-full"
                  value={brandInfo.category}
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
