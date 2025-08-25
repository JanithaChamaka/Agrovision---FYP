import '.././index.css';
import { motion } from 'framer-motion';
import bgimage from '../assets/images/background.png';
import { useState, useEffect } from 'react';

const howItWorksData = [
  { id: 1, title: "Data Collection", content: "Agrovision gathers local weather data and crop health info." },
  { id: 2, title: "AI-Powered Predictions", content: "Machine learning predicts disease risks & interventions." },
  { id: 3, title: "Real-Time Alerts", content: "Farmers get notifications on potential threats immediately." },
  { id: 4, title: "Actionable Insights", content: "Clear recommendations for fertilizer, irrigation & preventive measures." }
];

const benefitsData = [
  { id: 1, title: "Early Detection", content: "Identify risks before outbreaks, minimizing crop losses." },
  { id: 2, title: "Save Costs", content: "Optimize the use of fungicides and labor." },
  { id: 3, title: "Increase Yields", content: "Healthier crops lead to better harvests." },
  { id: 4, title: "Support Sustainable Farming", content: "Reduce chemical use while maintaining productivity." }
];

// Flip card component
const FlipCard = ({ title, content }: { title: string; content: string }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      className="relative w-full h-64 perspective cursor-pointer"
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div
        className="absolute w-full h-full rounded-xl shadow-lg"
        style={{
          transformStyle: "preserve-3d",
        }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Front Side */}
        <div
          className="absolute w-full h-full bg-white rounded-xl flex items-center justify-center text-center p-6 text-green-800 font-bold text-xl shadow-lg"
          style={{ backfaceVisibility: "hidden" }}
        >
          {title}
        </div>

        {/* Back Side */}
        <div
          className="absolute w-full h-full bg-green-50 rounded-xl flex items-center justify-center text-center p-6 text-gray-700 font-medium shadow-lg"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {content}
        </div>
      </motion.div>
    </motion.div>
  );
};

const InfoSection = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Header Section */}
      <div
        className="relative h-screen flex flex-col items-center justify-center text-white overflow-hidden"
        style={{
          backgroundImage: `url(${bgimage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-[#85A947] opacity-80 z-0"></div>
        <motion.div
          className="relative z-10 text-center px-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6">Welcome to AgroVision</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Empowering Sri Lankan paddy farmers with AI-driven disease prediction, real-time alerts, and actionable insights to protect crops and maximize harvests.
          </p>
        </motion.div>
      </div>

      {/* How It Works Section */}
      <section className="relative py-24 bg-gray-100 overflow-hidden">
        <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-8">
          {howItWorksData.map(item => (
            <FlipCard key={item.id} title={item.title} content={item.content} />
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-24 bg-white overflow-hidden">
        <h2 className="text-4xl font-bold text-center mb-16 text-green-900">Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-8">
          {benefitsData.map(item => (
            <FlipCard key={item.id} title={item.title} content={item.content} />
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-24 bg-green-800 text-white text-center px-8">
        <h3 className="text-3xl md:text-4xl font-semibold mb-6">Join AgroVision Today!</h3>
        <p className="max-w-3xl mx-auto mb-8">
          Protect your crops, secure your harvest, and grow with confidence using AI-powered insights and actionable recommendations.
        </p>
        <button className="px-8 py-4 bg-yellow-400 rounded-xl font-bold text-green-900 hover:bg-yellow-500 transition">
          Get Started
        </button>
      </section>
    </div>
  );
};

export default InfoSection;
