import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiMapPin } from 'react-icons/fi';
import authService from '../services/authServices';
import logo from '../assets/logo.png';
import background from '../assets/background.png';

const MEMBER_TYPES = ['General', 'Student', 'Faculty', 'Staff'];

const Register = ({ login }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', address: '',
    memberType: 'General', password: '', confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.phone || !form.password || !form.confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 5 || form.password.length > 20) {
      setError('Password must be 5–20 characters.');
      return;
    }
    setLoading(true);
    const result = await authService.register(form);
    setLoading(false);
    if (result.success) {
      login();
      navigate('/dashboard');
    } else {
      setError(result.message);
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
        <div className="px-8 pb-8 pt-6 max-h-[72vh] overflow-y-auto">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-400 text-sm mt-1">Join the BBU Library System</p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-2.5 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Full Name *" icon={FiUser}>
              <input type="text" name="fullName" value={form.fullName} onChange={handleChange}
                placeholder="Your full name" className="flex-1 outline-none text-sm text-gray-900 bg-transparent" />
            </Field>

            <Field label="Email *" icon={FiMail}>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="your@email.com" className="flex-1 outline-none text-sm text-gray-900 bg-transparent" />
            </Field>

            <Field label="Phone *" icon={FiPhone}>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                placeholder="+855 xx xxx xxx" className="flex-1 outline-none text-sm text-gray-900 bg-transparent" />
            </Field>

            <Field label="Address" icon={FiMapPin}>
              <input type="text" name="address" value={form.address} onChange={handleChange}
                placeholder="Your address (optional)" className="flex-1 outline-none text-sm text-gray-900 bg-transparent" />
            </Field>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">Member Type</label>
              <select name="memberType" value={form.memberType} onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-[#000080] focus:border-transparent transition-all text-sm text-gray-900 outline-none">
                {MEMBER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <Field label="Password *" icon={FiLock}>
              <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                placeholder="5–20 characters" className="flex-1 outline-none text-sm text-gray-900 bg-transparent" />
              <button type="button" onClick={() => setShowPassword(v => !v)} className="text-gray-400 hover:text-gray-600" tabIndex={-1}>
                {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </Field>

            <Field label="Confirm Password *" icon={FiLock}>
              <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
                placeholder="Re-enter password" className="flex-1 outline-none text-sm text-gray-900 bg-transparent" />
              <button type="button" onClick={() => setShowConfirm(v => !v)} className="text-gray-400 hover:text-gray-600" tabIndex={-1}>
                {showConfirm ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </Field>

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
                  Creating account...
                </>
              ) : 'Create Account'}
            </button>

            <p className="text-center text-xs text-gray-400 pt-1">
              Already have an account?{' '}
              <Link to="/login" className="text-[#000080] font-medium hover:underline">Sign in</Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;