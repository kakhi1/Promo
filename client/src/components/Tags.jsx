import React, { useState, useEffect } from "react";
function Tags({ onTagSelect }) {
  // Receive onSelectTag as a prop and rename it to onTagSelect
  const [tags, setTags] = useState([]);
  const [selectedTagId, setSelectedTagId] = useState(null);
  const [selectedTag, setSelectedTag] = useState("");

  const handleSelectTag = (tag) => {
    setSelectedTag(tag.name); // Assuming each tag has a 'name' property
    // Perform any additional actions needed upon selecting a tag
    onTagSelect(tag); // Use the prop function onTagSelect to pass the selected tag up to the parent component
  };

  useEffect(() => {
    fetch("https://promo-iror.onrender.com/api/data/tags")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setTags(data);
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  }, []);

  return (
    <div className="md:w-4/5 w-full mx-auto bg-white text-black overflow-x-auto overflow-y-hidden">
      <div className="flex space-x-2 my-4">
        <ul className="flex flex-nowrap">
          {tags.map((tag) => (
            <li
              key={tag._id}
              onClick={() => handleSelectTag(tag)}
              className={`cursor-pointer px-4 py-2 border border-gray-300 ${
                selectedTagId === tag._id
                  ? "bg-gray-200"
                  : "bg-gray-100 hover:bg-gray-200"
              } transition-colors duration-300 whitespace-nowrap`}
            >
              {tag.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Tags;
