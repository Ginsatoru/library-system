import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { FiUser, FiMail, FiEdit2, FiSave, FiX, FiCamera, FiBook, FiAward, FiPhone, FiMapPin, FiMessageCircle, FiCreditCard, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import memberService from '../services/memberServices';
import authService from '../services/authServices';
import { useNavigate } from 'react-router-dom';

const Profile = ({ showToast }) => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [isUploadingPic, setIsUploadingPic] = useState(false);
  const [picError, setPicError] = useState(null);
  const [picVersion, setPicVersion] = useState(Date.now());
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({ fullName: '', phone: '', address: '', gender: '' });
  const [telegramData, setTelegramData] = useState({ telegramChatId: '', telegramUsername: '' });

  // Password modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    setError(null);
    const result = await memberService.getProfile();
    if (result.success) {
      setProfile(result.data);
      setFormData({
        fullName: result.data.fullName || '',
        phone: result.data.phone || '',
        address: result.data.address || '',
        gender: result.data.gender || '',
      });
      setTelegramData({
        telegramChatId: result.data.telegramChatId || '',
        telegramUsername: result.data.telegramUsername || '',
      });
    } else {
      // null = 401 handled globally, don't show inline error
      if (result.message) setError(result.message);
    }
    setIsLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTelegramChange = (e) => {
    const { name, value } = e.target;
    setTelegramData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    const [profileResult, telegramResult] = await Promise.all([
      memberService.updateProfile(formData),
      memberService.updateTelegram(telegramData),
    ]);
    if (profileResult.success && telegramResult.success) {
      const updated = { ...profile, ...formData, ...telegramData };
      setProfile(updated);
      const storedUser = authService.getStoredUser();
      if (storedUser) {
        localStorage.setItem('user', JSON.stringify({ ...storedUser, fullName: formData.fullName }));
      }
      setIsEditing(false);
      showToast?.('success', 'Profile updated', 'Your changes have been saved.');
    } else {
      const msg = profileResult.message || telegramResult.message || null;
      if (msg) {
        setSaveError(msg);
        showToast?.('error', 'Save failed', msg);
      }
    }
    setIsSaving(false);
  };

  const handleCancel = () => {
    setFormData({
      fullName: profile.fullName || '',
      phone: profile.phone || '',
      address: profile.address || '',
      gender: profile.gender || '',
    });
    setTelegramData({
      telegramChatId: profile.telegramChatId || '',
      telegramUsername: profile.telegramUsername || '',
    });
    setSaveError(null);
    setIsEditing(false);
  };

  // Profile picture
  const handlePictureClick = () => {
    setPicError(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingPic(true);
    setPicError(null);
    const result = await memberService.uploadProfilePicture(file);
    if (result.success) {
      setImageError(false);
      setPicVersion(Date.now());
      setProfile(prev => ({ ...prev, profilePicture: result.profilePicture }));
      showToast?.('success', 'Photo updated', 'Your profile picture has been changed.');
    } else {
      if (result.message) {
        setPicError(result.message);
        showToast?.('error', 'Upload failed', result.message);
      }
    }
    setIsUploadingPic(false);
    e.target.value = '';
  };

  // Password change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSave = async () => {
    setIsSavingPassword(true);
    setPasswordError(null);
    setPasswordSuccess(null);
    const result = await memberService.changePassword(passwordForm);
    if (result.success) {
      setPasswordSuccess(result.message);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      showToast?.('success', 'Password changed', 'Your password has been updated.');
      setTimeout(() => { setShowPasswordModal(false); setPasswordSuccess(null); }, 1500);
    } else {
      if (result.message) {
        setPasswordError(result.message);
        showToast?.('error', 'Password change failed', result.message);
      }
    }
    setIsSavingPassword(false);
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    setPasswordError(null);
    setPasswordSuccess(null);
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
  };

  const getProfilePicUrl = () => {
    if (profile?.profilePicture && !imageError) {
      return `${profile.profilePicture}?v=${picVersion}`;
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#000080]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <button onClick={loadProfile} className="px-4 py-2 bg-[#000080] text-white rounded-lg hover:bg-[#000080]/90">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f7ff] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">

          {/* Left Column */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-1">

            {/* Profile Card */}
            <div className="bg-white rounded-[2rem] shadow-lg border border-gray-100 overflow-hidden max-w-sm mx-auto w-full">

              {/* Large photo area */}
              <div className="p-1.5 bg-white">
                <div className="relative w-full aspect-[1/1] bg-gray-100 rounded-[1.5rem] overflow-hidden">
                  {isUploadingPic ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#000080]"></div>
                    </div>
                  ) : getProfilePicUrl() ? (
                    <img
                      key={picVersion}
                      src={getProfilePicUrl()}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-50">
                      <FiUser className="w-20 h-20 text-gray-300" />
                    </div>
                  )}

                  {/* Camera button */}
                  <button
                    onClick={handlePictureClick}
                    disabled={isUploadingPic}
                    title="Change profile picture"
                    className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-md border border-gray-200 hover:bg-white transition-all disabled:opacity-50"
                  >
                    <FiCamera className="w-4 h-4 text-gray-700" />
                  </button>
                  <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.gif,.webp" className="hidden" onChange={handleFileChange} />
                </div>
              </div>

              {/* Info section */}
              <div className="px-4 pt-3 pb-4">

                {picError && <p className="mb-2 text-xs text-red-500">{picError}</p>}

                {/* Name + status tick */}
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-gray-900 leading-tight">{profile?.fullName || "—"}</h2>
                  {profile?.isActive ? (
                    <svg title="Active" className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <polygon points="12.0,0.5 15.01,3.73 19.39,3.19 19.62,7.6 23.33,10.0 20.67,13.53 21.96,17.75 17.66,18.74 15.93,22.81 12.0,20.8 8.07,22.81 6.34,18.74 2.04,17.75 3.33,13.53 0.67,10.0 4.38,7.6 4.61,3.19 8.99,3.73" fill="#22c55e"/>
                      <path d="M8.5 12.5l2.5 2.5 5-5.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </svg>
                  ) : (
                    <svg title="Inactive" className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <polygon points="12.0,0.5 15.01,3.73 19.39,3.19 19.62,7.6 23.33,10.0 20.67,13.53 21.96,17.75 17.66,18.74 15.93,22.81 12.0,20.8 8.07,22.81 6.34,18.74 2.04,17.75 3.33,13.53 0.67,10.0 4.38,7.6 4.61,3.19 8.99,3.73" fill="#f87171"/>
                      <path d="M9.5 9.5l5 5M14.5 9.5l-5 5" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                    </svg>
                  )}
                </div>

                {/* Member type as subtitle */}
                <p className="mt-1 text-sm text-gray-500 leading-snug">{profile?.memberType || "Library Member"}</p>

                {/* Divider */}
                <div className="my-4 border-t border-gray-100" />

                {/* Stats row */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <FiCreditCard className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-600 font-medium">{profile?.diCardNumber || "—"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FiBook className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-600 font-medium">{profile?.memberType || "—"}</span>
                  </div>
                </div>

                {/* Join date */}
                {profile?.joinDate && (
                  <p className="mt-3 text-xs text-gray-400">
                    Member since {new Date(profile.joinDate).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="mt-4 bg-white rounded-2xl shadow-lg border border-gray-100 p-5"
            >
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => navigate('/browse')}
                  className="flex items-center gap-2 px-3 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#000080] transition-colors"
                >
                  <FiBook className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium">Library</span>
                </button>
                <button
                  onClick={() => navigate('/history')}
                  className="flex items-center gap-2 px-3 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#000080] transition-colors"
                >
                  <FiAward className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium">My History</span>
                </button>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="">
            <div className="bg-white rounded-[2rem] shadow-lg border border-gray-100 p-5">

              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-semibold text-gray-900">Personal Information</h3>
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-[#000080] text-white rounded-full hover:bg-[#000080]/90 transition-colors">
                    <FiEdit2 className="w-3.5 h-3.5" /><span>Edit</span>
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={handleSave} disabled={isSaving}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors disabled:opacity-60">
                      <FiSave className="w-4 h-4" /><span>{isSaving ? 'Saving...' : 'Save'}</span>
                    </button>
                    <button onClick={handleCancel} disabled={isSaving}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
                      <FiX className="w-4 h-4" /><span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              {saveError && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm">{saveError}</div>
              )}

              <div className="space-y-3">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Full Name</label>
                  {isEditing ? (
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                      autoComplete="off"
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200  focus:ring-[#000080] focus:border-transparent transition-all bg-gray-50" />
                  ) : (
                    <div className="flex items-center gap-2.5 px-3 py-2.5 bg-gray-50 rounded-xl">
                      <FiUser className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{profile?.fullName || '—'}</span>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Email Address</label>
                  <div className="flex items-center gap-2.5 px-3 py-2.5 bg-gray-50 rounded-xl">
                    <FiMail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">{profile?.email || '—'}</span>
                    <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Cannot be changed</span>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Phone</label>
                  {isEditing ? (
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                      autoComplete="off"
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200  focus:ring-[#000080] focus:border-transparent transition-all bg-gray-50" />
                  ) : (
                    <div className="flex items-center gap-2.5 px-3 py-2.5 bg-gray-50 rounded-xl">
                      <FiPhone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{profile?.phone || '—'}</span>
                    </div>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Address</label>
                  {isEditing ? (
                    <input type="text" name="address" value={formData.address} onChange={handleChange}
                      autoComplete="off"
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200  focus:ring-[#000080] focus:border-transparent transition-all bg-gray-50" />
                  ) : (
                    <div className="flex items-center gap-2.5 px-3 py-2.5 bg-gray-50 rounded-xl">
                      <FiMapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{profile?.address || '—'}</span>
                    </div>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Gender</label>
                  {isEditing ? (
                    <select name="gender" value={formData.gender} onChange={handleChange}
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200  focus:ring-[#000080] focus:border-transparent transition-all bg-gray-50">
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <div className="flex items-center gap-2.5 px-3 py-2.5 bg-gray-50 rounded-xl">
                      <FiUser className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{profile?.gender || '—'}</span>
                    </div>
                  )}
                </div>

                {/* Telegram */}
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Telegram</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Telegram Chat ID</label>
                      {isEditing ? (
                        <input type="text" name="telegramChatId" value={telegramData.telegramChatId} onChange={handleTelegramChange}
                          placeholder="Numeric chat ID from your bot"
                          autoComplete="off"
                          className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200  focus:ring-[#000080] focus:border-transparent transition-all bg-gray-50" />
                      ) : (
                        <div className="flex items-center gap-2.5 px-3 py-2.5 bg-gray-50 rounded-xl">
                          <FiMessageCircle className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{profile?.telegramChatId || '—'}</span>
                        </div>
                      )}
                      <p className="mt-1 text-xs text-gray-400">Chat ID used for Telegram reminders. Set via the Telegram bot.</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Telegram Username</label>
                      {isEditing ? (
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">@</span>
                          <input type="text" name="telegramUsername" value={telegramData.telegramUsername} onChange={handleTelegramChange}
                            placeholder="your_username"
                            autoComplete="off"
                            className="w-full pl-7 pr-3 py-2.5 text-sm rounded-xl border border-gray-200  focus:ring-[#000080] focus:border-transparent transition-all bg-gray-50" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2.5 px-3 py-2.5 bg-gray-50 rounded-xl">
                          <FiMessageCircle className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{profile?.telegramUsername ? `@${profile.telegramUsername}` : '—'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Account Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Library Card / Member ID</label>
                      <div className="flex items-center gap-2.5 px-3 py-2.5 bg-gray-50 rounded-xl">
                        <FiCreditCard className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-500">{profile?.diCardNumber || '—'}</span>
                        <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Read only</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Notes</label>
                      <div className="px-3 py-2.5 bg-gray-50 rounded-xl min-h-[40px]">
                        <span className="text-gray-500">{profile?.notes || '—'}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-blue-50/60 rounded-xl p-3">
                        <p className="text-xs text-gray-500 mb-0.5">Member Since</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {profile?.joinDate
                            ? new Date(profile.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                            : '—'}
                        </p>
                      </div>
                      <div className="bg-indigo-50/60 rounded-xl p-3">
                        <p className="text-xs text-gray-500 mb-0.5">Account Status</p>
                        <p className={`text-sm font-semibold ${profile?.isActive ? 'text-green-600' : 'text-red-500'}`}>
                          {profile?.isActive ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="mt-4 bg-white rounded-[2rem] shadow-lg border border-gray-100 p-5"
            >
              <h3 className="text-base font-semibold text-gray-900 mb-3">Security</h3>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 hover:border-[#000080]/30 hover:bg-blue-50/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <FiLock className="w-4 h-4 text-gray-400 group-hover:text-[#000080]" />
                  <span className="text-sm font-medium text-gray-900 group-hover:text-[#000080]">Change Password</span>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-[#000080]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Password Change Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
            onClick={(e) => { if (e.target === e.currentTarget) handleClosePasswordModal(); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-6 sm:p-8"
            >
              <input type="text" className="hidden" autoComplete="username" readOnly />
              <input type="password" className="hidden" autoComplete="current-password" readOnly />

              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
                <button onClick={handleClosePasswordModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <FiX className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {passwordError && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm">{passwordError}</div>
              )}
              {passwordSuccess && (
                <div className="mb-4 px-4 py-3 bg-green-50 border border-green-100 rounded-2xl text-green-600 text-sm">{passwordSuccess}</div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                      autoComplete="off"
                      className="w-full px-3 py-2.5 pr-10 text-sm rounded-xl border border-gray-200  focus:ring-[#000080] focus:border-transparent transition-all bg-gray-50"
                    />
                    <button type="button" onClick={() => setShowCurrent(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showCurrent ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">New Password</label>
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="5–20 characters"
                      autoComplete="new-password"
                      className="w-full px-3 py-2.5 pr-10 text-sm rounded-xl border border-gray-200  focus:ring-[#000080] focus:border-transparent transition-all bg-gray-50"
                    />
                    <button type="button" onClick={() => setShowNew(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showNew ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      name="confirmNewPassword"
                      value={passwordForm.confirmNewPassword}
                      onChange={handlePasswordChange}
                      placeholder="Repeat new password"
                      autoComplete="new-password"
                      className="w-full px-3 py-2.5 pr-10 text-sm rounded-xl border border-gray-200  focus:ring-[#000080] focus:border-transparent transition-all bg-gray-50"
                    />
                    <button type="button" onClick={() => setShowConfirm(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showConfirm ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={handlePasswordSave} disabled={isSavingPassword}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#000080] text-white rounded-full hover:bg-[#000080]/90 transition-colors disabled:opacity-60">
                  <FiLock className="w-4 h-4" />
                  <span>{isSavingPassword ? 'Saving...' : 'Change Password'}</span>
                </button>
                <button onClick={handleClosePasswordModal}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;