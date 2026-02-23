import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import authService from '../services/authServices';
import logo from '../assets/logo.png';
import background from '../assets/background.png';

const Login = ({ login }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ login: '', password: '', rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.login.trim() || !form.password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    const result = await authService.login({
      login: form.login.trim(),
      password: form.password,
      rememberMe: form.rememberMe,
    });
    setLoading(false);
    if (result.success) {
      login();
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
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
            <h2 className="text-xl font-bold text-gray-900">Member Portal</h2>
            <p className="text-gray-400 text-sm mt-1">Sign in to your library account</p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-2.5 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Email / Phone / Full Name
              </label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus-within:ring-2 focus-within:ring-[#000080] focus-within:border-transparent transition-all">
                <FiUser className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  name="login"
                  value={form.login}
                  onChange={handleChange}
                  placeholder="Enter email, phone, or full name"
                  className="flex-1 outline-none text-sm text-gray-900 bg-transparent"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">Password</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus-within:ring-2 focus-within:ring-[#000080] focus-within:border-transparent transition-all">
                <FiLock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="flex-1 outline-none text-sm text-gray-900 bg-transparent"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="text-gray-400 hover:text-gray-600" tabIndex={-1}>
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={form.rememberMe}
                  onChange={handleChange}
                  className="w-3.5 h-3.5 rounded border-gray-300 text-[#000080] focus:ring-[#000080]"
                />
                <span className="text-xs text-gray-500">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-xs text-[#000080] hover:underline font-medium">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#000080] text-white rounded-full hover:bg-[#000080]/90 transition-colors text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>

            <p className="text-center text-xs text-gray-400 pt-1">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#000080] font-medium hover:underline">
                Register here
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;