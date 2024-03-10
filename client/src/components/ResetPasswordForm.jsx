import React, { useState } from "react";
import axios from "axios"; // Ensure axios is installed
import { useNavigate } from "react-router-dom";

function ResetPasswordForm({ token, onClose }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    setError(""); // Clear any previous errors
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswords()) return;

    try {
      // Append the resetPasswordToken to the URL
      const url = `http://localhost:5000/api/users/reset-password/${token}`;
      const response = await axios.post(url, { password }); // Assuming the backend expects { password } in the body

      setSuccess("Your password has been reset successfully.");
      // Clear form fields
      setPassword("");
      setConfirmPassword("");
      // Handle post-reset actions here, like closing the form or redirecting the user
    } catch (err) {
      // It's a good practice to log or display more specific error information if available
      setError("Failed to reset password. Please try again.");
      console.error("Error resetting password:", err);
    }
  };
  return (
    <div className="container mx-auto px-4 py-8 max-w-md rounded-lg shadow">
      <form onSubmit={handleSubmit}>
        <h2 className="text-xl mb-4 font-bold text-blue-700">შეცვალე პაროლი</h2>

        {error && <div className="text-red-500 mb-3">{error}</div>}
        {success && <div className="text-green-500 mb-3">{success}</div>}

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            ახალი პაროლი
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            შეიყვანე ახალი პაროლი
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          პაროლის შეცვლა
        </button>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-3 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          მთავარ გვერდზე დაბრუნება
        </button>
      </form>
    </div>
  );
}

export default ResetPasswordForm;
