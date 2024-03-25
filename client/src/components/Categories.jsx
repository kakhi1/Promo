import React, { useState, useEffect } from "react";

function Categories({ onSelectCategory }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleSelectCategory = (category) => {
    setSelectedCategory(category.name);
    setCurrentPage(1); // Reset pagination to the first page
    // Optionally, you might want to clear out the current brands list here
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/data/categories")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  }, []);

  return (
    <div
      className="categories-container"
      style={{ maxHeight: "400px", overflowY: "scroll" }}
    >
      <h2 className=" flex items-center my-4 ml-4">კატეგორიები</h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {categories.map((category) => (
          <li
            key={category._id}
            onClick={() => onSelectCategory(category)}
            style={{
              cursor: "pointer",
              padding: "10px",
              borderBottom: "1px solid #ccc",
              background: "#f9f9f9",
              ":hover": {
                background: "#e2e2e2",
              },
            }}
          >
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Categories;
