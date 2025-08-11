import '.././index.css';
import { AnimatePresence, motion } from 'framer-motion';
import bgimage from '../assets/images/background.png';
import { useState } from 'react';

const data = {
  howItWorks: [
    { id: 1, title: "Data Collection", content: "Agrovision gathers local weather data..." },
    { id: 2, title: "AI-Powered Predictions", content: "Our model uses ML..." },
    { id: 3, title: "Real-Time Alerts", content: "Farmers receive notifications..." },
    { id: 4, title: "Actionable Insights", content: "Apply preventive measures..." }
  ],
  benefits: [
    { id: 1, title: "Early Detection", content: "Identify risks before outbreaks." },
    { id: 2, title: "Save Costs", content: "Optimize use of fungicides and labor." },
    { id: 3, title: "Increase Yields", content: "Healthier crops lead to better harvests." },
    { id: 4, title: "Support Sustainable Farming", content: "Reduce chemical use." }
  ]
};
const containerVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};
const InfoSection = () => {
 const [selectedSection, setSelectedSection] = useState<"howItWorks" | "benefits">("howItWorks");
  const [slideIndex, setSlideIndex] = useState(0);

  const slides = data[selectedSection];
  const current = slides[slideIndex];

  function nextSlide() {
    setSlideIndex((prev) => (prev + 1) % slides.length);
  }
  function prevSlide() {
    setSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }

  const childVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="full-screen-container">
      {/* Background image  style={{ backgroundImage: `url(${infobg})` }} import infobg from '../assets/jetwing-footer.jpg';*/}
     

      {/* Optional overlay   <motion.video
          className="absolute top-0 left-0 w-full h-full object-cover "
          src={backgroundVideo}
          autoPlay
          muted
          loop
          playsInline
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 10, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
        />*/}
      <div className="pattern-background absolute inset-0 "></div>

      {/* Header */}
   <div
  className="relative bg-cover bg-center text-white py-24 px-8"
  style={{
     backgroundImage: `url(${bgimage})`, // Replace with your image path
  }}
>
  {/* Green overlay */}
  <div className="absolute inset-0 bg-[#85A947] opacity-90 z-0"></div>

  {/* Content on top */}
  <div className="relative z-10">
    <motion.h2
      className="info-header flex justify-center"
      variants={childVariant}
      initial="hidden"
      animate="show"
    >
      Welcome to Agrovision
    </motion.h2>

    <motion.p
      className="info-text-small flex justify-center max-w-6xl mx-auto mt-6 text-center"
      variants={childVariant}
      initial="hidden"
      animate="show"
    >
      At Agrovision, we harness the power of Artificial Intelligence and Data Analytics to empower Sri Lankan paddy farmers with timely and accurate disease forecasts.
    </motion.p>
  </div>
</div>

    <div className="flex flex-col gap-16 p-8">

      {/* How It Works */}
   <div className="max-w-12xl mx-auto p-8 flex gap-12">
  {/* Left vertical dots & labels */}
  <div className="relative flex flex-col items-start space-y-60">
    {/* Vertical line */}
    <div className="absolute top-2 left-3 w-[10px] bg-[#3E7B27] h-full z-0 rounded-full "></div>

    {/* Dot 1 */}
    <button
      onClick={() => {
        setSelectedSection("howItWorks");
        setSlideIndex(0);
      }}
      className={`flex items-center space-x-3 cursor-pointer focus:outline-none line-text ${
        selectedSection === "howItWorks" ? "text-[#3E7B27] font-semibold" : "text-gray-400"
      }`}
      style={{ zIndex: 10 }}
    >
      <div
        className={`w-5 h-5 rounded-full border-2 ${
          selectedSection === "howItWorks" ? "bg-[#3E7B27] border-[#3E7B27]" : "border-gray-400"
        }`}
      />
      <span>How It Works</span>
    </button>

    {/* Dot 2 */}
    <button
      onClick={() => {
        setSelectedSection("benefits");
        setSlideIndex(0);
      }}
      className={`flex items-center space-x-3 cursor-pointer focus:outline-none line-text ${
        selectedSection === "benefits" ? "text-[#3E7B27] font-semibold" : "text-gray-400"
      }`}
      style={{ zIndex: 10 }}
    >
      <div
        className={`w-5 h-5 rounded-full border-2 ${
          selectedSection === "benefits" ? "bg-[#3E7B27] border-[#3E7B27]" : "border-gray-400"
        }`}
      />
      <span>Benefits</span>
    </button>
  </div>

  {/* Right sliding popup container */}
  <div className="w-[800px] max-w-full">
    <AnimatePresence mode="wait">
      <motion.div
        key={selectedSection + slideIndex}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.4 }}
        className="bg-[#EFE3C2] rounded-lg p-12 shadow-lg relative h-[600px] w-full"
      >
        <h4 className="text-2xl font-semibold mb-4 text-[#123524]">{current.title}</h4>
        <p className="text-[#123524] text-lg">{current.content}</p>

        {/* Slider controls */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevSlide}
            disabled={slides.length <= 1}
            className="px-4 py-2 bg-[#85A947] text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={nextSlide}
            disabled={slides.length <= 1}
            className="px-4 py-2 bg-[#85A947] text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  </div>
</div>

    </div>


      {/* Photo Gallery  <motion.div className="photo-gallery ml-8 mr-8 mb-20" variants={childVariant} initial="hidden" animate="show">
        <div className="flex gap-4 flex-wrap">
          <img  alt="Gallery 1" className="w-64 h-40 object-cover rounded-lg" />
          <img  alt="Gallery 2" className="w-64 h-40 object-cover rounded-lg" />
          <img  alt="Gallery 3" className="w-64 h-40 object-cover rounded-lg" />
        </div>
      </motion.div> */}
     

    {/* Final CTA */}
<motion.div
  className="text-center mb-20 px-4 mt-60"
  variants={childVariant}
  initial="hidden"
  animate="show"
   style={{  zIndex: 50, position: 'relative' }}
>
  <h3 className="text-3xl font-semibold mt-10 mb-4 info-text-small flex justify-center">
    Join Agrovision Today!
  </h3>

  <p className="info-text-small max-w-10xl mx-auto flex justify-center">
    Empower your farming with AI-driven disease prediction — <strong>Protect your crops, secure your harvest, and grow with confidence.</strong>
  </p>
</motion.div>
    </div>
  );
};

export default InfoSection;
