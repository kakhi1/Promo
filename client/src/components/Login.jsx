// import React, { useState } from "react";
// // Assuming useNavigate for redirecting after successful login or for registration link
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [rememberMe, setRememberMe] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle login logic here
//     console.log({ email, password, rememberMe });
//     // Example: navigate to homepage after login
//     // navigate('/');
//   };

//   const handleRegistrationRedirect = () => {
//     // Redirect to registration page
//     navigate("/register");
//   };

//   const handleForgotPassword = () => {
//     // Redirect to forgot password page or handle action
//     navigate("/forgot-password");
//   };

//   return (
//     <div className="container mx-auto px-4 mt-8">
//       <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
//         <h2 className="text-xl mb-4">რეგისტრაცია</h2>

//         {/* Email Field */}
//         <label htmlFor="email" className="block">
//           ელ-ფოსტა
//         </label>
//         <input
//           type="email"
//           id="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           className="w-full px-3 py-2 border rounded mb-4"
//         />

//         {/* Password Field */}
//         <label htmlFor="password" className="block">
//           პაროლი
//         </label>
//         <input
//           type="password"
//           id="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           className="w-full px-3 py-2 border rounded mb-4"
//         />

//         {/* Remember Me Checkbox */}
//         <div className="flex justify-between items-center mb-4">
//           <label className="flex items-center">
//             <input
//               type="checkbox"
//               checked={rememberMe}
//               onChange={(e) => setRememberMe(e.target.checked)}
//               className="mr-2"
//             />
//             პაროლის დამახსოვრება
//           </label>

//           {/* Forgot Password Link */}
//           <button
//             type="button"
//             onClick={handleForgotPassword}
//             className="text-red-600 hover:text-red-800"
//           >
//             დაგავიწყდა პაროლი?
//           </button>
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="w-full bg-blue-500 hover:bg-blue-700 text-white py-2 rounded"
//         >
//           შესვლა
//         </button>

//         {/* Registration Redirect */}
//         <button
//           type="button"
//           onClick={handleRegistrationRedirect}
//           className="w-full bg-green-500 hover:bg-green-700 text-white py-2 rounded mt-4"
//         >
//           დარეგისტრირდი
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;
