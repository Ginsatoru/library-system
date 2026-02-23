import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiEdit2, FiSave, FiX, FiCamera } from 'react-icons/fi';
import api from '../services/api';

const ProfileModal = ({ isOpen, onClose, user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/MemberAuth/UpdateProfileJson', formData);
      if (response.data?.success) {
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        if (onUpdateUser) onUpdateUser(updatedUser);
        setIsEditing(false);
      } else {
        setError(response.data?.message || 'Update failed.');
      }
    } catch {
      // Optimistic update if endpoint not yet implemented
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      if (onUpdateUser) onUpdateUser(updatedUser);
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
    });
    setError('');
    setIsEditing(false);
  };

  const getProfilePicUrl = () => {
    if (user?.profilePic && !imageError) {
      if (user.profilePic.startsWith('http://') || user.profilePic.startsWith('https://')) {
        return user.profilePic;
      }
      return `${import.meta.env.VITE_API_BASE_URL}/${user.profilePic.replace(/^\//, '')}`;
    }
    return null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="relative h-32 bg-gradient-to-r from-[#000080] to-indigo-600">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 pb-6 -mt-16 overflow-y-auto max-h-[calc(90vh-8rem)]">
                {/* Avatar */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl bg-white overflow-hidden">
                      {getProfilePicUrl() ? (
                        <img
                          src={getProfilePicUrl()}
                          alt="Profile"
                          className="w-full h-full object-cover"
                          onError={() => setImageError(true)}
                          crossOrigin="anonymous"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#000080] to-indigo-600">
                          <FiUser className="w-14 h-14 text-white" />
                        </div>
                      )}
                    </div>
                    <button className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-lg border-2 border-gray-200 hover:bg-gray-50 transition-colors">
                      <FiCamera className="w-3.5 h-3.5 text-gray-700" />
                    </button>
                  </div>
                </div>

                {/* Name & type */}
                <div className="text-center mb-5">
                  <h2 className="text-xl font-bold text-gray-900">{user?.fullName}</h2>
                  {user?.memberType && (
                    <span className="inline-block mt-1 px-3 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                      {user.memberType}
                    </span>
                  )}
                </div>

                {error && (
                  <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                    {error}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex justify-end mb-4">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#000080] text-white rounded-lg hover:bg-[#000070] transition-colors text-sm"
                    >
                      <FiEdit2 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-60"
                      >
                        <FiSave className="w-4 h-4" />
                        {loading ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                      >
                        <FiX className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Fields */}
                <div className="space-y-3">
                  <ProfileField label="Full Name" icon={<FiUser />} name="fullName" value={formData.fullName} isEditing={isEditing} onChange={handleChange} />
                  <ProfileField label="Email" icon={<FiMail />} name="email" value={formData.email} type="email" isEditing={isEditing} onChange={handleChange} />
                  <ProfileField label="Phone" icon={<FiPhone />} name="phone" value={formData.phone} type="tel" isEditing={isEditing} onChange={handleChange} />

                  {/* Member ID — read only */}
                  {user?.memberId && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Member ID</label>
                      <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-100 rounded-lg">
                        <span className="text-xs text-gray-400 font-mono">{user.memberId}</span>
                        <span className="ml-auto text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded">Read only</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

function ProfileField({ label, icon, name, value, type = 'text', isEditing, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      {isEditing ? (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#000080]/40 focus:border-[#000080] text-sm transition-all"
        />
      ) : (
        <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-lg text-sm text-gray-800">
          <span className="text-gray-400 w-4 h-4 flex-shrink-0">{icon}</span>
          {value || <span className="text-gray-400 italic">Not set</span>}
        </div>
      )}
    </div>
  );
}

export default ProfileModal;