import { useEffect, useRef, useState } from "react";
import WorkImage from "../../images/work.png";

const HowItWorksSection = () => {
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

  const steps = [
    {
      number: "1",
      title: "Browse the Catalog",
      description: "Search by title, author, or category and find what you need instantly.",
    },
    {
      number: "2",
      title: "Read Online",
      description: "Open any digital book in our built-in PDF reader from any device.",
    },
    {
      number: "3",
      title: "Visit the Library",
      description: "Submit a request to read on-site and our librarians will have it ready.",
    },
    {
      number: "4",
      title: "Borrow a Book",
      description: "Collect at the counter and get due date reminders so you never miss a return.",
    },
  ];

  const fromBottom = (delay = 0) => ({
    transition: `opacity 1100ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 1100ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateY(0)" : "translateY(40px)",
  });

  const fromLeft = (delay = 0) => ({
    transition: `opacity 1300ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 1300ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateX(0)" : "translateX(-80px)",
  });

  const fromRight = (delay = 0) => ({
    transition: `opacity 1300ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 1300ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateX(0)" : "translateX(80px)",
  });

  return (
    <section ref={sectionRef} className="py-20 px-6 bg-white">
      <div className="max-w-[80rem] mx-auto">

        {/* Title — from bottom */}
        <div className="text-center mb-14" style={fromBottom(0)}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">How It Works</h2>
          <p className="text-base text-gray-500">
            Simple steps to get the most out of your library experience
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* Left: image — from left */}
          <div style={fromLeft(150)}>
            <img
              src={WorkImage}
              alt="How it works"
              className="w-full h-full object-cover rounded-2xl"
              style={{ maxHeight: "480px" }}
            />
          </div>

          {/* Right: 2x2 grid of steps — from right, staggered */}
          <div className="grid grid-cols-2 gap-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className="rounded-2xl p-7 border border-gray-100 bg-gray-50 flex flex-col justify-between min-h-[200px]"
                style={fromRight(150 + index * 100)}
              >
                <p className="text-4xl font-bold leading-none" style={{ color: "#000080" }}>
                  {step.number}
                </p>
                <div>
                  <p className="text-base font-semibold text-gray-900 mb-2">{step.title}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;