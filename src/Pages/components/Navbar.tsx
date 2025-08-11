import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../../assets/images/logo.png";
import { useState } from "react";

const Navbar = () => {
  const [language, setLanguage] = useState("Language");
  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="absolute top-0 left-0 w-full z-10 bg-[#254336] h-16"
    >
      <div className="flex justify-between items-center h-full px-4">
        <div className="flex items-center gap-4">
          <motion.img
            className="logo-img h-8"
            src={logo}
            alt="Logo"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
          <Link to="/" className="text-4xl primary-ff text-white">
            Agrovision
          </Link>
        </div>
        <ul className="hidden md:flex gap-16 text-white primary-ff ml-auto mr-7">
          <Link to="/" className="cursor-pointer hover:text-gray-400 text-3xl">
            Home
          </Link>
          <Link to="/info" className="cursor-pointer hover:text-gray-400 text-3xl">
            Info
          </Link>
          <Link to="/ava" className="cursor-pointer hover:text-gray-400 text-3xl">
            AVA
          </Link>
          <div className="relative group text-white text-3xl cursor-pointer">
            <div className="flex items-center gap-1 hover:text-gray-400">
              {language}
              <svg
                className="w-5 h-5 transform group-hover:rotate-180 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <ul className="absolute top-full mt-2 left-0 w-40 bg-white text-black shadow-lg rounded-md opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-opacity duration-300 z-20">
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleLanguageChange("English")}
              >
                English
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleLanguageChange("தமிழ்")}
              >
                தமிழ்
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleLanguageChange("සිංහල")}
              >
                සිංහල
              </li>
            </ul>
          </div>
        </ul>
      </div>
    </motion.div>
  );
};

export default Navbar;