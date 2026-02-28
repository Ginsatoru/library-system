import { useEffect, useRef, useState } from "react";
import { BookOpen, Calendar, Bell, Globe } from "lucide-react";

const FeaturesSection = () => {
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

  const features = [
    {
      icon: <BookOpen className="w-9 h-9" strokeWidth={1.5} />,
      title: "Online Reading",
      description: "Access digital books anytime, anywhere with our online reading platform.",
    },
    {
      icon: <Calendar className="w-9 h-9" strokeWidth={1.5} />,
      title: "Book Reservations",
      description: "Reserve books in advance and get notified when they're ready for pickup.",
    },
    {
      icon: <Bell className="w-9 h-9" strokeWidth={1.5} />,
      title: "Due Date Reminders",
      description: "Never miss a return date with automated email and push notifications.",
    },
    {
      icon: <Globe className="w-9 h-9" strokeWidth={1.5} />,
      title: "Access Anywhere",
      description: "Read on any device, desktop, tablet, or mobile. Your library travels with you.",
    },
  ];

  // Cards: left-outer, left-inner, right-inner, right-outer
  const cardDirections = [
    { x: "-100px", delay: 0 },
    { x: "-50px",  delay: 100 },
    { x: "50px",   delay: 100 },
    { x: "100px",  delay: 0 },
  ];

  const fromBottom = (delay = 0) => ({
    transition: `opacity 1100ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 1100ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateY(0)" : "translateY(40px)",
  });

  const fromSide = (xFrom, delay = 0) => ({
    transition: `opacity 1300ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 1300ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateX(0)" : `translateX(${xFrom})`,
  });

  return (
    <section ref={sectionRef} className="py-20 px-6 bg-white">
      <div className="max-w-[82rem] mx-auto">

        {/* Header — from bottom */}
        <div className="text-center mb-14" style={fromBottom(0)}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            Top values for you
          </h2>
          <p className="text-base text-gray-500">
            Try variety of benefits when using our services
          </p>
        </div>

        {/* Features grid — fan in from sides */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center px-4"
              style={fromSide(cardDirections[index].x, cardDirections[index].delay + 150)}
            >
              <div className="w-20 h-20 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 mb-5">
                {feature.icon}
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;