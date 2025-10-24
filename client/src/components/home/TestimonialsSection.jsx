import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";

const TestimonialsSection = () => {
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

  const testimonials = [
    {
      name: "Sokha Chan",
      role: "Computer Science Major",
      avatar: "SC",
      quote:
        "The BBU library system has transformed how I access study materials. I can reserve books from my dorm and read them on my phone!",
      rating: 5,
    },
    {
      name: "Dara Keo",
      role: "Business Administration",
      avatar: "DK",
      quote:
        "Love the due date reminders! I never miss a return deadline anymore. The interface is so intuitive and easy to use.",
      rating: 5,
    },
    {
      name: "Sophea Lim",
      role: "Engineering Student",
      avatar: "SL",
      quote:
        "Having access to thousands of technical books online has been invaluable for my research projects. Highly recommend!",
      rating: 5,
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-20 px-6"
      style={{ backgroundColor: "#f0f0ff" }}
    >
      <div className="max-w-7xl mx-auto">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Students Say
          </h2>
          <p className="text-lg text-gray-600">Hear from fellow BBU students</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-700 transform hover:-translate-y-1 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Rating Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>

              {/* Student Info */}
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold transition-transform duration-300 hover:scale-110"
                  style={{ backgroundColor: "#000080" }}
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;