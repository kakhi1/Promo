import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { HiOutlineBars3 } from "react-icons/hi2"; // Corrected import
import { RiShoppingCart2Line } from "react-icons/ri";
import { CiCircleInfo } from "react-icons/ci";
import { LuUser } from "react-icons/lu";
import { BsXSquare } from "react-icons/bs";

function Header({ onLoginClick }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  // Function to close the mobile menu
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-Bgcolor text-productBg w-full">
      <div className="flex justify-between p-5 items-center w-full">
        {/* Logo always visible */}
        <Link
          to="/"
          className="flex title-font font-medium items-center text-white mb-4 md:mb-0"
        >
          <img src={logo} alt="Logo" className="h-10" />
        </Link>

        {/* Hamburger Menu Icon for mobile */}
        <HiOutlineBars3
          className={`text-white cursor-pointer md:hidden ${
            isMobileMenuOpen ? "hidden" : "block"
          }`}
          size={30}
          onClick={toggleMobileMenu}
        />

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-2 right-0 w-[60%] bg-Bgcolor p-5 md:hidden z-50">
            <div className="flex justify-end">
              {/* Close Icon at the top right of the mobile menu */}
              <BsXSquare
                className="text-white"
                size={30}
                onClick={toggleMobileMenu} // This will close the menu
              />
            </div>
            <nav className="flex flex-col items-center mt-4">
              <Link
                to="/brands"
                className="hover:text-white p-2"
                onClick={toggleMobileMenu}
              >
                ბრენდი
              </Link>
              <Link
                to="/categories"
                className="hover:text-white p-2"
                onClick={toggleMobileMenu}
              >
                კატეგორიები
              </Link>
              <Link
                to="/about"
                className="hover:text-white p-2"
                onClick={toggleMobileMenu}
              >
                შესახებ
              </Link>
              {/* <Link
                to="/login"
                className="hover:text-white p-2"
                // onClick={toggleMobileMenu}
                onClick={() => {
                  onLoginClick();
                  toggleMobileMenu();
                }}
              >
                შესვლა
              </Link> */}
              <button
                className="hover:text-white p-2"
                onClick={() => {
                  onLoginClick(); // Open the login modal
                  toggleMobileMenu(); // Optionally, close the mobile menu if open
                }}
              >
                შესვლა
              </button>
            </nav>
          </div>
        )}

        {/* Desktop Menu including search bar */}
        <div className="hidden md:flex w-2/3 justify-end items-center">
          {/* Search Bar */}
          <div className="md:ml-auto md:mr-3 hidden md:block">
            <div className="relative">
              <input
                className="w-full rounded-2xl md:w-64 px-4 py-1 pl-10 border border-productBg bg-Bgcolor text-productBg placeholder-productBg text-sm font-normal"
                placeholder="ძებნა..."
              />
              <svg
                className="absolute right-4 bottom-[6px] text-productBg"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: "20px", height: "20px" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 15l5.79 5.79"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 17a7 7 0 100-14 7 7 0 000 14z"
                />
              </svg>
            </div>
          </div>
          <nav className="flex items-center md:ml-10 lg:text-sm text-xs w-full justify-around ">
            <Link
              to="/brands"
              className=" hover:text-white flex-col items-center justify-center"
            >
              <RiShoppingCart2Line
                size={25}
                color="#DCEEF8"
                className="w-full flex items-center"
              />
              <span>ბრენდი</span>
            </Link>
            <Link to="/categories" className=" hover:text-white">
              <HiOutlineBars3
                size={25}
                color="#DCEEF8"
                className="w-full flex items-center"
              />
              <span>კატეგორიები</span>
            </Link>
            <Link to="/about" className=" hover:text-white">
              <CiCircleInfo
                size={25}
                color="#DCEEF8"
                className="w-full flex items-center"
              />
              <span>შესახებ</span>
            </Link>
            {/* Sign In Button */}
            {/* <Link
              to="/login"
              className="inline-flex items-center border justify-center gap-4 focus:outline-none rounded-2xl lg:text-sm mt-4 md:mt-0 h-10 w-32 border-productBg"
            >
              <LuUser size={20} color="#DCEEF8" />
              <span> შესვლა</span>{" "}
            </Link> */}
            <button
              className="hover:text-white p-2 inline-flex items-center border justify-center gap-4 focus:outline-none rounded-2xl lg:text-sm mt-4 md:mt-0 h-10 w-32 border-productBg"
              onClick={() => {
                onLoginClick(); // Open the login modal
                toggleMobileMenu(); // Optionally, close the mobile menu if open
              }}
            >
              <LuUser size={20} color="#DCEEF8" />
              <span> შესვლა</span>{" "}
            </button>
          </nav>

          {/* Navigation Links */}
        </div>
      </div>
    </header>
  );
}
export default Header;
