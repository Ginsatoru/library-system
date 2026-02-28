import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Marquee from "react-fast-marquee";
import { BookBookmark, Flask, Desktop, Brain, Bank, ChartLineUp, PaintBrush, Globe } from "@phosphor-icons/react";
import Image from "../../assets/background.png";
import { IoBookOutline } from "react-icons/io5";

const categories = [
  { icon: BookBookmark, label: "Fiction" },
  { icon: Flask, label: "Science" },
  { icon: Desktop, label: "Technology" },
  { icon: Brain, label: "Self-Development" },
  { icon: Bank, label: "History" },
  { icon: ChartLineUp, label: "Business" },
  { icon: PaintBrush, label: "Arts" },
  { icon: Globe, label: "Geography" },
];

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
      className="relative bg-cover bg-center bg-no-repeat min-h-screen flex flex-col"
      style={{ backgroundImage: `url(${Image})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Main content */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 text-center pt-24 pb-12">
        <div className="flex flex-col items-center">

          {/* Badge — delay 0.5s */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8 bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-sm
              transition-all duration-[1300ms] ease-out
              ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ transitionDelay: isVisible ? "0.5s" : "0s" }}
          >
            <IoBookOutline className="w-4 h-4"/>
            Build Bright University Library
          </div>

          {/* Heading — delay 0.7s */}
          <h1
            className={`text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-5 drop-shadow-lg max-w-3xl
              transition-all duration-[1400ms] ease-out
              ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            style={{ transitionDelay: isVisible ? "0.7s" : "0s" }}
          >
            Explore Knowledge.{" "}
            <span
              className="font-normal italic"
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                color: "white",
              }}
            >
              Empower Your Future.
            </span>
          </h1>

          {/* Subtitle — delay 0.9s */}
          <p
            className={`text-base md:text-lg text-white/85 drop-shadow mb-10 max-w-lg leading-relaxed
              transition-all duration-[1400ms] ease-out
              ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ transitionDelay: isVisible ? "0.9s" : "0s" }}
          >
            Access thousands of books, reserve your favorites, and manage your
            reading journey, all in one place.
          </p>

          {/* CTA Button — delay 1.1s */}
          <a
            href="/browse"
            className={`inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full font-semibold text-[#000080] text-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 group
              ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{
              backgroundColor: "white",
              transitionProperty: "opacity, transform",
              transitionDuration: isVisible ? "1300ms" : "0ms",
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              transitionDelay: isVisible ? "1.1s" : "0s",
            }}
          >
            Browse Books
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#000080]">
              <ArrowRight className="w-3.5 h-3.5 text-white transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </a>
        </div>
      </div>

      {/* Bottom black gradient behind marquee */}
      <div className="absolute bottom-0 left-0 right-0 h-[18%] z-10"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.99) 70%, transparent)" }}
      />

      {/* Marquee section — delay 1.3s */}
      <div
        className={`relative z-20 pb-4 pt-10
          transition-all duration-[1500ms] ease-out
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        style={{ transitionDelay: isVisible ? "1.3s" : "0s" }}
      >
        <div className="max-w-[93rem] mx-auto px-3 sm:px-4">
          <div className="relative overflow-hidden rounded-xl">
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-48 z-10"
              style={{ background: "linear-gradient(to right, rgba(0,0,0,1) 40%, transparent)" }}
            />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-48 z-10"
              style={{ background: "linear-gradient(to left, rgba(0,0,0,1) 40%, transparent)" }}
            />

            <Marquee
              speed={40}
              pauseOnHover={true}
              gradient={false}
              className="py-2"
            >
              {[...categories, ...categories].map((cat, i) => (
                <div
                  key={i}
                  className="mx-4 sm:mx-8 flex flex-col items-center gap-2 px-3 sm:px-5 py-2.5 text-white cursor-default select-none"
                  style={{ whiteSpace: "nowrap" }}
                >
                  <cat.icon weight="fill" className="w-10 h-10 flex-shrink-0" />
                  <span className="text-sm font-medium">{cat.label}</span>
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;