import HomeHero from "../components/home/HomeHero";
import AboutSection from "../components/home/AboutSection";
import FeaturesSection from "../components/home/FeaturesSection";
import HomeBooks from "../components/home/HomeBooks";
import HowItWorks from "../components/home/HowItWorks";
import CTASection from "../components/home/CTASection";

const Home = ({ isAuthenticated, launchHeart }) => {
  return (
    <div className="min-h-screen bg-white">
      <HomeHero />
      <AboutSection />
      <FeaturesSection />
      <HomeBooks isAuthenticated={isAuthenticated} launchHeart={launchHeart} />
      <HowItWorks />
      <CTASection />
    </div>
  );
};

export default Home;