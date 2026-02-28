import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, []);

  return (
    <section ref={sectionRef} className="py-20 px-6 bg-white">
      <div className="max-w-[80rem] mx-auto">
        <div
          className="rounded-2xl bg-gray-50 border border-gray-100 px-10 py-16 text-center"
          style={{
            transition: "opacity 1200ms cubic-bezier(0.16,1,0.3,1) 0ms, transform 1200ms cubic-bezier(0.16,1,0.3,1) 0ms",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0) scale(1)" : "translateY(50px) scale(0.97)",
          }}
        >
          <p
            className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4"
            style={{
              transition: "opacity 1000ms cubic-bezier(0.16,1,0.3,1) 200ms, transform 1000ms cubic-bezier(0.16,1,0.3,1) 200ms",
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
            }}
          >
            Get Started
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight"
            style={{
              transition: "opacity 1000ms cubic-bezier(0.16,1,0.3,1) 350ms, transform 1000ms cubic-bezier(0.16,1,0.3,1) 350ms",
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
            }}
          >
            Ready to Start Your Learning Journey?
          </h2>
          <p
            className="text-base text-gray-500 mb-8 max-w-xl mx-auto leading-relaxed"
            style={{
              transition: "opacity 1000ms cubic-bezier(0.16,1,0.3,1) 480ms, transform 1000ms cubic-bezier(0.16,1,0.3,1) 480ms",
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
            }}
          >
            Explore thousands of books and take your education to the next level with BBU Library.
          </p>
          <div
            style={{
              transition: "opacity 1000ms cubic-bezier(0.16,1,0.3,1) 600ms, transform 1000ms cubic-bezier(0.16,1,0.3,1) 600ms",
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
            }}
          >
            <Link
              to="/browse"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-[#000080] text-white text-sm font-semibold rounded-xl transition-all duration-200 group"
            >
              Explore Books
              <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 text-white" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;