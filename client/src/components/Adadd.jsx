import React, { useState } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdAdd = () => {
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    pages: [],
    endDate: "",
    imageUrlDesktop: null,
    imageUrlMobile: null,
  });
  const [desktopImagePreview, setDesktopImagePreview] = useState("");
  const [mobileImagePreview, setMobileImagePreview] = useState("");
  const navigate = useNavigate();
  const handleDesktopImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setDesktopImagePreview(imageUrl);
      setFormData({ ...formData, imageUrlDesktop: file }); // Update formData with the file
    }
  };

  const handleMobileImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setMobileImagePreview(imageUrl);
      setFormData({ ...formData, imageUrlMobile: file }); // Update formData with the file
    }
  };

  const handleDeleteDesktopImage = () => {
    // Remove the preview
    setDesktopImagePreview("");
    // Clear the file from formData
    setFormData({ ...formData, imageUrlDesktop: null });
    // Optionally, revoke the URL to free up memory
    if (formData.imageUrlDesktop) URL.revokeObjectURL(formData.imageUrlDesktop);
  };

  const handleDeleteMobileImage = () => {
    // Remove the preview
    setMobileImagePreview("");
    // Clear the file from formData
    setFormData({ ...formData, imageUrlMobile: null });
    // Optionally, revoke the URL to free up memory
    if (formData.imageUrlMobile) URL.revokeObjectURL(formData.imageUrlMobile);
  };

  // Handle form input changes
  const handleChange = (e) => {
    let value;
    const { name, type } = e.target;

    if (type === "file") {
      value = e.target.files[0];
    } else if (e.target.multiple) {
      value = [...e.target.selectedOptions].map((option) => option.value);
    } else {
      value = e.target.value;
    }

    setFormData({ ...formData, [name]: value });
  };
  const handlePageChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      // Add the value to the array if checked
      setFormData({ ...formData, pages: [...formData.pages, value] });
    } else {
      // Remove the value from the array if unchecked
      setFormData({
        ...formData,
        pages: formData.pages.filter((page) => page !== value),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    // Append image files under their expected field names
    if (formData.imageUrlDesktop) {
      data.append("desktopImage", formData.imageUrlDesktop); // Ensure field name matches backend expectation
    }
    if (formData.imageUrlMobile) {
      data.append("mobileImage", formData.imageUrlMobile); // Ensure field name matches backend expectation
    }

    // Append other data fields, excluding image fields to avoid duplication
    Object.keys(formData).forEach((key) => {
      if (!["imageUrlDesktop", "imageUrlMobile"].includes(key)) {
        // Special handling for 'pages' to ensure it's sent in a format the backend expects
        if (key === "pages") {
          // If the backend can parse JSON strings, use JSON.stringify
          // Otherwise, comment this line out if using the individual item approach
          data.append(key, JSON.stringify(formData[key]));
        } else {
          // Append other form data fields directly
          data.append(key, formData[key]);
        }
      }
    });

    try {
      await axios.post("https://promo-iror.onrender.com/api/ads", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate(-1);
      // Handle success (e.g., clear form, show message)
    } catch (error) {
      // Handle error (e.g., show error message)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pl-4">
      <h1 className="text-start w-full  text-base font-semibold pt-4 ">
        ახალი რეკლამის დამატება
      </h1>
      <div className="flex  md:flex-row flex-col gap-20">
        <div className="md:w-1/2 w-full flex gap-4  ">
          <div className="flex-col w-2/3 gap-4 pb">
            {" "}
            <h1 class="text-base font-normal mb-2 ml-1">
              <span class="hidden md:block">დესკტოპის ვერსია</span>
              <span class="block md:hidden">დესკტოპი</span>
            </h1>
            <div className="flex gap-4 ">
              <div
                onClick={() =>
                  document.getElementById("desktopImageUpload").click()
                }
                className="cursor-pointer relative h-[250px] w-full flex justify-center items-center flex-col bg-productBg "
              >
                {desktopImagePreview ? (
                  <>
                    <img
                      src={desktopImagePreview}
                      alt="Desktop version"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDesktopImage();
                      }}
                      className="absolute top-0 right-0 m-2 text-white bg-red-500 p-1 rounded-full"
                    >
                      წაშლა
                    </button>
                  </>
                ) : (
                  <div
                    onClick={() =>
                      document.getElementById("desktopImageUpload").click()
                    }
                    className="flex items-center justify-center cursor-pointer text-sm gap-4 flex-col text-[#5E5FB2]"
                  >
                    <FaPlus size={24} color="#5E5FB2" />
                    <p>დამატება</p>
                  </div>
                )}
                <input
                  type="file"
                  id="desktopImageUpload"
                  style={{ display: "none" }}
                  onChange={handleDesktopImageUpload}
                />
              </div>
            </div>
          </div>
          <div className="flex-col w-1/3 gap-4">
            {" "}
            <h1 class="text-base font-normal mb-2 ml-1">
              <span class="hidden lg:block">მობილურის ვერსია</span>
              <span class="block lg:hidden">მობილური</span>
            </h1>
            <div
              onClick={() =>
                document.getElementById("mobileImageUpload").click()
              }
              className="cursor-pointer relative h-[250px] flex justify-center items-center flex-col  bg-productBg "
            >
              {mobileImagePreview ? (
                <>
                  <img
                    src={mobileImagePreview}
                    alt="mobile version"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // This stops the click event from reaching the parent div
                      handleDeleteMobileImage();
                    }}
                    className="absolute top-0 right-0 m-2 text-white bg-red-500 p-1 z-30 rounded-full"
                  >
                    წაშლა
                  </button>
                </>
              ) : (
                <div
                  onClick={() =>
                    document.getElementById("mobileImageUpload").click()
                  }
                  className="flex items-center justify-center cursor-pointer text-sm gap-4 flex-col text-[#5E5FB2]"
                >
                  <FaPlus size={24} color="#5E5FB2" />
                  <p>დამატება</p>
                </div>
              )}
              <input
                type="file"
                id="mobileImageUpload"
                style={{ display: "none" }}
                onChange={handleMobileImageUpload}
              />
            </div>
          </div>
        </div>
        <div className="md:w-1/2 w-full flex flex-col gap-4">
          <input
            type="text"
            name="title"
            placeholder="დასახელება"
            value={formData.title}
            onChange={handleChange}
            className="input input-bordered w-[60%]  mb-2 border-2 border-[#CED4DA] h-8 rounded-md pl-6"
          />
          <h1 className="text-xl font-medium">ბმული</h1>
          <input
            type="text"
            name="link"
            placeholder="URL"
            value={formData.link}
            onChange={handleChange}
            className="input input-bordered w-[80%] mb-2 border-2 border-[#CED4DA] h-8 rounded-md pl-6"
          />
          <fieldset>
            <legend className="text-xl font-medium mb-2">
              სამიზნე გვერდები
            </legend>
            <div className="flex flex-wrap">
              {["home", "brand", "userarea"].map((page) => (
                <label key={page} className="flex items-center mr-4">
                  <input
                    type="checkbox"
                    value={page.toLowerCase()}
                    checked={formData.pages.includes(page.toLowerCase())}
                    onChange={handlePageChange}
                    className="mr-2"
                  />
                  {page}
                </label>
              ))}
            </div>
          </fieldset>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="my-4 w-[80%]"
          />
        </div>
      </div>
      <div className="flex justify-end items-center w-[95%] gap-4">
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
    </form>
  );
};

export default AdAdd;
