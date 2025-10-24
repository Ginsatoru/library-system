import { useEffect, useRef, useState } from "react";

const AboutSection = () => {
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

  const stats = [
    { number: "10K+", label: "Books Available" },
    { number: "5K+", label: "Active Students" },
    { number: "50+", label: "Categories" },
    { number: "24/7", label: "Access" },
  ];

  return (
    <section ref={sectionRef} className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            About BBU Library System
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Build Bright University's Library Management System provides
            students with seamless access to academic resources. Whether you're
            researching for a project or exploring new topics, our digital
            library offers convenient, 24/7 access to thousands of books,
            journals, and educational materials.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{
                backgroundColor: "#e6e6ff",
                transitionDelay: `${index * 100}ms`,
              }}
            >
              <p
                className="text-3xl md:text-4xl font-bold mb-2"
                style={{ color: "#000080" }}
              >
                {stat.number}
              </p>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;