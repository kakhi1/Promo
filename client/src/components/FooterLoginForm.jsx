import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function FooterLoginForm({ onLoginSuccess, onLoginError }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(""); // State for login error messages
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError(""); // Clear any previous login errors

    try {
      const response = await fetch(
        "https://promo-iror.onrender.com/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        throw new Error("შეამოწმეთ პაროლი ან მომხმარებელი ");
      }

      const data = await response.json();

      // Check if the user has an 'admin' or 'brand' role
      if (
        data.entity &&
        (data.entity.role === "admin" || data.entity.role === "brand")
      ) {
        login({ ...data.entity, token: data.token }); // Perform login action
        onLoginSuccess();
        // Redirect based on user role
        navigate(data.entity.role === "admin" ? "/admin-area" : "/brand-area");
      } else {
        // Set an error message if the user is not an admin or brand
        throw new Error(
          "მხოლო ბრენდის ან ადმინის პრივილეგიების მქონეს შეუძლია შესვლა"
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(error.message || "Login failed");
    }
  };

  return (
    <div className="container mx-auto px-4 py-2 rounded-lg">
      <form
        onSubmit={handleSubmit}
        className="text-xl mb-6 font-bold text-[32px] text-[#1D3557]"
      >
        <h2 className="text-xl mb-6 font-bold text-[32px] text-[#1D3557]">
          ავტორიზაცია
        </h2>

        {loginError && <div className="text-red-500 mb-4">{loginError}</div>}

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
            className="w-full px-3 py-2 border rounded mb-4"
          />
        </div>

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
            className="w-full px-3 py-2 border rounded mb-4"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-white hover:bg-gray-200 text-base py-2 rounded-lg border-[#457B9D] border-[1px]"
        >
          დარეგისტრირდი
        </button>
      </form>
    </div>
  );
}

export default FooterLoginForm;
