import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import logo from '../assets/logoicon.png';

const LoadingSpinner = () => {
  const { t } = useTranslation('common');

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 60% 40%, #e8eeff 0%, #f0f4ff 40%, #f8f9ff 100%)' }}
    >
      {/* Ambient background orbs */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,51,160,0.12) 0%, transparent 70%)', top: '10%', left: '15%' }}
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(74,144,226,0.15) 0%, transparent 70%)', bottom: '10%', right: '15%' }}
      />

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(#0033A0 1px, transparent 1px), linear-gradient(90deg, #0033A0 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />

      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-10"
      >
        {/* Logo + rings */}
        <div className="relative w-36 h-36">

          {/* Outer glow ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, transparent 60%, rgba(0,51,160,0.4) 100%)',
              filter: 'blur(1px)'
            }}
          />

          {/* Primary spinning arc */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-[3px] border-transparent"
            style={{ borderTopColor: '#0033A0', borderRightColor: 'rgba(0,51,160,0.3)' }}
          />

          {/* Secondary counter-arc */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-[6px] rounded-full border-[2px] border-transparent"
            style={{ borderBottomColor: '#4A90E2', borderLeftColor: 'rgba(74,144,226,0.3)' }}
          />

          {/* Inner soft glow */}
          <motion.div
            animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.9, 1.05, 0.9] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-[14px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(0,51,160,0.15) 0%, transparent 80%)' }}
          />

          {/* Logo */}
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-[18px] flex items-center justify-center"
          >
            <img src={logo} alt="BBU Library" className="w-full h-full object-contain drop-shadow-md" />
          </motion.div>

          {/* Orbiting dots */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: i * 0.9 }}
              className="absolute inset-0"
            >
              <motion.div
                animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                className="absolute w-2 h-2 rounded-full top-[2px] left-1/2 -translate-x-1/2 shadow-md"
                style={{ backgroundColor: i % 2 === 0 ? '#0033A0' : '#4A90E2' }}
              />
            </motion.div>
          ))}
        </div>

        {/* Text + bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col items-center gap-4"
        >
          {/* Brand name */}
          <div className="text-center">
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              className="text-xs font-semibold uppercase tracking-[0.3em] mb-1"
              style={{ color: '#4A90E2' }}
            >
              BBU Library
            </motion.p>
            <motion.h3
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
              className="text-base font-medium tracking-widest"
              style={{ color: '#0033A0' }}
            >
              {t('status.loading')}
            </motion.h3>
          </div>

          {/* Progress bar */}
          <div className="w-36 h-[3px] rounded-full overflow-hidden"
            style={{ background: 'rgba(0,51,160,0.1)' }}
          >
            <motion.div
              animate={{ x: ['-100%', '180%'] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }}
              className="h-full w-1/2 rounded-full"
              style={{ background: 'linear-gradient(90deg, transparent, #0033A0, #4A90E2, transparent)' }}
            />
          </div>

          {/* Dot indicators */}
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.1, 0.8] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
                className="w-1 h-1 rounded-full"
                style={{ backgroundColor: '#0033A0' }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;