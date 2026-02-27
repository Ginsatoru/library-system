import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4">
      <div className="text-center w-full max-w-[700px] mx-auto px-6">

        {/* 404 Number */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="flex justify-center gap-2 font-black leading-none mb-0"
          style={{ fontSize: "clamp(90px, 25vw, 250px)", letterSpacing: "-0.02em" }}
        >
          {["4", "0", "4"].map((char, i) => (
            <span
              key={i}
              style={{
                background: "linear-gradient(180deg, #000080 0%, rgba(0,0,128,0.3) 50%, rgba(0,0,128,0) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "inline-block",
              }}
            >
              {char}
            </span>
          ))}
        </motion.h1>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
          className="flex flex-col gap-2 mb-0"
        >
          <h2
            className="font-bold text-gray-800 leading-tight m-0"
            style={{ fontSize: "clamp(22px, 4vw, 34px)" }}
          >
            How did you get here?!
          </h2>
          <p
            className="text-gray-600 m-0"
            style={{ fontSize: "clamp(16px, 2.5vw, 20px)" }}
          >
            It's cool. We'll help you out.
          </p>
        </motion.div>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.4 }}
          className="mt-7"
        >
          <Link
            to="/"
            className="inline-flex items-center justify-center px-10 py-3.5 bg-[#000080] text-white text-base font-semibold rounded-full hover:bg-blue-900 transition-all duration-300 hover:-translate-y-0.5"
          >
            Back to Homepage
          </Link>
        </motion.div>

      </div>
    </div>
  );
};

export default NotFound;