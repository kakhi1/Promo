import React, { useState } from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Modal from "./Modal";
import FooterLoginForm from "./FooterLoginForm";

const Footer = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { login } = useAuth();
  const [loginError, setLoginError] = useState("");
  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false); // Close the modal on successful login
  };
  const handleLogin = async (email, password) => {
    try {
      const response = await fetch(
        "https://promo-iror.onrender.com/api/users/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Incorrect email or password"); // Triggers the catch block
      }

      const data = await response.json();
      login({ ...data.entity, token: data.token });
      navigate(data.entity.role === "admin" ? "/admin-area" : "/brand-area");
      setIsLoginModalOpen(false);
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("გთხოვთ შეიყვანოთ სწორი მაილი ან პაროლი");
    }
  };
  return (
    <footer className="bg-[#17b978] text-productBg">
      <div className=" pt-4 px-4 text-base font-normal">
        <div className="flex md:flex-row flex-col md:w-full justify-around items-center md:items-start  mr-10 ">
          <div className=" w-[60%] md:w-1/4">
            <div className=" hidden md:flex title-font font-medium items-center  mb-4 md:mb-0">
              <img src={logo} alt="Logo" className="h-10" />
            </div>
            <h3 className="mt-2">იპოვე შეადარე დაზოგე </h3>
          </div>
          <div className="w-[60%] md:w-1/4 ">
            <Link
              to="/about"
              className=""
              // onClick={onCategoriesClick}
            >
              შესახებ
            </Link>
            <h3 className=""> წესები და პირობები</h3>
            <h3 className="">კონფიდენციალობის პოლიტიკა</h3>
          </div>
          <div className="w-[60%] md:w-1/4 flex  flex-col items-start h-full">
            <h3 className=""> პარტნიორებისთვის</h3>
            <button onClick={() => setIsLoginModalOpen(true)} className="">
              შესვლა
            </button>

            {isLoginModalOpen && (
              <Modal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
              >
                <FooterLoginForm onLoginSuccess={handleLoginSuccess} />
                {loginError && <p className="text-red-500">{loginError}</p>}
              </Modal>
            )}
          </div>
          <div className="w-[60%] md:w-1/4">
            <h3 className="">
              იმეილი: promo246810@gmail.com <br />
              ტელეფონი: +995 500 000 000
            </h3>
          </div>
        </div>
        <div className=" p-2 text-center font-normal text-base mt-4  md:2">
          <p>&copy; {new Date().getFullYear()} ყველა უფლება დაცულია</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
