import api from './api';

export const getAdminContact = async () => {
  try {
    const response = await api.get('/MemberAuth/AdminContact');
    return { success: true, data: response.data };
  } catch {
    return { success: false, data: null };
  }
};