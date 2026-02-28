import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiMapPin, FiKey, FiArrowLeft } from 'react-icons/fi';
import authService from '../services/authServices';
import logo from '../images/logo.png';
import authPic from '../images/auth-pic.png';
import background from '../assets/background.png';

const MEMBER_TYPES = ['General', 'Student', 'Faculty', 'Staff'];

const PANEL = {
  LOGIN: 'login',
  REGISTER: 'register',
  FORGOT: 'forgot',
  RESET: 'reset',
};

const PANEL_PATHS = {
  [PANEL.LOGIN]: '/login',
  [PANEL.REGISTER]: '/register',
  [PANEL.FORGOT]: '/forgot-password',
  [PANEL.RESET]: '/reset-password',
};

const Field = ({ label, icon: Icon, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-500 mb-1.5">{label}</label>
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus-within:ring-2 focus-within:ring-[#000080] focus-within:border-transparent transition-all">
      <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
      {children}
    </div>
  </div>
);

// --- Login Panel
const LoginForm = ({ onSuccess, onForgot, onRegister }) => {
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
    if (!form.login.trim() || !form.password.trim()) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    const result = await authService.login({ login: form.login.trim(), password: form.password, rememberMe: form.rememberMe });
    setLoading(false);
    if (result.success) onSuccess();
    else setError(result.message);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="px-4 py-2.5 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs">{error}</div>}
      <Field label="Email / Phone / Full Name" icon={FiUser}>
        <input type="text" name="login" value={form.login} onChange={handleChange}
          placeholder="Enter email, phone, or full name"
          className="flex-1 outline-none text-sm text-gray-900 bg-transparent" autoComplete="username" />
      </Field>
      <Field label="Password" icon={FiLock}>
        <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
          placeholder="Enter your password"
          className="flex-1 outline-none text-sm text-gray-900 bg-transparent" autoComplete="current-password" />
        <button type="button" onClick={() => setShowPassword(v => !v)} className="text-gray-400 hover:text-gray-600 transition-colors" tabIndex={-1}>
          {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
        </button>
      </Field>
      <div className="flex items-center justify-between pt-0.5">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" name="rememberMe" checked={form.rememberMe} onChange={handleChange}
            className="w-3.5 h-3.5 rounded border-gray-300 text-[#000080] focus:ring-[#000080]" />
          <span className="text-xs text-gray-500">Remember me</span>
        </label>
        <button type="button" onClick={onForgot} className="text-xs text-[#000080] font-medium">Forgot password?</button>
      </div>
      <button type="submit" disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#000080] text-white rounded-2xl hover:bg-[#000080]/90 transition-colors text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed">
        {loading ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Signing in...</> : 'Login'}
      </button>
      <p className="text-center text-xs text-gray-400 pt-1">
        New here?{' '}
        <button type="button" onClick={onRegister} className="text-[#000080] font-medium">Create account</button>
      </p>
    </form>
  );
};

// --- Register Panel
const RegisterForm = ({ onSuccess, onLogin }) => {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', address: '', memberType: 'General', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.phone || !form.password || !form.confirmPassword) { setError('Please fill in all required fields.'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    if (form.password.length < 5 || form.password.length > 20) { setError('Password must be 5-20 characters.'); return; }
    setLoading(true);
    const result = await authService.register(form);
    setLoading(false);
    if (result.success) onSuccess();
    else setError(result.message);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      {error && <div className="px-4 py-2.5 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs">{error}</div>}
      <Field label="Full Name *" icon={FiUser}>
        <input type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Your full name" className="flex-1 outline-none text-sm text-gray-900 bg-transparent" />
      </Field>
      <Field label="Email *" icon={FiMail}>
        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" className="flex-1 outline-none text-sm text-gray-900 bg-transparent" />
      </Field>
      <Field label="Phone *" icon={FiPhone}>
        <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+855 xx xxx xxx" className="flex-1 outline-none text-sm text-gray-900 bg-transparent" autoComplete="off" />
      </Field>
      <Field label="Address" icon={FiMapPin}>
        <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="Your address (optional)" className="flex-1 outline-none text-sm text-gray-900 bg-transparent" />
      </Field>
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-1.5">Member Type</label>
        <select name="memberType" value={form.memberType} onChange={handleChange}
          className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-[#000080] focus:border-transparent transition-all text-sm text-gray-900 outline-none">
          {MEMBER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <Field label="Password *" icon={FiLock}>
        <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="5-20 characters" className="flex-1 outline-none text-sm text-gray-900 bg-transparent" />
        <button type="button" onClick={() => setShowPassword(v => !v)} className="text-gray-400 hover:text-gray-600 transition-colors" tabIndex={-1}>
          {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
        </button>
      </Field>
      <Field label="Confirm Password *" icon={FiLock}>
        <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Re-enter password" className="flex-1 outline-none text-sm text-gray-900 bg-transparent" />
        <button type="button" onClick={() => setShowConfirm(v => !v)} className="text-gray-400 hover:text-gray-600 transition-colors" tabIndex={-1}>
          {showConfirm ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
        </button>
      </Field>
      <button type="submit" disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#000080] text-white rounded-2xl hover:bg-[#000080]/90 transition-colors text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed mt-1">
        {loading ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Creating account...</> : 'Create Account'}
      </button>
      <p className="text-center text-xs text-gray-400 pt-1">
        Already have an account?{' '}
        <button type="button" onClick={onLogin} className="text-[#000080] font-medium">Sign in</button>
      </p>
    </form>
  );
};

// --- Forgot Password Panel
const OTP_SENT_MESSAGE = 'OTP sent to your email.';

const ForgotForm = ({ onBack, onOtpSent }) => {
  const [emailOrLogin, setEmailOrLogin] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailOrLogin.trim()) { setStatus({ type: 'error', message: 'Please enter your email, phone, or full name.' }); return; }
    setLoading(true);
    const result = await authService.forgotPassword(emailOrLogin.trim());
    setLoading(false);
    const otpActuallySent = result.success && result.message === OTP_SENT_MESSAGE;
    if (otpActuallySent) {
      setStatus({ type: 'success', message: 'OTP sent! Redirecting...' });
      setTimeout(() => onOtpSent(emailOrLogin.trim()), 1200);
    } else if (result.success) {
      setStatus({ type: 'error', message: 'No account found with that email, phone, or name. Please try again.' });
    } else {
      setStatus({ type: 'error', message: result.message });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status && (
        <div className={`px-4 py-2.5 rounded-2xl text-xs border ${status.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-600'}`}>
          {status.message}
        </div>
      )}
      <Field label="Email / Phone / Full Name" icon={FiMail}>
        <input type="text" value={emailOrLogin} onChange={e => { setEmailOrLogin(e.target.value); setStatus(null); }}
          placeholder="Enter your email, phone, or full name" className="flex-1 outline-none text-sm text-gray-900 bg-transparent" />
      </Field>
      <button type="submit" disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#000080] text-white rounded-2xl hover:bg-[#000080]/90 transition-colors text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed">
        {loading ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Sending OTP...</> : 'Send OTP'}
      </button>
      <div className="text-center pt-1">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors">
          <FiArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </button>
      </div>
    </form>
  );
};

// --- Reset Password Panel
const ResetForm = ({ prefillLogin, onBack, onSuccess }) => {
  const [form, setForm] = useState({ emailOrUserName: prefillLogin || '', otpCode: '', newPassword: '', confirmNewPassword: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })); setStatus(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.emailOrUserName || !form.otpCode || !form.newPassword || !form.confirmNewPassword) { setStatus({ type: 'error', message: 'Please fill in all fields.' }); return; }
    if (form.newPassword !== form.confirmNewPassword) { setStatus({ type: 'error', message: 'Passwords do not match.' }); return; }
    setLoading(true);
    const result = await authService.resetPassword(form);
    setLoading(false);
    if (result.success) {
      setStatus({ type: 'success', message: 'Password reset! Redirecting to login...' });
      setTimeout(() => onSuccess(), 1500);
    } else {
      setStatus({ type: 'error', message: result.message });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status && (
        <div className={`px-4 py-2.5 rounded-2xl text-xs border ${status.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-600'}`}>
          {status.message}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-1.5">Email / Phone / Full Name</label>
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50">
          <span className="text-sm text-gray-500 flex-1">{form.emailOrUserName || 'Not set'}</span>
        </div>
      </div>
      <Field label="OTP Code" icon={FiKey}>
        <input type="text" name="otpCode" value={form.otpCode} onChange={handleChange}
          placeholder="6-digit OTP" maxLength={6} className="flex-1 outline-none text-sm text-gray-900 bg-transparent tracking-widest" />
      </Field>
      <Field label="New Password" icon={FiLock}>
        <input type={showPwd ? 'text' : 'password'} name="newPassword" value={form.newPassword} onChange={handleChange}
          placeholder="5-20 characters" className="flex-1 outline-none text-sm text-gray-900 bg-transparent" />
        <button type="button" onClick={() => setShowPwd(v => !v)} className="text-gray-400 hover:text-gray-600 transition-colors" tabIndex={-1}>
          {showPwd ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
        </button>
      </Field>
      <Field label="Confirm New Password" icon={FiLock}>
        <input type={showConfirm ? 'text' : 'password'} name="confirmNewPassword" value={form.confirmNewPassword} onChange={handleChange}
          placeholder="Re-enter new password" className="flex-1 outline-none text-sm text-gray-900 bg-transparent" />
        <button type="button" onClick={() => setShowConfirm(v => !v)} className="text-gray-400 hover:text-gray-600 transition-colors" tabIndex={-1}>
          {showConfirm ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
        </button>
      </Field>
      <button type="submit" disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#000080] text-white rounded-2xl hover:bg-[#000080]/90 transition-colors text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed">
        {loading ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Resetting...</> : 'Reset Password'}
      </button>
      <div className="flex items-center justify-between pt-1">
        <button type="button" onClick={onBack} className="text-xs text-[#000080] font-medium">Resend OTP</button>
        <button type="button" onClick={() => onSuccess()} className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors">
          <FiArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </button>
      </div>
    </form>
  );
};

// --- Panel metadata
const PANEL_META = {
  [PANEL.LOGIN]:    { title: 'Welcome back',    subtitle: 'Sign in to your library account' },
  [PANEL.REGISTER]: { title: 'Create account',  subtitle: 'Join the BBU Library System' },
  [PANEL.FORGOT]:   { title: 'Forgot password', subtitle: "We'll send an OTP to your email" },
  [PANEL.RESET]:    { title: 'Reset password',  subtitle: 'Enter the OTP sent to your email' },
};

const slideVariants = {
  enter: (dir) => ({ x: dir === 'forward' ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir) => ({ x: dir === 'forward' ? -60 : 60, opacity: 0 }),
};

// --- Main AuthPage
const AuthPage = ({ login }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getInitialPanel = () => {
    if (location.pathname === '/register') return PANEL.REGISTER;
    if (location.pathname === '/forgot-password') return PANEL.FORGOT;
    if (location.pathname === '/reset-password') return PANEL.RESET;
    return PANEL.LOGIN;
  };

  const [panel, setPanel] = useState(getInitialPanel);
  const [dir, setDir] = useState('forward');
  const [otpLogin, setOtpLogin] = useState('');

  const go = (next, direction = 'forward') => {
    setDir(direction);
    setPanel(next);
    navigate(PANEL_PATHS[next], { replace: true });
  };

  const handleLoginSuccess = () => { login(); navigate('/'); };
  const handleRegisterSuccess = () => { login(); navigate('/'); };
  const handleResetSuccess = () => go(PANEL.LOGIN, 'back');
  const handleOtpSent = (loginVal) => { setOtpLogin(loginVal); go(PANEL.RESET, 'forward'); };

  const { title, subtitle } = PANEL_META[panel];
  const isRegister = panel === PANEL.REGISTER;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="relative z-10 bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col sm:flex-row sm:items-stretch"
      >
        {/* Image panel — compact banner on mobile, left column on desktop */}
        <div className={`relative flex-shrink-0 overflow-hidden rounded-[2rem] m-2 hidden sm:block ${isRegister ? "sm:w-[48%]" : "sm:w-[45%]"}`}>
          <img
            src={authPic}
            alt="Library"
            className="w-full h-full object-cover object-top sm:object-center absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        {/* Form panel */}
        <div className={`flex-1 flex flex-col px-6 sm:px-10 py-5 sm:py-6 ${isRegister ? 'justify-start overflow-y-auto' : 'justify-center overflow-hidden'}`}>

          {/* Logo */}
          <div className="flex items-center justify-center mb-5">
            <img src={logo} alt="BBU Library" className="h-14 object-contain" />
          </div>

          {/* Animated title */}
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={panel + '-title'}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="mb-5 text-center"
            >
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h2>
              <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
            </motion.div>
          </AnimatePresence>

          {/* Animated form body */}
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={panel}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {panel === PANEL.LOGIN && (
                <LoginForm
                  onSuccess={handleLoginSuccess}
                  onForgot={() => go(PANEL.FORGOT, 'forward')}
                  onRegister={() => go(PANEL.REGISTER, 'forward')}
                />
              )}
              {panel === PANEL.REGISTER && (
                <RegisterForm
                  onSuccess={handleRegisterSuccess}
                  onLogin={() => go(PANEL.LOGIN, 'back')}
                />
              )}
              {panel === PANEL.FORGOT && (
                <ForgotForm
                  onBack={() => go(PANEL.LOGIN, 'back')}
                  onOtpSent={handleOtpSent}
                />
              )}
              {panel === PANEL.RESET && (
                <ResetForm
                  prefillLogin={otpLogin}
                  onBack={() => go(PANEL.FORGOT, 'back')}
                  onSuccess={handleResetSuccess}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;