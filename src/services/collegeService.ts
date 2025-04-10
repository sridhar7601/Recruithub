import api from './api';
import { CollegeResponseDto, PaginatedCollegeResponseDto } from '../types';

export const getColleges = async (page: number = 1, limit: number = 10, city?: string): Promise<PaginatedCollegeResponseDto> => {
  const response = await api.get('/colleges', {
    params: { page, limit, city },
  });
  return response.data;
};

export const getCollegeById = async (collegeId: string): Promise<CollegeResponseDto> => {
  const response = await api.get(`/colleges/${collegeId}`);
  return response.data;
};