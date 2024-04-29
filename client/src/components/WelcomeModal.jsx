import React, { useState, useEffect } from "react";
import Modal from "./Modal"; // Assuming Modal is a pre-existing component for displaying modals
import { useAuth } from "../context/AuthContext";

function WelcomeModal({ isOpen, onClose, onSubmit, statesList }) {
  const [state, setState] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAuthenticated, token } = useAuth();
  const userId = user?.id || user?._id;
  console.log("userId", userId);
  console.log("token", token);
  useEffect(() => {
    if (isOpen) {
      const fetchStateByIP = async () => {
        try {
          const response = await fetch("https://ipapi.co/json/");
          const data = await response.json();
          const userState = statesList.find((s) => s.name === data.region);
          if (userState) {
            setState(userState.name);
          }
        } catch (error) {
          console.error("Error fetching state by IP:", error);
        }
      };

      fetchStateByIP();
    }
  }, [isOpen, statesList]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (state) {
      setIsSubmitting(true);
      await onSubmit(state);
      setIsSubmitting(false);
      // onClose();
      // Set flag in sessionStorage
      sessionStorage.setItem("loginOnReload", "true");

      // Trigger a reload
      window.location.reload();
    } else {
      alert("Please select your state.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => !isSubmitting && onClose()}>
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex items-center justify-center mb-10">
          <h1>გთხოვთ მიუთითოთ თქვენი ლოკაცია</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className=" border-black rounded-lg border-[1px] mt-4">
            <select
              className="w-full p-1"
              value={state}
              onChange={(e) => setState(e.target.value)}
            >
              <option value="">აირჩიეთ ქალაქი</option>
              {statesList.map((s) => (
                <option key={s._id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full flex items-center justify-center">
            <button
              className="w-full border-black border-[1px] rounded-lg mt-4"
              type="submit"
              disabled={isSubmitting}
            >
              დადასტურება
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default WelcomeModal;
