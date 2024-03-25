// export default WelcomeModal;
import React, { useState } from "react";
import Modal from "./Modal"; // Import your Modal component

function WelcomeModal({ isOpen, onClose, onSubmit, statesList }) {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [state, setState] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (age && gender && state) {
      await onSubmit(age, gender, state);
      // onClose(); // Close the modal only after successful submission
    } else {
      alert("gგთხოვთ შეავსოტ ყველა ველი");
    }
  };

  return (
    <Modal isOpen={isOpen}>
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full ">
        <div className="flex items-center justify-center mb-10">
          <h1>პროფილი</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex gap-2">
            {" "}
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="ასაკი"
              className="border-black  border-[1px] rounded-lg p-1 w-[50%]"
            />
            <select
              className="border-black  border-[1px] rounded-lg p-1 w-[50%]"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">სქესი</option>
              <option value="Male">კაცი</option>
              <option value="Female">ქალი</option>
            </select>
          </div>
          <div className="w-full border-black  border-[1px] rounded-lg mt-4">
            {" "}
            <select
              className="w-[98%] m-1"
              value={state}
              onChange={(e) => setState(e.target.value)}
            >
              <option value="">ქალაქი</option>
              {statesList.map((state) => (
                <option key={state._id} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full flex items-center justify-center">
            <button
              className="w-full border-black  border-[1px] rounded-lg mt-4"
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

export default WelcomeModal;
