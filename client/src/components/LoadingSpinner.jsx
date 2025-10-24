import { motion } from 'framer-motion';
import logo from '../assets/logoicon.png';

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
        {/* Logo container with animated ring */}
        <div className="relative h-32 w-32">
          {/* Rotating ring around logo */}
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 rounded-full border-4 border-transparent"
            style={{
              borderTopColor: '#0033A0',
              borderRightColor: '#4A90E2',
            }}
          />

          {/* Second counter-rotating ring */}
          <motion.div
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-2 rounded-full border-4 border-transparent"
            style={{
              borderBottomColor: '#0033A0',
              borderLeftColor: '#4A90E2',
            }}
          />
          
          {/* Background glow */}
          <div className="absolute inset-4 rounded-full bg-blue-800/10 blur-xl animate-pulse"></div>
          
          {/* Logo with pulse animation */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-4 flex items-center justify-center"
          >
            <img 
              src={logo} 
              alt="Loading..." 
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </motion.div>

          {/* Orbiting dots */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.3
              }}
              className="absolute inset-0"
              style={{
                transformOrigin: "50% 50%"
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute w-2.5 h-2.5 rounded-full shadow-lg top-0 left-1/2 -translate-x-1/2"
                style={{
                  backgroundColor: i % 2 === 0 ? '#0033A0' : '#4A90E2'
                }}
              />
            </motion.div>
          ))}
        </div>
        
        {/* Loading text with typing animation effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center"
        >
          <motion.h3
            animate={{
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-xl font-medium tracking-wider"
            style={{ color: '#0033A0' }}
          >
            Loading...
          </motion.h3>
        </motion.div>
        
        {/* Animated progress bar */}
        <div className="w-40 h-1.5 bg-slate-200 rounded-full overflow-hidden shadow-inner">
          <motion.div
            animate={{
              x: ["-100%", "100%"]
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="h-full w-1/2 rounded-full shadow-lg"
            style={{
              background: 'linear-gradient(90deg, #0033A0 0%, #4A90E2 50%, #0033A0 100%)'
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;