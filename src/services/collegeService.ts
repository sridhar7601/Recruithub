import api from './api';
import { CollegeResponseDto, PaginatedCollegeResponseDto } from '../types';

/**
 * Get all colleges with pagination
 * @param page Page number
 * @param limit Number of items per page
 * @param city Optional city filter
 * @returns Promise with paginated college response
 */
export const getColleges = async (
  page: number = 1,
  limit: number = 10,
  city?: string
): Promise<PaginatedCollegeResponseDto> => {
  try {
    const params: Record<string, any> = { page, limit };
    if (city) {
      params.city = city;
    }
    
    const response = await api.get('/colleges', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching colleges:', error);
    throw error;
  }
};

/**
 * Get a college by ID
 * @param collegeId The ID of the college
 * @returns Promise with the college
 */
export const getCollege = async (collegeId: string): Promise<CollegeResponseDto> => {
  try {
    const response = await api.get(`/colleges/${collegeId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching college ${collegeId}:`, error);
    throw error;
  }
};

/**
 * Create a new college
 * @param name College name
 * @param city College city
 * @returns Promise with the created college
 */
export const createCollege = async (
  name: string,
  city: string
): Promise<CollegeResponseDto> => {
  try {
    const response = await api.post('/colleges', { name, city });
    return response.data;
  } catch (error) {
    console.error('Error creating college:', error);
    throw error;
  }
};

/**
 * Update a college
 * @param collegeId The ID of the college
 * @param name Updated college name
 * @param city Updated college city
 * @returns Promise with the updated college
 */
export const updateCollege = async (
  collegeId: string,
  name: string,
  city: string
): Promise<CollegeResponseDto> => {
  try {
    const response = await api.put(`/colleges/${collegeId}`, { name, city });
    return response.data;
  } catch (error) {
    console.error(`Error updating college ${collegeId}:`, error);
    throw error;
  }
};

/**
 * Delete a college
 * @param collegeId The ID of the college
 * @returns Promise with the deletion result
 */
export const deleteCollege = async (collegeId: string): Promise<void> => {
  try {
    await api.delete(`/colleges/${collegeId}`);
  } catch (error) {
    console.error(`Error deleting college ${collegeId}:`, error);
    throw error;
  }
};

/**
 * Get college statistics
 * @param collegeId The ID of the college
 * @returns Promise with college statistics
 */
export const getCollegeStats = async (collegeId: string): Promise<{
  completedDrives: number;
  studentsHired: number;
  activeStatus: 'Active' | 'Inactive';
}> => {
  try {
    // This is a mock implementation since the actual endpoint doesn't exist yet
    // In a real implementation, we would call an API endpoint
    return {
      completedDrives: Math.floor(Math.random() * 15) + 1,
      studentsHired: Math.floor(Math.random() * 30) + 1,
      activeStatus: Math.random() > 0.5 ? 'Active' : 'Inactive'
    };
  } catch (error) {
    console.error(`Error fetching college stats for ${collegeId}:`, error);
    throw error;
  }
};
