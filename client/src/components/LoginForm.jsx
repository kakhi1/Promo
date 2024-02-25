import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function LoginForm({ onForgotPasswordClick, onRegisterClick }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Login Form", { email, password, rememberMe });
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      console.log("Login response data:", data);

      // Assuming the structure is { message: '', entity: { role: '' }, token: '' }
      // Adjusting access to the role based on the corrected structure
      console.log("User role:", data.entity.role);
      console.log("data.entity:", data.entity);

      if (data.entity) {
        login({ ...data.entity, token: data.token }); // Handle user context or state update with login data

        // Store the token and brandId in localStorage
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("brandId", data.entity.brand); // Always store brandId on successful login

        console.log("Token and brandId saved:", data.token, data.entity.brand);
        // Correct redirection based on the role
        switch (data.entity.role) {
          case "admin":
            navigate("/admin-area"); // Redirect to admin page
            break;
          case "brand":
            navigate("/brand-area"); // Redirect to brand page, if applicable
            break;
          default:
            navigate("/user-area"); // Redirect to regular user page
            break;
        }
      } else {
        console.error("Entity data is missing from login response");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      // Optionally handle the login error, such as displaying an error message to the user
    }
  };
  const handleForgotPassword = () => {
    console.log("Forgot Password Clicked");
    onForgotPasswordClick(); // This should be a function passed down as a prop that handles forgot password action
  };

  const handleRegistrationRedirect = () => {
    console.log("Redirect to Registration");
    onRegisterClick(); // Ensure this is linked to toggle the registration modal in App.jsx
  };

  return (
    <div className="container mx-auto px-10 mb-10 mt-4 rounded-3xl">
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
        <h2 className="text-xl mb-6 font-bold text-[32px] text-[#1D3557]">
          ავტორიზაცია
        </h2>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block">
            <span className="text-[#1D3557] font-medium text-xs">
              ელ-ფოსტა{" "}
            </span>
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

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block">
            <span className="text-[#1D3557] font-medium text-xs ">პაროლი</span>
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg mb-4 mt-2"
          />
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex justify-between items-center mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2"
            />
            <span className="text-[#1D3557] font-medium text-xs">
              პაროლის დამახსოვრება
            </span>
          </label>

          {/* Forgot Password Link */}
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-[#E63946] hover:text-red-800 font-normal text-xs"
          >
            დაგავიწყდა პაროლი?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#5E5FB2] hover:bg-blue-700 text-white py-2 rounded-lg"
        >
          <span className="font-medium text-base text-white">შესვლა</span>
        </button>
        {/* Divider with Text */}
        <div className="flex items-center justify-between mt-4">
          <hr className="w-full" />
          <span className="px-2 text-[#D9D9D9] text-xs font-medium">ან</span>
          <hr className="w-full" />
        </div>

        {/* Registration Redirect */}
        <div className="mt-4">
          <button
            type="button"
            onClick={handleRegistrationRedirect}
            className="w-full bg-white hover:bg-gray-200 text-base py-2 rounded-lg border-[#457B9D] border-[1px]"
          >
            დარეგისტრირდი
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
