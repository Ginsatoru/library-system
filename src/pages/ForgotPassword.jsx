import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import authService from '../services/authServices';
import logo from '../assets/logo.png';
import background from '../assets/background.png';

const ForgotPassword = () => {
  const [emailOrLogin, setEmailOrLogin] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailOrLogin.trim()) {
      setStatus({ type: 'error', message: 'Please enter your email, phone, or full name.' });
      return;
    }
    setLoading(true);
    const result = await authService.forgotPassword(emailOrLogin.trim());
    setLoading(false);
    setStatus({ type: result.success ? 'success' : 'error', message: result.message });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative z-10 bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden"
      >
        {/* Header */}
        <div className="h-32 bg-gradient-to-r from-[#000080] to-indigo-600 flex items-center justify-center">
          <img src={logo} alt="BBU Library" className="h-14 object-contain drop-shadow" />
        </div>

        {/* Content */}
        <div className="px-8 pb-8 pt-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Forgot Password</h2>
            <p className="text-gray-400 text-sm mt-1">We'll send an OTP to your email</p>
          </div>

          {status && (
            <div className={`mb-4 px-4 py-2.5 rounded-2xl text-xs border ${
              status.type === 'success'
                ? 'bg-green-50 border-green-100 text-green-700'
                : 'bg-red-50 border-red-100 text-red-600'
            }`}>
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Email / Phone / Full Name
              </label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus-within:ring-2 focus-within:ring-[#000080] focus-within:border-transparent transition-all">
                <FiMail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={emailOrLogin}
                  onChange={e => { setEmailOrLogin(e.target.value); setStatus(null); }}
                  placeholder="Enter your email, phone, or full name"
                  className="flex-1 outline-none text-sm text-gray-900 bg-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#000080] text-white rounded-full hover:bg-[#000080]/90 transition-colors text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Sending OTP...
                </>
              ) : 'Send OTP'}
            </button>

            {status?.type === 'success' && (
              <div className="text-center">
                <Link
                  to={`/reset-password?login=${encodeURIComponent(emailOrLogin)}`}
                  className="text-xs text-[#000080] font-medium hover:underline"
                >
                  Enter OTP → Reset Password
                </Link>
              </div>
            )}

            <div className="text-center pt-1">
              <Link to="/login" className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600">
                <FiArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;