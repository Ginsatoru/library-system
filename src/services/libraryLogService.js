import api from './api';

const libraryLogService = {
  getAvailableBooks: async () => {
    try {
      const res = await api.get('/LibraryLogs/GetAvailableBooksJson');
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to load books.' };
    }
  },

  createLog: async ({ studentName, phoneNumber, gender, purpose, notes, bookIds }) => {
    try {
      const res = await api.post('/LibraryLogs/CreateJson', {
        studentName,
        phoneNumber,
        gender,
        purpose,
        notes,
        bookIds,
      });
      const data = res.data;
      return { success: data?.success ?? false, message: data?.message, logId: data?.logId };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to submit request.' };
    }
  },
};

export default libraryLogService;