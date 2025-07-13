import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-50 z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.6,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        className="flex flex-col items-center space-y-8"
      >
        {/* Primary spinner with brand color */}
        <div className="relative h-24 w-24">
          {/* Background glow with brand color */}
          <div className="absolute inset-0 rounded-full bg-blue-800/20 blur-2xl animate-pulse"></div>
          
          {/* Orbiting elements */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute inset-0"
              style={{
                transformOrigin: "50% 50%"
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut"
                }}
                className={`absolute w-3 h-3 rounded-full shadow-lg ${
                  i === 0 ? 'top-0 left-1/2 -translate-x-1/2' :
                  i === 1 ? 'right-0 top-1/2 -translate-y-1/2' :
                  i === 2 ? 'bottom-0 left-1/2 -translate-x-1/2' :
                  'left-0 top-1/2 -translate-y-1/2'
                }`}
                style={{
                  backgroundColor: i % 2 === 0 ? '#0033A0' : '#4A90E2'
                }}
              />
            </motion.div>
          ))}
          
          {/* Central pulsing core with brand color */}
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div 
              className="w-4 h-4 rounded-full shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #0033A0 0%, #4A90E2 100%)'
              }}
            ></div>
          </motion.div>
        </div>
        
        {/* Brand-themed text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-center"
        >
          <motion.h3
            animate={{
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-2xl font-light tracking-wide"
            style={{ color: '#0033A0' }}
          >
            Loading
          </motion.h3>
        </motion.div>
        
        {/* Brand-colored progress bar */}
        <div className="w-32 h-1 bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            animate={{
              x: ["-100%", "100%"]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="h-full w-1/3 rounded-full"
            style={{
              background: 'linear-gradient(90deg, #0033A0 0%, #4A90E2 100%)'
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;