import api from './api';
import { 
  Student, 
  PaginatedStudentResponseDto, 
  CreateStudentDto, 
  ImportResult,
  StudentFilterParams,
  StudentRound
} from '../types/student';

/**
 * Get paginated list of students with optional filtering
 */
export const getStudents = async (params: StudentFilterParams): Promise<PaginatedStudentResponseDto> => {
  const response = await api.get('/students', { params });
  return response.data;
};

/**
 * Get a student by ID
 */
export const getStudentById = async (studentId: string): Promise<Student> => {
  const response = await api.get(`/students/${studentId}`);
  return response.data;
};

/**
 * Create a new student
 */
export const createStudent = async (student: CreateStudentDto): Promise<Student> => {
  const response = await api.post('/students', student);
  return response.data;
};

/**
 * Update an existing student
 */
export const updateStudent = async (studentId: string, student: Partial<CreateStudentDto>): Promise<Student> => {
  const response = await api.put(`/students/${studentId}`, student);
  return response.data;
};

/**
 * Delete a student
 */
export const deleteStudent = async (studentId: string): Promise<{ success: boolean }> => {
  const response = await api.delete(`/students/${studentId}`);
  return response.data;
};

/**
 * Export students to Excel by drive ID
 */
export const exportStudentsToExcel = async (driveId: string): Promise<Blob> => {
  const response = await api.get(`/students/export/${driveId}`, {
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Import students from CSV/Excel file
 */
export const importStudents = async (driveId: string, file: File): Promise<ImportResult> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post(`/students/import/${driveId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

/**
 * Get all rounds for a student
 */
export const getStudentRounds = async (studentId: string, status?: string): Promise<Student['rounds']> => {
  const response = await api.get(`/students/${studentId}/rounds`, {
    params: { status },
  });
  return response.data;
};

/**
 * Get a specific round for a student
 */
export const getStudentRoundByNumber = async (studentId: string, roundNumber: number): Promise<StudentRound> => {
  const response = await api.get(`/students/${studentId}/rounds/${roundNumber}`);
  return response.data;
};

/**
 * Update a specific round for a student
 */
export const updateStudentRound = async (
  studentId: string,
  roundNumber: number,
  roundData: Partial<StudentRound>
): Promise<Student> => {
  const response = await api.put(`/students/${studentId}/rounds/${roundNumber}`, roundData);
  return response.data;
};