import api from './api';
import config from '../config/config';

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${config.api.baseUrl}${imagePath}`;
};

const getPdfUrl = (pdfFilePath) => {
  if (!pdfFilePath) return null;
  if (pdfFilePath.startsWith('http')) return pdfFilePath;
  return `${config.api.baseUrl}${pdfFilePath}`;
};

const catalogService = {
  getAll: async () => {
    try {
      const res = await api.get('/Catalogs/IndexJson');
      const data = res.data.map((c) => ({
        ...c,
        imageUrl: getImageUrl(c.imagePath),
        available: c.availableCopies > 0,
      }));
      return { success: true, data };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to load catalogs.' };
    }
  },

  getById: async (id) => {
    try {
      const res = await api.get(`/Catalogs/DetailsJson?id=${id}`);
      const c = res.data;
      return {
        success: true,
        data: {
          ...c,
          imageUrl: getImageUrl(c.imagePath),
          pdfUrl: getPdfUrl(c.pdfFilePath),
          available: c.availableCopies > 0,
        },
      };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to load catalog.' };
    }
  },
};

export default catalogService;