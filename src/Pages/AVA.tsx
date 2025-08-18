import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundimage from "../assets/images/ava5.jpg";

const Ava = () => {
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

  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: { clientY: number; clientX: number }) => {
    const x = (e.clientY / window.innerHeight - 0.5) * 30; // up/down tilt
    const y = (e.clientX / window.innerWidth - 0.5) * 30;  // left/right tilt
    setRotation({ x, y });
  };

  const navigate = useNavigate();

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundimage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Fullscreen overlay  bg-black/50 */}
      <div className="absolute inset-0 z-0"></div>

      {/* Content Section */}
      <motion.div
        className="relative z-10 flex flex-col items-start justify-center h-full text-white ml-20 space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
        transition={{ delay: 0 }}
      >
        <motion.h1
          className="font-bold text-8xl primary-color-green -mt-30"
          variants={itemVariants}
        >
          Meet AVA — Your Agrovion Virtual Agent
        </motion.h1>

        <motion.p className="text-3xl m-0 mr-20" variants={itemVariants}>
          AVA (Agrovion Virtual Agent) is your intelligent, always-available
          digital assistant designed to empower farmers, agribusinesses, and
          stakeholders with instant support and smart insights. Whether it's
          answering questions, providing crop recommendations, tracking weather
          conditions, or guiding you through Agrovion’s tools, AVA is here to
          make agriculture smarter and simpler.
        </motion.p>

        <motion.button
          className="mt-8
            text-[30px]
            bg-[#254336]
            py-2.5 px-2.5
            rounded-xl  
            cursor-pointer
            w-[200px]
            h-[70px]
            sm:w-[200px] sm:h-[50px] sm:text-[20px]
            xs:w-[160px] xs:h-[50px] xs:text-[18px]"
          variants={itemVariants}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          onClick={() => navigate("/chatbot")}
        >
          Start
        </motion.button>
      </motion.div>

      {/* Lottie Animation Section */}
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
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
          <div className="fixed bottom-[60px] right-[100px] z-10">
            <DotLottieReact
              src="https://lottie.host/d143c7a4-2df8-4d77-8d26-0e9aa38796c5/frlO94qCoX.lottie"
              loop
              autoplay
              style={{
                width: "300px",
                height: "300px",
              }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Ava;
