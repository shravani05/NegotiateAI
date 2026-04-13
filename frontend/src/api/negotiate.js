const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const ENDPOINTS = {
  strategy: `${API_URL}/api/strategy`,
  roleplayTurn: `${API_URL}/api/roleplay/turn`,
  coachingTurn: `${API_URL}/api/coaching/turn`,
  coachingSummary: `${API_URL}/api/coaching/summary`,
};
