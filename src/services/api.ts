import axios from 'axios';

// Create axios instance with base URL and default headers
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authorization header to every request
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage or use hardcoded token
    const token = localStorage.getItem('authToken') || 'cde7ac9e2f9b7950690b0b44c031309591de0ae033976d762c1b220c02b4614b';
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
// Methods for profile evaluator API integration
// Add these to your existing api service file

/**
 * Submit pre-screening evaluation job
 * @param driveId Drive ID
 * @returns Response with job ID
 */
export const submitPreScreeningEvaluation = async (driveId: string) => {
  const response = await api.post(`/profile-evaluator/drives/${driveId}/submit-evaluation`, {
    evaluationType: 'PreScreening'
  });
  return response.data;
};

/**
 * Get job status
 * @param jobId Job ID
 * @returns Job status
 */
export const getJobStatus = async (jobId: string) => {
  const response = await api.get(`/profile-evaluator/jobs/${jobId}`);
  return response.data;
};

/**
 * Get jobs for a drive
 * @param driveId Drive ID
 * @param page Page number
 * @param limit Items per page
 * @returns Jobs for the drive
 */
export const getJobsForDrive = async (driveId: string, page = 1, limit = 10) => {
  const response = await api.get(`/profile-evaluator/jobs`, {
    params: { 
      driveId,
      page,
      limit
    }
  });
  return response.data;
};