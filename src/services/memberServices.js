import api from './api';

const memberService = {
  /**
   * GET /MemberPortal/ProfileJson
   */
  getProfile: async () => {
    try {
      const response = await api.get('/MemberPortal/ProfileJson');
      return { success: true, data: response.data };
    } catch (error) {
      if (error.response?.status === 401) {
        return { success: false, message: 'Unauthorized. Please log in again.' };
      }
      return { success: false, message: _extractError(error, 'Failed to load profile.') };
    }
  },

  /**
   * POST /MemberPortal/UpdateProfileJson
   * Allowed fields: fullName, phone, address, gender
   */
  updateProfile: async ({ fullName, phone, address, gender }) => {
    try {
      const response = await api.post('/MemberPortal/UpdateProfileJson', {
        fullName,
        phone,
        address,
        gender,
      });
      const data = response.data;
      return {
        success: data?.success ?? false,
        message: data?.message || 'Profile updated.',
      };
    } catch (error) {
      return { success: false, message: _extractError(error, 'Failed to update profile.') };
    }
  },

  /**
   * POST /MemberPortal/UploadProfilePictureJson
   * Must send as FormData (multipart), not JSON
   */
  uploadProfilePicture: async (file) => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      const response = await api.post('/MemberPortal/UploadProfilePictureJson', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const data = response.data;
      return {
        success: data?.success ?? false,
        profilePicture: data?.profilePicture || null,
        message: data?.message || 'Upload failed.',
      };
    } catch (error) {
      return { success: false, message: _extractError(error, 'Failed to upload picture.') };
    }
  },

  /**
   * POST /MemberPortal/ChangePasswordJson
   */
  changePassword: async ({ currentPassword, newPassword, confirmNewPassword }) => {
    try {
      const response = await api.post('/MemberPortal/ChangePasswordJson', {
        currentPassword,
        newPassword,
        confirmNewPassword,
      });
      const data = response.data;
      return {
        success: data?.success ?? false,
        message: data?.message || 'Password changed.',
      };
    } catch (error) {
      return { success: false, message: _extractError(error, 'Failed to change password.') };
    }
  },

  /**
   * POST /MemberPortal/UpdateTelegramJson
   */
  updateTelegram: async ({ telegramChatId, telegramUsername }) => {
    try {
      const response = await api.post('/MemberPortal/UpdateTelegramJson', {
        telegramChatId,
        telegramUsername,
      });
      const data = response.data;
      return { success: data?.success ?? false, message: data?.message || 'Telegram updated.' };
    } catch (error) {
      return { success: false, message: _extractError(error, 'Failed to update Telegram info.') };
    }
  },

  /**
   * GET /MemberPortal/HistoryJson
   * Returns { borrows: [...], histories: [...] }
   */
  getHistory: async () => {
    try {
      const response = await api.get('/MemberPortal/HistoryJson');
      return { success: true, data: response.data };
    } catch (error) {
      if (error.response?.status === 401) {
        return { success: false, message: 'Unauthorized. Please log in again.' };
      }
      return { success: false, message: _extractError(error, 'Failed to load history.') };
    }
  },
};

function _extractError(error, fallback) {
  if (error.code === 'ERR_NETWORK') return 'Cannot connect to server.';
  return error.response?.data?.message || fallback;
}

export default memberService;