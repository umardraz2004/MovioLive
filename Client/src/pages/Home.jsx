import "../styles/Home.css";
import FAQSection from "../components/FAQSection";
import AboutImage from "../assets/images/about.png";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import { FeaturesData, FaqsData, AboutSectionData } from "../utils/Data";
import JoinCtaSection from "../components/JoinCtaSection";
import FeaturesSection from "../components/FeaturesSection";
import { FaArrowUp } from "react-icons/fa";
import { useEffect, useState } from "react";

const Home = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowScrollButton(scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100">
      {/* HERO */}
      <HeroSection />
      <main className="mt-20">
        {/* ABOUT */}
        <AboutSection AboutImage={AboutImage} data={AboutSectionData} />
        {/* FEATURES */}
        <FeaturesSection features={FeaturesData} />
        {/* FAQ */}
        <FAQSection faqs={FaqsData} />
        {/* JOIN CTA */}
        <JoinCtaSection />
      </main>
      {/* Scroll to Top Button */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 
  dark:from-orange-500 dark:via-red-500 dark:to-pink-500 
  text-white shadow-lg hover:shadow-[0_0_20px_rgba(255,0,150,0.6)] 
  transition-all duration-300 hover:scale-110 active:scale-95 
  focus:outline-none z-50 backdrop-blur-sm border border-white/20"
          title="Scroll to Top"
        >
          <FaArrowUp className="w-5 h-5 animate-pulse" />
        </button>
      )}
    </div>
  );
};

export default Home;
