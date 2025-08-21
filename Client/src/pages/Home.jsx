import "../styles/Home.css";
import ScrollToTop from "../components/ScrollToTop";
import AboutImage from "../assets/images/about.png";
import FAQSection from "../components/Home/FAQSection";
import HeroSection from "../components/Home/HeroSection";
import AboutSection from "../components/Home/AboutSection";
import JoinCtaSection from "../components/Home/JoinCtaSection";
import FeaturesSection from "../components/Home/FeaturesSection";
import { FeaturesData, FaqsData, AboutSectionData } from "../utils/Data";

const Home = () => {
  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100">
      <div></div>
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
      <ScrollToTop showButton={true} threshold={300} />
    </div>
  );
};

export default Home;
