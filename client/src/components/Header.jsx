import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { HiOutlineBars3 } from "react-icons/hi2"; // Corrected import
import { RiShoppingCart2Line } from "react-icons/ri";
import { CiCircleInfo } from "react-icons/ci";
import { LuUser } from "react-icons/lu";
import { BsXSquare } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { BiChevronDown } from "react-icons/bi";
import { useAuth } from "../context/AuthContext";

function Header({ onLoginClick, onCategoriesClick, onLogoClick, onSearch }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate("/"); // Adjust as needed
  };
  const navigateToUserArea = () => {
    navigate("/user-area"); // Update with your actual route
    setIsMobileMenuOpen(false); // Close mobile menu if open
  };
  return (
    <header className="bg-Bgcolor text-productBg w-full">
      <div className="flex justify-between p-5 items-center w-full">
        {/* Logo always visible */}
        <Link
          onClick={onLogoClick}
          to="/"
          className="flex title-font font-medium items-center text-white mb-4 md:mb-0 w-1/4"
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
          <div className="absolute top-0 right-0 w-[60%] bg-Bgcolor p-5 md:hidden z-50">
            <div className="flex justify-end">
              {/* Close Icon */}
              <BsXSquare
                className="text-white"
                size={30}
                onClick={toggleMobileMenu}
              />
            </div>
            <nav className="flex flex-col items-center mt-4">
              {/* Navigation Links */}
              <Link
                to="/brands"
                className="text-white p-2"
                onClick={toggleMobileMenu}
              >
                ბრენდი
              </Link>
              <Link
                to="/categories"
                className="text-white p-2"
                // onClick={onCategoriesClick}
              >
                კატეგორიები
              </Link>
              <Link
                to="/about"
                className="text-white p-2"
                onClick={toggleMobileMenu}
              >
                შესახებ
              </Link>
              {user && (
                <Link
                  to="/user-area" // Adjust the route as needed
                  className="text-white p-2"
                  onClick={navigateToUserArea} // Ensures mobile menu closes upon navigation
                >
                  მომხმარებელი
                </Link>
              )}

              {/* Dynamic Authentication Button */}
              {user ? (
                <button
                  className="text-white p-2"
                  onClick={() => {
                    handleLogout(); // Ensure this also closes the mobile menu as needed
                    toggleMobileMenu(); // Optionally close the menu right after logging out
                  }}
                >
                  გამოსვლა
                </button>
              ) : (
                <Link
                  to="/login"
                  className="text-white p-2"
                  value={searchQuery}
                  onClick={() => onLoginClick && onLoginClick()}
                >
                  შესვლა
                </Link>
              )}
            </nav>
          </div>
        )}

        {/* Desktop Menu including search bar */}
        <div className="hidden md:flex w-3/4 justify-end  items-center">
          {/* Search Bar */}
          <div className="md:ml-auto md:mr-3 hidden md:block h-[40px]">
            <div className="relative h-full ">
              <input
                onChange={(e) => onSearch(e.target.value)}
                className="w-full rounded-2xl md:w-64 px-4 py-1 pl-10 border border-productBg bg-Bgcolor text-productBg placeholder-productBg text-sm font-normal h-full"
                placeholder="ძებნა..."
              />
              <svg
                className="absolute right-4 bottom-[8px] text-productBg"
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
            <Link
              to="/categories"
              // onClick={onCategoriesClick}
              className=" hover:text-white"
            >
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
            {/* Conditional rendering for User Area Link/Button */}
            {user && (
              <Link
                to="/user-area" // Adjust the route as needed
                className="hover:text-white flex-col items-center justify-center"
                onClick={navigateToUserArea} // This ensures the mobile menu closes if this function is used there
              >
                <LuUser
                  size={25}
                  color="#DCEEF8"
                  className="w-full flex items-center"
                />
                <span>მომხმარებელი</span>
              </Link>
            )}

            {user ? (
              <div className="relative">
                <div
                  className="flex items-center cursor-pointer "
                  onClick={toggleDropdown}
                >
                  <div className="w-32 border border-productBg inline-flex items-center justify-center gap-2 rounded-2xl ">
                    <LuUser size={20} color="#DCEEF8" />
                    <span className="hover:text-white p-2 focus:outline-none flex items-center justify-center text-sm h-10 ">
                      {user.name}
                    </span>
                    <BiChevronDown className="hover:text-white" size={20} />
                  </div>
                </div>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 py-2 bg-white rounded-md shadow-xl z-20">
                    <button
                      className="text-sm text-gray-700 hover:bg-gray-100 px-4 py-2 block"
                      onClick={handleLogout}
                    >
                      გამოსვლა
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="hover:text-white p-2 inline-flex items-center justify-center gap-4 focus:outline-none rounded-2xl text-sm h-10 w-32 border border-productBg"
                onClick={() => onLoginClick && onLoginClick()} // Ensure onLoginClick is called correctly
              >
                <LuUser size={20} color="#DCEEF8" />
                <span>შესვლა</span>
              </button>
            )}
          </nav>

          {/* Navigation Links */}
        </div>
      </div>
    </header>
  );
}
export default Header;
