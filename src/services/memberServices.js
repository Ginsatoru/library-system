import api from './api';

const memberService = {
  // ─── Profile ───────────────────────────────────────────────────────────────
  getProfile: async () => {
    try {
      const response = await api.get('/MemberPortal/ProfileJson');
      return { success: true, data: response.data };
    } catch (error) {
      if (_isUnauthorized(error)) return { success: false, message: null };
      return { success: false, message: _extractError(error, 'Failed to load profile.') };
    }
  },

  updateProfile: async ({ fullName, phone, address, gender }) => {
    try {
      const response = await api.post('/MemberPortal/UpdateProfileJson', { fullName, phone, address, gender });
      const data = response.data;
      return { success: data?.success ?? false, message: data?.message || 'Profile updated.' };
    } catch (error) {
      if (_isUnauthorized(error)) return { success: false, message: null };
      return { success: false, message: _extractError(error, 'Failed to update profile.') };
    }
  },

  uploadProfilePicture: async (file) => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      const response = await api.post('/MemberPortal/UploadProfilePictureJson', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const data = response.data;
      return { success: data?.success ?? false, profilePicture: data?.profilePicture || null, message: data?.message || 'Upload failed.' };
    } catch (error) {
      if (_isUnauthorized(error)) return { success: false, message: null };
      return { success: false, message: _extractError(error, 'Failed to upload picture.') };
    }
  },

  changePassword: async ({ currentPassword, newPassword, confirmNewPassword }) => {
    try {
      const response = await api.post('/MemberPortal/ChangePasswordJson', { currentPassword, newPassword, confirmNewPassword });
      const data = response.data;
      return { success: data?.success ?? false, message: data?.message || 'Password changed.' };
    } catch (error) {
      if (_isUnauthorized(error)) return { success: false, message: null };
      return { success: false, message: _extractError(error, 'Failed to change password.') };
    }
  },

  updateTelegram: async ({ telegramChatId, telegramUsername }) => {
    try {
      const response = await api.post('/MemberPortal/UpdateTelegramJson', { telegramChatId, telegramUsername });
      const data = response.data;
      return { success: data?.success ?? false, message: data?.message || 'Telegram updated.' };
    } catch (error) {
      if (_isUnauthorized(error)) return { success: false, message: null };
      return { success: false, message: _extractError(error, 'Failed to update Telegram info.') };
    }
  },

  getHistory: async () => {
    try {
      const response = await api.get('/MemberPortal/HistoryJson');
      return { success: true, data: response.data };
    } catch (error) {
      if (_isUnauthorized(error)) return { success: false, message: null };
      return { success: false, message: _extractError(error, 'Failed to load history.') };
    }
  },

  // ─── Wishlist ──────────────────────────────────────────────────────────────
  getWishlist: async () => {
    try {
      const response = await api.get('/MemberPortal/WishlistJson');
      return { success: true, data: response.data?.data ?? [] };
    } catch (error) {
      if (_isUnauthorized(error)) return { success: false, message: null };
      return { success: false, message: _extractError(error, 'Failed to load wishlist.') };
    }
  },

  getWishlistIds: async () => {
    try {
      const response = await api.get('/MemberPortal/WishlistIdsJson');
      return { success: true, data: response.data?.data ?? [] };
    } catch (error) {
      if (_isUnauthorized(error)) return { success: false, data: [] };
    }
  },

  addToWishlist: async (catalogId) => {
    try {
      const response = await api.post('/MemberPortal/AddToWishlistJson', { catalogId });
      const data = response.data;
      return { success: data?.success ?? false, message: data?.message };
    } catch (error) {
      if (_isUnauthorized(error)) return { success: false, message: null, unauthorized: true };
      return { success: false, message: _extractError(error, 'Failed to add to wishlist.') };
    }
  },

  removeFromWishlist: async (catalogId) => {
    try {
      const response = await api.post('/MemberPortal/RemoveFromWishlistJson', { catalogId });
      const data = response.data;
      return { success: data?.success ?? false, message: data?.message };
    } catch (error) {
      if (_isUnauthorized(error)) return { success: false, message: null, unauthorized: true };
      return { success: false, message: _extractError(error, 'Failed to remove from wishlist.') };
    }
  },
};

function _isUnauthorized(error) {
  return error.response?.status === 401;
}

function _extractError(error, fallback) {
  if (error.code === 'ERR_NETWORK') return 'Cannot connect to server.';
  return error.response?.data?.message || fallback;
}

export default memberService;