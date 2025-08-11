import backgroundVideo from '../assets/videos/main.mp4';
import { motion, useAnimation } from "framer-motion";
import { useNavigate } from "react-router-dom";
import '../index.css'
import { useEffect } from 'react';


function Home() {
   const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
  };

    const navigate = useNavigate();
      const controls = useAnimation();

  // Trigger animation on mount and when scrolled into view
  useEffect(() => {
    const handleScroll = () => {
      const el = document.getElementById("info");
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.7 && rect.bottom > 0) {
        controls.start("show");
      }
    };

    // Run on scroll
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [controls]);

  // Listen for nav clicks on links that point to #info
  useEffect(() => {
    const navLinks = document.querySelectorAll('a[href="#info"]');
    const handler = () => {
      controls.start("hidden").then(() => controls.start("show"));
    };
    navLinks.forEach(link => link.addEventListener("click", handler));
    return () => {
      navLinks.forEach(link => link.removeEventListener("click", handler));
    };
  }, [controls]);
  return (
    <>
     
      <div className="relative w-full h-screen overflow-hidden">
        <motion.video
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          src={backgroundVideo}
          autoPlay
          muted
          loop
          playsInline
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 10, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.div
          className="relative z-10 flex flex-col items-start justify-center h-full text-white ml-20 space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
          transition={{delay:1}}
        >
          <motion.p className="header-text-small m-0" variants={itemVariants}>
            Welcome to Agrovision – Harnessing AI to Predict, Protect, and Prosper in Farming!
          </motion.p>

          <motion.h1 className="header-text m-0" variants={itemVariants}>
            Agrovision
          </motion.h1>

          <motion.p className="header-text-small m-0" variants={itemVariants}>
            Detect Early, Protect Fully, Harvest More!
          </motion.p>

         <motion.button
      className="header-button"
      variants={itemVariants}
      animate={{
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      onClick={() => navigate("/user-input")} // your new page route
    >
      Start
    </motion.button>
        </motion.div>
      </div>




 <footer className="bg-gray-900 text-gray-300 py-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6">
          {/* Developer credit */}
          <div className="text-center md:text-left w-full md:w-auto mb-4 md:mb-0">
            Developed by <span className="font-semibold text-green-400">DEV-J</span>
          </div>

          {/* Social Media Links */}
          <div className="flex space-x-6 justify-center w-full md:w-auto mb-4 md:mb-0">
            <a
              href="https://facebook.com/devj"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-green-400 transition"
            >
              {/* Replace with your icon or SVG */}
              <svg
                className="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.2 1.8.2v2h-1c-1 0-1.3.6-1.3 1.2V12h2.2l-.4 3h-1.8v7A10 10 0 0 0 22 12z" />
              </svg>
            </a>

            <a
              href="https://twitter.com/devj"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="hover:text-green-400 transition"
            >
              <svg
                className="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M23 3a10.9 10.9 0 0 1-3.1.9 5.4 5.4 0 0 0 2.4-3 10.9 10.9 0 0 1-3.4 1.3 5.3 5.3 0 0 0-9 4.9A15 15 0 0 1 2 4.2a5.3 5.3 0 0 0 1.6 7.1 5.2 5.2 0 0 1-2.4-.7v.1a5.3 5.3 0 0 0 4.3 5.2 5.4 5.4 0 0 1-2.4.1 5.3 5.3 0 0 0 5 3.6 10.6 10.6 0 0 1-6.6 2.3A10.9 10.9 0 0 1 1 18a15 15 0 0 0 8.2 2.4c9.8 0 15.2-8.1 15.2-15v-.7A10.8 10.8 0 0 0 23 3z" />
              </svg>
            </a>

            <a
              href="https://linkedin.com/in/devj"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-green-400 transition"
            >
              <svg
                className="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M19 0h-14a5 5 0 0 0-5 5v14a5 5 0 0 0 5 5h14a5 5 0 0 0 5-5v-14a5 5 0 0 0-5-5zm-11 19h-3v-9h3zm-1.5-10.3a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4zm13.5 10.3h-3v-4.5a1.5 1.5 0 0 0-3 0v4.5h-3v-9h3v1.4a3.3 3.3 0 0 1 3-1.6c3 0 3.6 2 3.6 4.6z" />
              </svg>
            </a>
          </div>

          {/* Website Links */}
          <div className="flex space-x-6 justify-center w-full md:w-auto">
            <a
              href="/about"
              className="hover:text-green-400 transition"
            >
              About
            </a>
            <a
              href="/contact"
              className="hover:text-green-400 transition"
            >
              Contact
            </a>
            <a
              href="/privacy"
              className="hover:text-green-400 transition"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Home