import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import AboutImage from "../../images/about.png";

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  const stats = [
    { number: "10K+", label: "Books Available" },
    { number: "5K+", label: "Active Students" },
    { number: "50+", label: "Categories" },
  ];

  const highlights = [
    {
      title: "Digital Resources",
      description:
        "Access thousands of e-books, journals, and academic materials available 24/7 from any device on or off campus.",
    },
    {
      title: "Smart Reservations",
      description:
        "Reserve physical books in advance, track due dates, and receive automated reminders so you never miss a return.",
    },
    {
      title: "Academic Support",
      description:
        "Our library system is built to support every stage of your academic journey, from initial research and literature review to final submission. With structured resources and dedicated support, success is always within reach.",
    },
  ];

  return (
    <section ref={sectionRef} className="pt-10 pb-20 px-6 bg-white">
      <div className="max-w-[80rem] mx-auto">

        {/* Top row: label + title + stats */}
        <div
          className={`flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-12 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Left: label + title */}
          <div className="max-w-sm">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
              About Our Library
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Empowering Students at Build Bright University
            </h2>
          </div>

          {/* Right: stats */}
          <div className="flex gap-10 lg:gap-16 lg:pt-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center lg:text-left">
                <p className="text-2xl md:text-3xl font-bold" style={{ color: "#000080" }}>
                  {stat.number}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row: image + cards */}
        <div className="grid lg:grid-cols-2 gap-6 items-start">

          {/* Left: image */}
          <div
            className={`transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <img
              src={AboutImage}
              alt="BBU Library"
              className="w-full h-full object-cover rounded-2xl"
              style={{ maxHeight: "420px" }}
            />
          </div>

          {/* Right: highlight cards */}
          <div className="flex flex-col gap-4">
            {/* First row: 2 cards side by side on desktop, stacked on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {highlights.slice(0, 2).map((item, index) => (
                <div
                  key={index}
                  className={`rounded-2xl p-6 border border-gray-100 transition-all duration-700 ${
                    index === 0 ? "bg-[#eef2ff]" : "bg-gray-50"
                  } ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${(index + 1) * 150}ms` }}
                >
                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    {item.description}
                  </p>
                  <Link to="/browse" className={`inline-flex items-center gap-1 text-sm font-medium text-gray-800 border border-gray-200 rounded-lg px-4 py-2 transition-all duration-200 group ${index === 0 ? "bg-[#eef2ff] hover:bg-[#e0e7ff]" : "bg-gray-50 hover:bg-gray-100"}`}>
                    Read More
                    <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 text-gray-500" />
                  </Link>
                </div>
              ))}
            </div>
            {/* Second row: 1 full-width card */}
            <div
              className={`rounded-2xl p-6 border border-gray-100 bg-gray-50 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "450ms" }}
            >
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                {highlights[2].title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                Our library system supports every stage of your academic journey, from research to final submission.
              </p>
              <a
                href="https://web.bbu.edu.kh/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-gray-800 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-100 transition-all duration-200 group"
              >
                Read More
                <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 text-gray-500" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;