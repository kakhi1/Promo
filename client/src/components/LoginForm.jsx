import React, { useState } from "react";

function LoginForm({ onForgotPasswordClick, onRegisterClick }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Login Form", { email, password, rememberMe });
    // Here you would typically handle the login logic, possibly sending the data to a backend server
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
