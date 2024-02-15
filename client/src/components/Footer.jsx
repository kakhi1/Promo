import React from "react";
import logo from "../assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-Bgcolor text-productBg">
      <div className=" pt-4 px-4 text-base font-normal">
        <div className="flex md:flex-row flex-col md:w-full justify-around items-center md:items-start  mr-10 ">
          <div className=" w-[60%] md:w-1/4">
            <div className=" hidden md:flex title-font font-medium items-center  mb-4 md:mb-0">
              <img src={logo} alt="Logo" className="h-10" />
            </div>
            <h3 className="mt-2">პრომო - სლოგანის ადგილი</h3>
          </div>
          <div className="w-[60%] md:w-1/4 ">
            <h3 className=""> შესახებ</h3>
            <h3 className=""> წესები და პირობები</h3>
            <h3 className="">კონფიდენციალობის პოლიტიკა</h3>
          </div>
          <div className="w-[60%] md:w-1/4 flex  flex-col items-start h-full">
            <h3 className=""> პარტნიორებისთვის</h3>
            <h3 className="">შესვლა</h3>
          </div>
          <div className="w-[60%] md:w-1/4">
            <h3 className="">
              იმეილი: mail@mail.com <br />
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
