//import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion, } from 'framer-motion';
import {  useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundVideo from '../assets/videos/main.mp4';

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

  const handleMouseMove = (e: { clientY: number; clientX: number; }) => {
    const x = (e.clientY / window.innerHeight - 0.5) * 30; // up/down tilt
    const y = (e.clientX / window.innerWidth - 0.5) * 30;  // left/right tilt
    setRotation({ x, y });
  };
    const navigate = useNavigate();

  return (
    <>
       <div className="relative w-full h-screen overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          autoPlay
          muted
          loop
          src={backgroundVideo}
          playsInline
        />
        <motion.div
          className="relative z-10 flex flex-col items-start justify-center h-full text-white ml-20 space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
          transition={{delay:0}}
        >
          <motion.h1 className="ava-text m-0" variants={itemVariants}>
            Meet AVA — Your Agrovion Virtual Agent
          </motion.h1>

          <motion.p className="ava-text-small m-0" variants={itemVariants}>
            AVA (Agrovion Virtual Agent) is your intelligent, always-available digital assistant designed to empower farmers, agribusinesses, and stakeholders with instant support and smart insights. Whether it's answering questions, providing crop recommendations, tracking weather conditions, or guiding you through Agrovion’s tools, AVA is here to make agriculture smarter and simpler.
          </motion.p>

         <motion.button
      className="ava-button"
      variants={itemVariants}
      animate={{
        scale: [1, 1.1, 1],
      }}
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
      </div>
     <motion.div
     animate={{ scale: [1, 1.1, 1] }} 
      transition={{
        duration: 20,         
        repeat: Infinity,     
        ease: 'easeInOut',   
      }}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '0px',
        width: '700px',
        height: '600px',
        zIndex: 1000,
      }}
    >
          <div
      onMouseMove={handleMouseMove}
      style={{
        perspective: '1000px',
        width: '700px',
        height: '600px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: 'transform 0.1s',
          width: '100%',
          height: '100%',
        }}
      >
      {/* <DotLottieReact
        src="https://lottie.host/d143c7a4-2df8-4d77-8d26-0e9aa38796c5/frlO94qCoX.lottie"
        loop
        autoplay
        style={{
          width: '100%',
          height: '100%',
        }}
      /> */}
           </div>
    </div>
    </motion.div>
   
    </>
      
  );
};

export default Ava;
