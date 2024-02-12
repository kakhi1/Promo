import React, { useState } from "react";

function RegisterForm({ onRegisterSuccess }) {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeToTerms) {
      alert("You must agree to the terms and conditions to register.");
      return;
    }
    try {
      // API call to backend
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, lastName, email, mobile, password }),
      });

      if (response.ok) {
        // Handle registration success
        console.log("Registration successful");
        onRegisterSuccess(); // Placeholder for success callback
      } else {
        // Handle registration failure
        const errorData = await response.json();
        alert(`Failed to register: ${errorData.message}`);
      }
    } catch (error) {
      console.error(`Failed to register: ${error.toString()}`);
      alert(`Failed to register: ${error.toString()}`);
    }
  };

  return (
    <div className="container mx-auto px-10 mb-10 mt-4 rounded-3xl">
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
