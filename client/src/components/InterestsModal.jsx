// import React, { useState } from "react";
// import Modal from "./Modal";
// import Select from "react-select";
// import axios from "axios";

// function InterestsModal({ isOpen, onClose, onSubmit, tagsList }) {
//   const [selectedTags, setSelectedTags] = useState([]);

//   // Convert tagsList to the format expected by react-select
//   const tagsOptions = tagsList.map((tag) => ({
//     value: tag._id,
//     label: tag.name,
//   }));

//   const handleTagsChange = (selectedOptions) => {
//     console.log("Selected tags:", selectedOptions);
//     setSelectedTags(selectedOptions || []);
//   };

//   const handleCreateTag = async (inputValue) => {
//     try {
//       const response = await axios.post("http://localhost:5000/api/data/tags", {
//         name: inputValue,
//       });
//       const newTag = response.data;
//       // This will only update the local component state. If you need to update the parent state,
//       // you should pass a function from the parent component to do so.
//       onSubmit([...tagsList, newTag]); // Assuming onSubmit updates the parent state
//       return newTag; // Return the new tag to be added to the selected options in the Select component
//     } catch (error) {
//       console.error("Error creating new tag:", error);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const tagsToSubmit = selectedTags.map((tag) => tag.value);
//     console.log("Tags to submit:", tagsToSubmit);

//     if (tagsToSubmit.length > 0) {
//       await onSubmit(tagsToSubmit); // Ensure this function is correctly receiving and processing the tags
//       if (typeof onClose === "function") {
//         onClose();
//       }
//     } else {
//       alert("Please select at least one tag");
//     }
//   };
//   return (
//     <Modal isOpen={isOpen}>
//       <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
//         <form onSubmit={handleSubmit}>
//           <Select
//             isMulti
//             name="tags"
//             options={tagsOptions}
//             className="basic-multi-select w-full"
//             classNamePrefix="select"
//             onChange={handleTagsChange}
//             placeholder="Select or add tags..."
//             onCreateOption={handleCreateTag}
//           />
//           <button type="submit" className="mt-2">
//             Submit
//           </button>
//         </form>
//       </div>
//     </Modal>
//   );
// }

// export default InterestsModal;

import React, { useState } from "react";
import Modal from "./Modal";
import CreatableSelect from "react-select/creatable";
import axios from "axios";

function InterestsModal({ isOpen, onClose, onSubmit, tagsList }) {
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTags, setNewTags] = useState([]);

  // This combines both existing and new tags for the select options
  const tagsOptions = [...tagsList, ...newTags].map((tag) => ({
    value: tag._id || tag.value, // Use _id for existing tags, value for new tags
    label: tag.name || tag.label, // Use name for existing tags, label for new tags
  }));

  const handleTagsChange = (selectedOptions) => {
    setSelectedTags(selectedOptions || []);
  };

  const handleCreateTag = (inputValue) => {
    const newTag = { value: inputValue, label: inputValue, isNew: true };
    setNewTags((prevNewTags) => [...prevNewTags, newTag]);
    setSelectedTags((prevSelectedTags) => [...prevSelectedTags, newTag]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTagsToCreate = selectedTags.filter((tag) => tag.isNew);
    const existingTags = selectedTags.filter((tag) => !tag.isNew);

    for (const tag of newTagsToCreate) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/data/tags",
          {
            name: tag.label,
          }
        );
        const createdTag = response.data;
        existingTags.push({ value: createdTag._id, label: createdTag.name });
      } catch (error) {
        console.error("Error creating new tag:", error);
      }
    }

    const tagsToSubmit = existingTags.map((tag) => tag.value);
    console.log("Tags to submit:", tagsToSubmit);

    await onSubmit(tagsToSubmit);
    if (typeof onClose === "function") {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen}>
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full ">
        <div className="mb-3 flex justify-center items-center">
          <h1>ინტერესი</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <CreatableSelect
            isMulti
            name="tags"
            options={tagsOptions}
            value={selectedTags}
            className="basic-multi-select w-full"
            classNamePrefix="select"
            onChange={handleTagsChange}
            placeholder="Select or add tags..."
            onCreateOption={handleCreateTag}
          />
          <div className="w-full flex items-center justify-center">
            <button
              className="w-40 border-black  border-[1px] rounded-lg mt-4"
              type="submit"
            >
              გადასვლა
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default InterestsModal;
