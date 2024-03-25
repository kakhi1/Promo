import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPasswordForm({ onBackToLoginClick }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const handleBackClick = () => {
    if (typeof onBackToLoginClick === "function") {
      onBackToLoginClick();
    } else {
      console.error("onBackToLoginClick is not a function");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Requesting password reset for:", email);

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      // Log or show success message based on this response

      // Call onBackToLoginClick to close the modal and potentially handle additional actions
      onBackToLoginClick();

      // Optionally reset the email state here if needed
      setEmail("");
    } catch (error) {
      console.error("Failed to request password reset:", error);
      // Handle error (show error message to user)
    }
  };
  return (
    <div className="container mx-auto px-10 mb-10 mt-4 rounded-3xl">
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
        <h2 className="text-xl mb-6 font-bold text-[32px] text-[#1D3557]">
          პაროლის განახლება
        </h2>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block">
            <span className="text-[#1D3557] font-medium text-xs">ელ-ფოსტა</span>
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg mb-4 mt-2"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#5E5FB2] hover:bg-blue-700 text-white py-2 rounded-lg"
        >
          <span className="font-medium text-base text-white">გაგზავნა</span>
        </button>

        {/* Back to Login */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => {
              console.log("Back to login from ForgotPasswordForm");
              onBackToLoginClick();
            }}
            className="w-full bg-white hover:bg-gray-200 text-base py-2 rounded-lg border-[#457B9D] border-[1px]"
          >
            დაბრუნება ავტორიაზაციაში
          </button>
        </div>
      </form>
    </div>
  );
}

export default ForgotPasswordForm;
