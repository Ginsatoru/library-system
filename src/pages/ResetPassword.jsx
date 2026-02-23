import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLock, FiKey, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import authService from '../services/authServices';
import logo from '../assets/logo.png';
import background from '../assets/background.png';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    emailOrUserName: searchParams.get('login') || '',
    otpCode: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.emailOrUserName || !form.otpCode || !form.newPassword || !form.confirmNewPassword) {
      setStatus({ type: 'error', message: 'Please fill in all fields.' });
      return;
    }
    if (form.newPassword !== form.confirmNewPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }
    setLoading(true);
    const result = await authService.resetPassword(form);
    setLoading(false);
    if (result.success) {
      setStatus({ type: 'success', message: 'Password reset successfully! Redirecting...' });
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setStatus({ type: 'error', message: result.message });
    }
  };

  const Field = ({ label, icon: Icon, children }) => (
    <div>
      <label className="block text-sm font-medium text-gray-500 mb-2">{label}</label>
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus-within:ring-2 focus-within:ring-[#000080] focus-within:border-transparent transition-all">
        <Icon className="w-5 h-5 text-gray-400 flex-shrink-0" />
        {children}
      </div>
    </div>
  );

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
            <h2 className="text-xl font-bold text-gray-900">Reset Password</h2>
            <p className="text-gray-400 text-sm mt-1">Enter the OTP sent to your email</p>
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
            {/* Read-only identity field */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">Email / Phone / Full Name</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50">
                <span className="text-sm text-gray-500 flex-1">{form.emailOrUserName || 'Not set'}</span>
              </div>
            </div>

            <Field label="OTP Code" icon={FiKey}>
              <input
                type="text"
                name="otpCode"
                value={form.otpCode}
                onChange={handleChange}
                placeholder="6-digit OTP"
                maxLength={6}
                className="flex-1 outline-none text-sm text-gray-900 bg-transparent tracking-widest"
              />
            </Field>

            <Field label="New Password" icon={FiLock}>
              <input
                type={showPwd ? 'text' : 'password'}
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="5–20 characters"
                className="flex-1 outline-none text-sm text-gray-900 bg-transparent"
              />
              <button type="button" onClick={() => setShowPwd(v => !v)}
                className="text-gray-400 hover:text-gray-600" tabIndex={-1}>
                {showPwd ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </Field>

            <Field label="Confirm New Password" icon={FiLock}>
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirmNewPassword"
                value={form.confirmNewPassword}
                onChange={handleChange}
                placeholder="Re-enter new password"
                className="flex-1 outline-none text-sm text-gray-900 bg-transparent"
              />
              <button type="button" onClick={() => setShowConfirm(v => !v)}
                className="text-gray-400 hover:text-gray-600" tabIndex={-1}>
                {showConfirm ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </Field>

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
                  Resetting...
                </>
              ) : 'Reset Password'}
            </button>

            <div className="flex items-center justify-between pt-1">
              <Link to="/forgot-password" className="text-xs text-[#000080] hover:underline">Resend OTP</Link>
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

export default ResetPassword;