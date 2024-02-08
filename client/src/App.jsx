// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Brands from "./components/Brands";
import Categories from "./components/Categories";
import About from "./components/About";
import "./index.css"; // Assuming Tailwind CSS is imported here

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="py-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/about" element={<About />} />
            {/* Define more routes as needed */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
