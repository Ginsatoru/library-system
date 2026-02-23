import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
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
      className="py-20 px-6"
      style={{ backgroundColor: "#ffffff" }}
    >
      <div
        className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Ready to Start Your Learning Journey?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Explore thousands of books and take your education to the next level
          with BBU Library.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/browse"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#000080] text-white rounded-xl font-semibold hover:bg-blue-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group"
          >
            Explore Books
            <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTASection;