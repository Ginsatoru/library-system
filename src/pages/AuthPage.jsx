import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiMapPin, FiKey, FiArrowLeft, FiBook, FiAward } from 'react-icons/fi';
import authService from '../services/authServices';
import logo from '../images/logo.png';
import authPic from '../images/auth-pic.png';
import background from '../assets/background.png';

const MEMBER_TYPES = ['General', 'Student', 'Faculty', 'Staff'];

const BBU_FACULTIES = {
  'Faculty of Business Administration': ['Accounting', 'Finance', 'Management', 'Marketing'],
  'Faculty of Law': ['Legal Studies'],
  'Faculty of Computer Science': ['Computer Science', 'Information Technology', 'Software Engineering'],
  'Faculty of Engineering': ['Civil Engineering', 'Electrical Engineering'],
  'Faculty of Education': ['Education', 'English for Teaching'],
  'Faculty of Social Science': ['Sociology', 'Development Studies'],
  'Faculty of Tourism': ['Hotel Management', 'Tourism Management'],
  'Faculty of Medicine': ['General Medicine', 'Pharmacy'],
  'Faculty of Architecture': ['Architecture', 'Interior Design'],
};

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

const Field = ({ label, icon: Icon, small, children }) => (
  <div>
    <label className={`block font-medium text-gray-500 mb-1 ${small ? 'text-xs' : 'text-sm'}`}>{label}</label>
    <div className={`flex items-center gap-2.5 rounded-xl border border-gray-200 bg-gray-50 focus-within:ring-2 focus-within:ring-[#000080] focus-within:border-transparent transition-all ${small ? 'px-3 py-2.5' : 'px-4 py-3'}`}>
      <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
      {children}
    </div>
  </div>
);

// --- Login Panel
const LoginForm = ({ onSuccess, onForgot, onRegister }) => {
  const { t } = useTranslation('auth');
  const { t: tc } = useTranslation('common');
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
    if (!form.login.trim() || !form.password.trim()) { setError(tc('errors.fillAll')); return; }
    setLoading(true);
    const result = await authService.login({ login: form.login.trim(), password: form.password, rememberMe: form.rememberMe });
    setLoading(false);
    if (result.success) onSuccess();
    else setError(result.message);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="px-4 py-2.5 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs">{error}</div>}
      <Field label={t('login.fieldLogin')} icon={FiUser}>
        <input type="text" name="login" value={form.login} onChange={handleChange}
          placeholder={t('login.fieldLoginPlaceholder')}
          className="flex-1 outline-none text-sm text-gray-900 bg-transparent" autoComplete="username" />
      </Field>
      <Field label={t('login.fieldPassword')} icon={FiLock}>
        <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
          placeholder={t('login.fieldPasswordPlaceholder')}
          className="flex-1 outline-none text-sm text-gray-900 bg-transparent" autoComplete="current-password" />
        <button type="button" onClick={() => setShowPassword(v => !v)} className="text-gray-400 hover:text-gray-600 transition-colors" tabIndex={-1}>
          {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
        </button>
      </Field>
      <div className="flex items-center justify-between pt-0.5">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" name="rememberMe" checked={form.rememberMe} onChange={handleChange}
            className="w-3.5 h-3.5 rounded border-gray-300 text-[#000080] focus:ring-[#000080]" />
          <span className="text-xs text-gray-500">{t('login.rememberMe')}</span>
        </label>
        <button type="button" onClick={onForgot} className="text-xs text-[#000080] font-medium">{t('login.forgotPassword')}</button>
      </div>
      <button type="submit" disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#000080] text-white rounded-2xl hover:bg-[#000080]/90 transition-colors text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed">
        {loading ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>{t('login.submitting')}</> : t('login.submit')}
      </button>
      <p className="text-center text-xs text-gray-400 pt-1">
        {t('login.noAccount')}{' '}
        <button type="button" onClick={onRegister} className="text-[#000080] font-medium">{t('login.createAccount')}</button>
      </p>
    </form>
  );
};

// --- Register Panel
const RegisterForm = ({ onSuccess, onLogin }) => {
  const { t } = useTranslation('auth');
  const { t: tc } = useTranslation('common');
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', address: '',
    memberType: 'General', faculty: '', subject: '',
    password: '', confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'faculty') {
      setForm(prev => ({ ...prev, faculty: value, subject: '' }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.phone || !form.faculty || !form.subject || !form.password || !form.confirmPassword) {
      setError(tc('errors.fillAllRequired')); return;
    }
    if (form.password !== form.confirmPassword) { setError(tc('errors.passwordMismatch')); return; }
    if (form.password.length < 5 || form.password.length > 20) { setError(tc('errors.passwordLength')); return; }
    setLoading(true);
    const result = await authService.register(form);
    setLoading(false);
    if (result.success) onSuccess();
    else setError(result.message);
  };

  const availableSubjects = form.faculty ? BBU_FACULTIES[form.faculty] || [] : [];

  return (
    <form onSubmit={handleSubmit} autoComplete="off" className="space-y-3">
      {error && <div className="px-3 py-2 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs">{error}</div>}

      <div className="grid grid-cols-2 gap-3">
        <Field label={t('register.fieldFullName')} icon={FiUser} small>
          <input type="text" name="fullName" value={form.fullName} onChange={handleChange}
            placeholder={t('register.fieldFullNamePlaceholder')} autoComplete="off"
            className="flex-1 outline-none text-sm text-gray-900 bg-transparent min-w-0" />
        </Field>
        <Field label={t('register.fieldEmail')} icon={FiMail} small>
          <input type="text" name="email" value={form.email} onChange={handleChange}
            placeholder={t('register.fieldEmailPlaceholder')} autoComplete="off"
            className="flex-1 outline-none text-sm text-gray-900 bg-transparent min-w-0" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label={t('register.fieldPhone')} icon={FiPhone} small>
          <input type="tel" name="phone" value={form.phone} onChange={handleChange}
            placeholder={t('register.fieldPhonePlaceholder')} autoComplete="off"
            className="flex-1 outline-none text-sm text-gray-900 bg-transparent min-w-0" />
        </Field>
        <Field label={t('register.fieldAddress')} icon={FiMapPin} small>
          <input type="text" name="address" value={form.address} onChange={handleChange}
            placeholder={t('register.fieldAddressPlaceholder')} autoComplete="off"
            className="flex-1 outline-none text-sm text-gray-900 bg-transparent min-w-0" />
        </Field>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{t('register.fieldMemberType')}</label>
        <select name="memberType" value={form.memberType} onChange={handleChange}
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-[#000080] focus:border-transparent transition-all text-sm text-gray-900 outline-none">
          {MEMBER_TYPES.map(type => (
            <option key={type} value={type}>{t(`memberTypes.${type}`)}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">{t('register.fieldFaculty')}</label>
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus-within:ring-2 focus-within:ring-[#000080] focus-within:border-transparent transition-all">
            <FiAward className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <select name="faculty" value={form.faculty} onChange={handleChange}
              className="flex-1 outline-none text-sm text-gray-900 bg-transparent min-w-0">
              <option value="">{t('register.fieldFacultyPlaceholder')}</option>
              {Object.keys(BBU_FACULTIES).map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">{t('register.fieldSubject')}</label>
          <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus-within:ring-2 focus-within:ring-[#000080] focus-within:border-transparent transition-all ${!form.faculty ? 'opacity-50' : ''}`}>
            <FiBook className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <select name="subject" value={form.subject} onChange={handleChange}
              disabled={!form.faculty}
              className="flex-1 outline-none text-sm text-gray-900 bg-transparent disabled:cursor-not-allowed min-w-0">
              <option value="">{form.faculty ? t('register.fieldSubjectPlaceholder') : t('register.fieldSubjectDisabled')}</option>
              {availableSubjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">{t('register.fieldPassword')}</label>
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus-within:ring-2 focus-within:ring-[#000080] focus-within:border-transparent transition-all">
            <FiLock className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder={t('register.fieldPasswordPlaceholder')}
              autoComplete="new-password"
              className="flex-1 outline-none text-sm text-gray-900 bg-transparent min-w-0"
            />
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowPassword(prev => !prev)}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              tabIndex={-1}
            >
              {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">{t('register.fieldConfirmPassword')}</label>
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus-within:ring-2 focus-within:ring-[#000080] focus-within:border-transparent transition-all">
            <FiLock className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type={showConfirm ? 'text' : 'password'}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder={t('register.fieldConfirmPasswordPlaceholder')}
              autoComplete="new-password"
              className="flex-1 outline-none text-sm text-gray-900 bg-transparent min-w-0"
            />
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowConfirm(prev => !prev)}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              tabIndex={-1}
            >
              {showConfirm ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <button type="submit" disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#000080] text-white rounded-xl hover:bg-[#000080]/90 transition-colors text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed mt-1">
        {loading
          ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>{t('register.submitting')}</>
          : t('register.submit')}
      </button>
      <p className="text-center text-xs text-gray-400 pt-0.5">
        {t('register.hasAccount')}{' '}
        <button type="button" onClick={onLogin} className="text-[#000080] font-medium">{t('register.signIn')}</button>
      </p>
    </form>
  );
};

// --- Forgot Password Panel
const OTP_SENT_MESSAGE = 'OTP sent to your email.';

const ForgotForm = ({ onBack, onOtpSent }) => {
  const { t } = useTranslation('auth');
  const [emailOrLogin, setEmailOrLogin] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailOrLogin.trim()) { setStatus({ type: 'error', message: t('forgot.fieldLoginPlaceholder') }); return; }
    setLoading(true);
    const result = await authService.forgotPassword(emailOrLogin.trim());
    setLoading(false);
    const otpActuallySent = result.success && result.message === OTP_SENT_MESSAGE;
    if (otpActuallySent) {
      setStatus({ type: 'success', message: t('forgot.otpSent') });
      setTimeout(() => onOtpSent(emailOrLogin.trim()), 1200);
    } else if (result.success) {
      setStatus({ type: 'error', message: t('forgot.notFound') });
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
      <Field label={t('forgot.fieldLogin')} icon={FiMail}>
        <input type="text" value={emailOrLogin} onChange={e => { setEmailOrLogin(e.target.value); setStatus(null); }}
          placeholder={t('forgot.fieldLoginPlaceholder')} className="flex-1 outline-none text-sm text-gray-900 bg-transparent" />
      </Field>
      <button type="submit" disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#000080] text-white rounded-2xl hover:bg-[#000080]/90 transition-colors text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed">
        {loading ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>{t('forgot.submitting')}</> : t('forgot.submit')}
      </button>
      <div className="text-center pt-1">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors">
          <FiArrowLeft className="w-3.5 h-3.5" /> {t('forgot.backToLogin')}
        </button>
      </div>
    </form>
  );
};

// --- Reset Password Panel
const ResetForm = ({ prefillLogin, onBack, onSuccess }) => {
  const { t } = useTranslation('auth');
  const { t: tc } = useTranslation('common');
  const [form, setForm] = useState({ emailOrUserName: prefillLogin || '', otpCode: '', newPassword: '', confirmNewPassword: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })); setStatus(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.emailOrUserName || !form.otpCode || !form.newPassword || !form.confirmNewPassword) {
      setStatus({ type: 'error', message: tc('errors.fillAll') }); return;
    }
    if (form.newPassword !== form.confirmNewPassword) {
      setStatus({ type: 'error', message: tc('errors.passwordMismatch') }); return;
    }
    setLoading(true);
    const result = await authService.resetPassword(form);
    setLoading(false);
    if (result.success) {
      setStatus({ type: 'success', message: t('reset.successMessage') });
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
        <label className="block text-sm font-medium text-gray-500 mb-1.5">{t('reset.fieldLogin')}</label>
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50">
          <span className="text-sm text-gray-500 flex-1">{form.emailOrUserName || t('reset.fieldLoginNotSet')}</span>
        </div>
      </div>
      <Field label={t('reset.fieldOtp')} icon={FiKey}>
        <input type="text" name="otpCode" value={form.otpCode} onChange={handleChange}
          placeholder={t('reset.fieldOtpPlaceholder')} maxLength={6}
          className="flex-1 outline-none text-sm text-gray-900 bg-transparent tracking-widest" />
      </Field>
      <Field label={t('reset.fieldNewPassword')} icon={FiLock}>
        <input type={showPwd ? 'text' : 'password'} name="newPassword" value={form.newPassword} onChange={handleChange}
          placeholder={t('reset.fieldNewPasswordPlaceholder')} className="flex-1 outline-none text-sm text-gray-900 bg-transparent" />
        <button type="button" onClick={() => setShowPwd(v => !v)} className="text-gray-400 hover:text-gray-600 transition-colors" tabIndex={-1}>
          {showPwd ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
        </button>
      </Field>
      <Field label={t('reset.fieldConfirmPassword')} icon={FiLock}>
        <input type={showConfirm ? 'text' : 'password'} name="confirmNewPassword" value={form.confirmNewPassword} onChange={handleChange}
          placeholder={t('reset.fieldConfirmPasswordPlaceholder')} className="flex-1 outline-none text-sm text-gray-900 bg-transparent" />
        <button type="button" onClick={() => setShowConfirm(v => !v)} className="text-gray-400 hover:text-gray-600 transition-colors" tabIndex={-1}>
          {showConfirm ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
        </button>
      </Field>
      <button type="submit" disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#000080] text-white rounded-2xl hover:bg-[#000080]/90 transition-colors text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed">
        {loading ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>{t('reset.submitting')}</> : t('reset.submit')}
      </button>
      <div className="flex items-center justify-between pt-1">
        <button type="button" onClick={onBack} className="text-xs text-[#000080] font-medium">{t('reset.resendOtp')}</button>
        <button type="button" onClick={() => onSuccess()} className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors">
          <FiArrowLeft className="w-3.5 h-3.5" /> {t('reset.backToLogin')}
        </button>
      </div>
    </form>
  );
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
  const { t } = useTranslation('auth');

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

  const PANEL_META = {
    [PANEL.LOGIN]:    { title: t('login.title'),    subtitle: t('login.subtitle') },
    [PANEL.REGISTER]: { title: t('register.title'), subtitle: t('register.subtitle') },
    [PANEL.FORGOT]:   { title: t('forgot.title'),   subtitle: t('forgot.subtitle') },
    [PANEL.RESET]:    { title: t('reset.title'),    subtitle: t('reset.subtitle') },
  };

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
        className="relative z-10 bg-white shadow-2xl w-full overflow-hidden flex flex-col sm:flex-row sm:items-stretch rounded-[2rem] max-w-4xl"
      >
        {/* Left image panel */}
        <div className={`relative flex-shrink-0 overflow-hidden hidden sm:block rounded-[2rem] m-2 ${
          isRegister ? 'sm:w-[42%]' : 'sm:w-[45%]'
        }`}>
          <img src={authPic} alt="Library" className="w-full h-full object-cover object-top sm:object-center absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        {/* Right form panel */}
        <div className={`flex-1 flex flex-col ${
          isRegister
            ? 'px-5 sm:px-8 py-4 sm:py-5 justify-start overflow-y-auto'
            : 'px-6 sm:px-10 py-5 sm:py-6 justify-center overflow-hidden'
        }`}>
          <div className={`flex items-center justify-center ${isRegister ? 'mb-3' : 'mb-5'}`}>
            <img src={logo} alt="BBU Library" className={`object-contain ${isRegister ? 'h-10' : 'h-14'}`} />
          </div>

          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={panel + '-title'}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className={`text-center ${isRegister ? 'mb-3' : 'mb-5'}`}
            >
              <h2 className={`font-bold text-gray-900 tracking-tight ${isRegister ? 'text-xl' : 'text-2xl'}`}>{title}</h2>
              <p className={`text-gray-400 mt-0.5 ${isRegister ? 'text-xs' : 'text-sm'}`}>{subtitle}</p>
            </motion.div>
          </AnimatePresence>

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