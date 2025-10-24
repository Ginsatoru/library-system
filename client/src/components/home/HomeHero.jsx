import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "../../assets/background.png";

const HomeHero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-cover bg-center bg-no-repeat min-h-screen flex items-center px-6"
      style={{ backgroundImage: `url(${Image})` }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div
            className={`flex-1 text-left z-10 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div
              className="inline-block px-5 py-2 rounded-full text-sm font-medium mb-6"
              style={{
                backgroundColor: "rgba(230, 230, 255, 0.95)",
                color: "#000080",
              }}
            >
              Build Bright University Library
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
              Explore Knowledge.
              <br />
              Empower Your Future.
            </h1>
            <p className="text-base md:text-lg text-white drop-shadow-md mb-10 max-w-xl">
              Access thousands of books, reserve your favorites, and manage your
              reading journey, all in one place.
            </p>

            {/* CTA Button */}
            <a
              href="/browse"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-[#000080] bg-white shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-[#f0f4ff] group"
            >
              Browse Books
              <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;