import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import config from "../config";
function RegisterForm() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const [userIP, setUserIP] = useState("");
  useEffect(() => {
    // Fetch the user's IP address
    axios
      .get("https://api.ipify.org?format=json")
      .then((response) => {
        setUserIP(response.data.ip); // Store the IP address in state
        // Check if this IP has an associated state from previous visits
        checkGuestUser(response.data.ip);
        console.log("User IP:", response.data.ip);
      })
      .catch((err) => console.error("Error fetching IP address:", err));

    // Other initial data fetching
  }, []);

  const checkGuestUser = (ip) => {
    axios
      .get(`${config.apiBaseUrl}/api/check-modal/${ip}`)
      .then((response) => {
        setIsWelcomeModalOpen(response.data.showModal);
        // Handle other actions based on the guest user check
      })
      .catch((err) => console.error("Error checking guest user:", err));
  };

  const fetchStateByIpAddress = async (ipAddress) => {
    try {
      const response = await axios.get(
        `${config.apiBaseUrl}/api/state/${ipAddress}`
      );
      if (response.status === 200) {
        console.log(
          "State fetched for IP:",
          ipAddress,
          "State:",
          response.data.state
        );
        return response.data.state; // Adjust according to your API response structure
      } else {
        throw new Error("Could not fetch state for IP address.");
      }
    } catch (error) {
      console.error("Error fetching state by IP address:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeToTerms) {
      alert("You must agree to the terms and conditions to register.");
      return;
    }
    const state = await fetchStateByIpAddress(userIP);
    try {
      // Adjusted to match the expected API payload
      const payload = {
        name, // Assuming 'name' is correctly mapped
        username: lastName, // Assuming 'lastName' field should actually be 'username'
        email,
        mobile,
        password,
        state,
      };
      console.log(payload);
      const response = await fetch(`${config.apiBaseUrl}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        login(data);
        console.log("Registration successful", data);
        // onRegisterSuccess();

        navigate("/user-area");
      } else {
        const errorData = await response.json();
        alert(`Failed to register: ${errorData.message}`);
      }
    } catch (error) {
      console.error(`Failed to register: ${error.toString()}`);
      alert(`Failed to register: ${error.toString()}`);
    }
  };
  return (
    <div className="container rounded-3xl">
      <form
        onSubmit={handleSubmit}
        className="max-w-sm mx-auto bg-white p-6 rounded-md"
      >
        <h2 className="text-xl mb-6 font-bold text-start text-[#1D3557]">
          რეგისტრაცია
        </h2>

        <div className="flex gap-4 mb-4">
          {/* Name Field */}
          <div className="flex-1">
            <label
              htmlFor="name"
              className="block text-xs font-medium text-[#1D3557]"
            >
              სახელი
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded mt-2"
            />
          </div>

          {/* Last Name Field */}
          <div className="flex-1">
            <label
              htmlFor="lastName"
              className="block text-xs font-medium text-[#1D3557]"
            >
              გვარი
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded mt-2"
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-xs font-medium text-[#1D3557]"
          >
            ელ-ფოსტა
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded mt-2"
          />
        </div>

        {/* Mobile Field */}
        <div className="mb-4">
          <label
            htmlFor="mobile"
            className="block text-xs font-medium text-[#1D3557]"
          >
            მობილური (+995)
          </label>
          <input
            type="tel"
            id="mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
            pattern="\+995[0-9]{9}"
            placeholder="+995"
            className="w-full px-3 py-2 border rounded mt-2"
          />
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-xs font-medium text-[#1D3557]"
          >
            პაროლი
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded mt-2"
          />
        </div>
        {/* Terms and Conditions Checkbox */}
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="form-checkbox"
            />
            <span className="ml-2 text-xs font-medium text-[#457B9D]">
              ვეთანხმები წესებს და პირობებს
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#5E5FB2] hover:bg-blue-700 text-white py-2 text-base rounded-lg"
        >
          რეგისტრაცია
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;
