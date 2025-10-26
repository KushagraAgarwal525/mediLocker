// Get API URL from environment variable or default to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const config = {
  apiUrl: API_URL,
  endpoints: {
    reports: {
      getByUser: `${API_URL}/api/reports/user`,
      getById: (id: string) => `${API_URL}/api/reports/${id}`,
      create: `${API_URL}/api/reports/new`,
      explain: `${API_URL}/api/reports/explain`,
      checkCompatibility: `${API_URL}/api/reports/check-compatibility`,
    },
    users: {
      getAll: `${API_URL}/api/users`,
      getById: (id: string) => `${API_URL}/api/users/${id}`,
    },
  },
};
