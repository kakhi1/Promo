import React, { useState, useEffect } from "react";
const Tags = () => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    // Replace 'http://localhost:5000/api/categories' with the actual endpoint from which you are fetching the categories
    fetch("http://localhost:5000/api/data/tags")
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
  const onSelectTag = (tag) => {
    // Assuming each tag has a unique ID that can be used as a reference
    document.getElementById(tag._id).scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  return (
    <div
      className="tags-container w-full ml-24 "
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
        overflowX: "auto",
        maxHeight: "100px",
        maxWidth: "80%",
        whiteSpace: "nowrap",
      }}
    >
      <ul
        style={{
          listStyleType: "none",
          padding: 0,
          margin: 0,
          display: "flex",
        }}
      >
        {tags.map((tag) => (
          <li
            key={tag._id}
            onClick={() => onSelectTag(tag)}
            style={{
              cursor: "pointer",
              padding: "10px",

              ":hover": { background: "#ffffffff" },
            }}
          >
            {tag.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tags;
