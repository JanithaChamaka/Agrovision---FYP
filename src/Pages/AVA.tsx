import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useTransition, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';

// Lazy load the Lottie animation
const LottieAnimation = lazy(() =>
  import('@lottiefiles/dotlottie-react').then((module) => ({
    default: module.DotLottieReact,
  }))
);

// Define types for props and state
interface Rotation {
  x: number;
  y: number;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const Ava: React.FC = () => {
  const [rotation, setRotation] = useState<Rotation>({ x: 0, y: 0 });
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();

  // Handle mouse movement for 3D rotation effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = (e.clientY / window.innerHeight - 0.5) * 20;
    const y = (e.clientX / window.innerWidth - 0.5) * 20;
    setRotation({ x, y });
  };

  // Handle navigation with transition
  const handleStartClick = () => {
    startTransition(() => {
      navigate('/chatbot');
    });
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-green-800 to-teal-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.4 }}
      >
        {/* Main Content Section */}
        <motion.div
          className="relative z-10 flex flex-col items-start justify-center h-full text-white px-4 sm:px-6 lg:pl-20 space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.h1
            className="relative text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight"
            variants={itemVariants}
          >
            Agrovision Virtual Agent
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl lg:text-2xl max-w-5xl text-center lg:text-left"
            variants={itemVariants}
          >
            AVA is your intelligent digital assistant, empowering farmers and
            agribusinesses with real-time support, crop insights, weather tracking,
            and seamless integration with AgroVision’s tools.
          </motion.p>

          <motion.button
            className="mt-6 bg-teal-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-teal-600 focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200"
            variants={itemVariants}
            onClick={handleStartClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isPending}
            aria-label="Start using Agrovision Virtual Agent"
          >
            {isPending ? 'Navigating...' : 'Start'}
          </motion.button>
        </motion.div>

        {/* Lottie Animation Section */}
        <motion.div
          className="absolute bottom-0 right-0 w-[300px] sm:w-[400px] lg:w-[500px] h-[300px] sm:h-[400px] lg:h-[500px] z-10"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div
            onMouseMove={handleMouseMove}
            className="w-full h-full"
            style={{ perspective: '1000px' }}
          >
            <div
              style={{
                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                transition: 'transform 0.1s',
                width: '100%',
                height: '100%',
              }}
            >
              <Suspense fallback={<div>Loading animation...</div>}>
                <LottieAnimation
                  src="https://lottie.host/d143c7a4-2df8-4d77-8d26-0e9aa38796c5/frlO94qCoX.lottie"
                  loop
                  autoplay
                  style={{ width: '100%', height: '100%' }}
                />
              </Suspense>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Ava;