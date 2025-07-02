import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center space-y-4"
      >
        <div className="relative h-16 w-16">
          {/* Outer ring with gradient */}
          <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
          
          {/* Animated spinner with gradient */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 rounded-full border-t-4 border-b-4 border-transparent border-t-blue-600 border-b-blue-400"
          ></motion.div>
          
          {/* Optional center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
          </div>
        </div>
        
        {/* Optional loading text with fade animation */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm font-medium text-gray-600"
        >
          Loading resources...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;