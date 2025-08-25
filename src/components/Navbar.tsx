import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/images/logo.png";
import { useState } from "react";

const Navbar = () => {
  const [language, setLanguage] = useState("Language");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // const handleLanguageChange = (lang: string) => {
  //   setLanguage(lang);
  // };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full z-50 bg-[#254336] h-16 shadow-md"
    >
      <div className="flex justify-between items-center h-full px-4">
        <div className="flex items-center gap-1">
          <motion.img
            className="h-20 mt-2"
            src={logo}
            alt="Logo"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
          <NavLink
            to="/"
            className="text-white text-xl"
          >
            Agrovision
          </NavLink>
        </div>

        <ul className="hidden md:flex gap-15">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "text-yellow-500 hover:text-yellow-600" : "text-white hover:text-gray-400"
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/info"
              className={({ isActive }) =>
                isActive ? "text-yellow-500 hover:text-yellow-600" : "text-white hover:text-gray-400"
              }
            >
              Info
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/ava"
              className={({ isActive }) =>
                isActive ? "text-yellow-500 hover:text-yellow-600" : "text-white hover:text-gray-400"
              }
            >
              AVA
            </NavLink>
          </li>
  <li>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "text-yellow-500 hover:text-yellow-600" : "text-white hover:text-gray-400"
              }
            >
              Login
            </NavLink>
          </li>
          {/* Language Dropdown */}
          <li className="relative cursor-pointer text-white">
            <div
              className="flex items-center gap-1 select-none"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              {language}
              <svg
                className={`w-5 h-5 transform transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""
                  }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {dropdownOpen && (
              <ul className="absolute top-full mt-2 left-0 w-40 bg-white text-black shadow-lg rounded-md z-20">
                {["English", "தமிழ்", "සිංහල"].map((lang) => (
                  <li
                    key={lang}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setLanguage(lang);
                      setDropdownOpen(false);
                    }}
                  >
                    {lang}
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </div>
    </motion.nav>
  );
};

export default Navbar;
