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
      icon: <BookOpen className="w-9 h-9" strokeWidth={1.5} />,
      title: "Online Reading",
      description:
        "Access digital books anytime, anywhere with our online reading platform.",
    },
    {
      icon: <Calendar className="w-9 h-9" strokeWidth={1.5} />,
      title: "Book Reservations",
      description:
        "Reserve books in advance and get notified when they're ready for pickup.",
    },
    {
      icon: <Bell className="w-9 h-9" strokeWidth={1.5} />,
      title: "Due Date Reminders",
      description:
        "Never miss a return date with automated email and push notifications.",
    },
    {
      icon: <Globe className="w-9 h-9" strokeWidth={1.5} />,
      title: "Access Anywhere",
      description:
        "Read on any device, desktop, tablet, or mobile. Your library travels with you.",
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 px-6 bg-white">
      <div className="max-w-[82rem] mx-auto">

        {/* Header */}
        <div
          className={`text-center mb-14 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            Top values for you
          </h2>
          <p className="text-base text-gray-500">
            Try variety of benefits when using our services
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col items-center text-center px-4 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Icon container — outlined circle like reference */}
              <div className="w-20 h-20 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 mb-5">
                {feature.icon}
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;