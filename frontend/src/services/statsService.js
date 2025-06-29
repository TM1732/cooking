import api from './api';

const statsService = {
  async getPublicStats() {
    const res = await api.get('/stats/public');
    return res.data;
  }
};

export default statsService;
