import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import logo from '../assets/logoicon.png';

const LoadingSpinner = () => {
  const { t } = useTranslation('common');

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden bg-white">
      {/* Minimal background - just a subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50" />
      
      {/* Single subtle accent dot - barely there */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{ 
          background: 'radial-gradient(circle, rgba(0,51,160,0.03) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-8 relative"
      >
        {/* Clean logo container */}
        <div className="relative w-28 h-28">
          {/* Single refined ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border border-gray-200"
            style={{ borderTopColor: '#0033A0', borderRightColor: 'transparent' }}
          />
          
          {/* Logo */}
          <div className="absolute inset-3 flex items-center justify-center">
            <img 
              src={logo} 
              alt="BBU Library" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Minimal text area */}
        <div className="flex flex-col items-center gap-3">
          {/* Simple text with clean fade */}
          <motion.p
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-xs font-medium text-gray-400 tracking-[0.2em] uppercase"
          >
            BBU Library
          </motion.p>
          
          <motion.p
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
            className="text-sm text-gray-500 font-light"
          >
            {t('status.loading')}
          </motion.p>

          {/* Ultra-minimal progress indicator - just a thin line */}
          <div className="w-24 h-px bg-gray-100 mt-2 overflow-hidden">
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              className="w-full h-full bg-gray-300"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;