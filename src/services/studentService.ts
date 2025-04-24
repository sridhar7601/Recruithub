import api from './api';
import { PaginatedStudentResponse, Student, StudentFilterParams, ImportResult, CreateStudentDto } from '../types';
import { PaginatedStudentResponseDto } from '../types/student';
import axios from 'axios';

export const getStudents = async (
driveId: string, page: number = 1, limit: number = 10, currentFilters: { search: string; departments?: string[]; testBatches?: string[]; sortBy?: "aiRank" | "name" | "department" | "registrationNumber"; sortOrder?: "asc" | "desc"; },
): Promise<any> => {
  if (typeof driveId !== 'string') {
    console.warn('driveId is not a string:', driveId);
  }

  const params = {
    page,
    limit,
    driveId,
  };

  console.log('Fetching students with params:', params);
  const response = await api.get('/students', { params });
  return response.data;
};


export const getStudentById = async (studentId: string): Promise<Student> => {
  const response = await api.get(`/students/${studentId}`);
  return response.data;
};

export const createStudent = async (studentData: CreateStudentDto): Promise<Student> => {
  try {
    const response = await api.post('/students', studentData);
    return response.data;
  } catch (error) {
    console.error('Error creating student:', error);
    throw error;
  }
};

export const importStudents = async (driveId: string, file: File): Promise<ImportResult> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/students/import/${driveId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error importing students:', error);
    throw error;
  }
};

export const getStudentCountByDepartment = async (driveId: string): Promise<Record<string, number>> => {
  try {
    // Import the function from driveService to avoid circular dependencies
    const { getStudentCountByDepartment: getDepartmentCounts } = await import('./driveService');
    return getDepartmentCounts(driveId);
  } catch (error) {
    console.error('Error getting student count by department:', error);
    throw error;
  }
};

export const getStudentCountByRound = async (driveId: string): Promise<Record<string, number>> => {
  try {
    // Import the function from driveService to avoid circular dependencies
    const { getStudentCountByRound: getRoundCounts } = await import('./driveService');
    return getRoundCounts(driveId);
  } catch (error) {
    console.error('Error getting student count by round:', error);
    throw error;
  }
};
