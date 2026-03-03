import api from './api';

export const authService = {
  login: async ({ login, password, rememberMe = false }) => {
    try {
      const response = await api.post('/MemberAuth/LoginJson', {
        login,
        password,
        rememberMe,
      });

      const data = response.data;
      if (data?.success) {
        const userInfo = {
          memberId: data.member?.memberId,
          fullName: data.member?.fullName,
          email: data.member?.email,
          phone: data.member?.phone,
          memberType: data.member?.memberType,
          profilePicture: data.member?.profilePicture || null,
          isAuthenticated: true,
        };
        localStorage.setItem('user', JSON.stringify(userInfo));
        return { success: true, data: userInfo };
      }

      return { success: false, message: data?.message || 'Invalid credentials.' };
    } catch (error) {
      return { success: false, message: _extractError(error, 'Login failed.') };
    }
  },

  register: async ({ fullName, email, phone, address, memberType = 'General', faculty, subject, password, confirmPassword }) => {
    try {
      const response = await api.post('/MemberAuth/RegisterJson', {
        fullName,
        email,
        phone,
        address,
        memberType,
        faculty,
        subject,
        password,
        confirmPassword,
      });

      const data = response.data;
      if (data?.success) {
        const userInfo = {
          memberId: data.member?.memberId,
          fullName: data.member?.fullName,
          email: data.member?.email,
          phone: data.member?.phone,
          memberType: data.member?.memberType,
          profilePicture: data.member?.profilePicture || null,
          isAuthenticated: true,
        };
        localStorage.setItem('user', JSON.stringify(userInfo));
        return { success: true, data: userInfo };
      }

      return { success: false, message: data?.message || 'Registration failed.' };
    } catch (error) {
      return { success: false, message: _extractError(error, 'Registration failed.') };
    }
  },

  forgotPassword: async (emailOrLogin) => {
    try {
      const response = await api.post('/MemberAuth/ForgotPasswordJson', {
        emailOrUserName: emailOrLogin,
      });
      const data = response.data;
      return {
        success: data?.success ?? false,
        message: data?.message || 'If the account exists, an OTP has been sent.',
      };
    } catch (error) {
      return { success: false, message: _extractError(error, 'Request failed.') };
    }
  },

  resetPassword: async ({ emailOrUserName, otpCode, newPassword, confirmNewPassword }) => {
    try {
      const response = await api.post('/MemberAuth/ResetPasswordJson', {
        emailOrUserName,
        otpCode,
        newPassword,
        confirmNewPassword,
      });
      const data = response.data;
      return {
        success: data?.success ?? false,
        message: data?.message || 'Password reset successfully.',
      };
    } catch (error) {
      return { success: false, message: _extractError(error, 'Reset failed.') };
    }
  },

  logout: async () => {
    try {
      await api.post('/MemberAuth/LogoutJson');
    } catch (_) {
      // best effort
    } finally {
      localStorage.removeItem('user');
    }
    return { success: true };
  },

  getStoredUser: () => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated: () => !!localStorage.getItem('user'),
};

function _extractError(error, fallback) {
  if (error.code === 'ERR_NETWORK') return 'Cannot connect to server.';
  return error.response?.data?.message || fallback;
}

export default authService;