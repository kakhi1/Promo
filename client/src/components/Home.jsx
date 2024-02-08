import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container mx-auto">
      <h1>Welcome to Our MERN Project</h1>
      <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
    </div>
  );
}

export default Home;
