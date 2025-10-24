import HomeHero from "../components/home/HomeHero";
import AboutSection from "../components/home/AboutSection";
import FeaturesSection from "../components/home/FeaturesSection";
import HomeBooks from "../components/home/HomeBooks";
import TestimonialsSection from "../components/home/TestimonialsSection";
import CTASection from "../components/home/CTASection";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HomeHero />

      {/* About Section */}
      <AboutSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Book Showcase Section */}
      <HomeBooks />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Call to Action Section */}
      <CTASection />
    </div>
  );
};

export default Home;