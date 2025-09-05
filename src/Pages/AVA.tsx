import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundimage from "../assets/images/avabg.jpg";

const Ava = () => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [leaving, setLeaving] = useState(false); // page exit
  const navigate = useNavigate();

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

  const handleMouseMove = (e: { clientY: number; clientX: number }) => {
    const x = (e.clientY / window.innerHeight - 0.5) * 30;
    const y = (e.clientX / window.innerWidth - 0.5) * 30;
    setRotation({ x, y });
  };

  const handleStartClick = () => {
    setLeaving(true); // trigger exit animation
    setTimeout(() => {
      navigate("/chatbot");
    }, 500); // match duration
  };

  return (
    <AnimatePresence>
      {!leaving && (
        <motion.div
          className="relative w-full h-screen overflow-hidden "
          style={{
            backgroundImage: `url(${backgroundimage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
        >
          {/* Main Content Section */}
          <motion.div
            className="relative z-10 flex flex-col items-center justify-center h-full text-black ml-20 space-y-4 -mt-20"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            transition={{ delay: 0 }}
          >
            <motion.h1
              className="text-[40px] mb-5 header-text"
              variants={itemVariants}
            >
              Agrovision Virtual Agent
            </motion.h1>

            <motion.p className="text-2xl m-0 mr-20 text-bold" variants={itemVariants}>
              AVA (AgroVision Virtual Agent) is your intelligent, always-available
              digital assistant designed to empower farmers, agribusinesses, and
              stakeholders with instant support and smart insights. Whether it's
              answering questions, providing crop recommendations, tracking weather
              conditions, or guiding you through AgroVision’s tools, AVA is here to
              make agriculture smarter and simpler.
            </motion.p>

            <motion.button
              className="mt-8 text-[30px] bg-[#254336] text-white py-2.5 px-2.5 rounded-xl cursor-pointer w-[150px] h-[50px] sm:w-[150px] sm:h-[50px] sm:text-[20px] xs:w-[150px] xs:h-[50px] xs:text-[18px]"
              variants={itemVariants}
              onClick={handleStartClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              Start
            </motion.button>
          </motion.div>

          {/* Lottie Animation Section */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 right-0 w-[700px] h-[600px] z-10"
          >
            <div
              onMouseMove={handleMouseMove}
              style={{
                perspective: "1000px",
                width: "700px",
                height: "600px",
                margin: "0 auto",
              }}
            >
              <div
                style={{
                  transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                  transition: "transform 0.1s",
                  width: "100%",
                  height: "100%",
                }}
              ></div>

              {/* Lottie fixed bottom-right */}
              {/* <div className="fixed bottom-[60px] right-[100px] z-10">
                <DotLottieReact
                  src="https://lottie.host/d143c7a4-2df8-4d77-8d26-0e9aa38796c5/frlO94qCoX.lottie"
                  loop
                  autoplay
                  style={{ width: "300px", height: "300px" }}
                />
              </div> */}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Ava;
