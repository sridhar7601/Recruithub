import api from './api';
import { PaginatedStudentResponse, Student, StudentFilterParams, ImportResult, CreateStudentDto } from '../types';

export const getStudents = async (
  driveId: string,
  page: number = 1,
  limit: number = 10,
  filters?: StudentFilterParams
): Promise<PaginatedStudentResponse> => {
  try {
    console.log(`Fetching students for drive ${driveId} with filters:`, filters);
    
    // Get the drive to get the collegeId
    const { getDriveById } = await import('./driveService');
    const drive = await getDriveById(driveId);
    const collegeId = drive.collegeId;
    
    // Build query parameters
    const params: any = {
      page,
      limit,
      driveId,
      collegeId
    };
    
    // Add filter parameters if provided
    if (filters) {
      // Handle search query - search across name, email, registration number
      if (filters.search && filters.search.trim() !== '') {
        params.search = filters.search.trim();
      }
      
    // Handle department filters
    if (filters.departments && filters.departments.length > 0) {
      // If only one department, use it directly
      if (filters.departments.length === 1) {
        params.department = filters.departments[0];
      } else {
        // For multiple departments, we'll need to make multiple requests and combine results
        // This is a limitation of the current API
        const departmentResults = await Promise.all(
          filters.departments.map(async (dept) => {
            const deptParams = { ...params, department: dept };
            delete deptParams.page; // Get all results for each department
            delete deptParams.limit;
            
            try {
              const response = await api.get('/students', { params: deptParams });
              return response.data.data || [];
            } catch (err) {
              console.error(`Error fetching students for department ${dept}:`, err);
              return [];
            }
          })
        );
        
        // Combine results from all departments
        const allStudents = departmentResults.flat();
        
        // Apply pagination manually
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedStudents = allStudents.slice(startIndex, endIndex);
        
        // Return manually constructed response
        return {
          data: paginatedStudents,
          total: allStudents.length,
          page,
          limit
        };
      }
    }
      
      // Handle test batch filters
      if (filters.testBatches && filters.testBatches.length > 0) {
        params.testBatch = filters.testBatches.join(',');
      }
      
      // Handle sorting
      if (filters.sortBy) {
        params.sortBy = filters.sortBy;
      }
      
      if (filters.sortOrder) {
        params.sortOrder = filters.sortOrder;
      }
    }
    
    const response = await api.get('/students', { params });
    console.log('Student API response:', response);
    
    return response.data;
  } catch (error) {
    console.error('Error in getStudents:', error);
    throw error;
  }
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
