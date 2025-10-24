import { useEffect, useRef, useState } from "react";
import { BookOpen, Calendar, Bell, Globe } from "lucide-react";

const FeaturesSection = () => {
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

  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Online Reading",
      description:
        "Access digital books anytime, anywhere with our online reading platform.",
      color: "#0066cc",
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Book Reservations",
      description:
        "Reserve books in advance and get notified when they're ready for pickup.",
      color: "#7c3aed",
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Due Date Reminders",
      description:
        "Never miss a return date with automated email and push notifications.",
      color: "#db2777",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Access Anywhere",
      description:
        "Read on any device—desktop, tablet, or mobile. Your library travels with you.",
      color: "#000080",
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need for a seamless library experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-700 transform hover:-translate-y-1 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div
                className="w-16 h-16 rounded-lg flex items-center justify-center text-white mb-4 transition-transform duration-300 hover:scale-110"
                style={{ backgroundColor: feature.color }}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;