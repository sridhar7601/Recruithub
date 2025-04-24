import api from './api';
import { CreateDriveDto, DriveDocument, PaginatedDriveResponse } from '../types';

/**
 * Interface for department and round count data
 */
export interface DepartmentCount {
  department: string;
  count: number;
}

export interface RoundCount {
  roundNumber: number;
  count: number;
}

export const getDrives = async (page: number = 1, limit: number = 10): Promise<PaginatedDriveResponse> => {
  try {
    console.log('Fetching drives without query parameters');
    // Remove query parameters as they seem to cause issues with the API
    const response = await api.get('/drives');
    console.log('Drive API response:', response);
    
    // If the response doesn't match our expected format, create a compatible structure
    if (!response.data.drives && Array.isArray(response.data)) {
      console.log('Converting array response to PaginatedDriveResponse format');
      return {
        drives: response.data,
        total: response.data.length,
        page: page,
        limit: limit
      };
    }
    
    return response.data;
  } catch (error) {
    console.error('Error in getDrives:', error);
    throw error;
  }
};

export const getDriveById = async (driveId: string): Promise<DriveDocument> => {
  const response = await api.get(`/drives/${driveId}`);
  return response.data;
};

export const createDrive = async (driveData: CreateDriveDto): Promise<DriveDocument> => {
  const response = await api.post('/drives', driveData);
  return response.data;
};

export const updateDrive = async (driveId: string, driveData: Partial<CreateDriveDto>): Promise<DriveDocument> => {
  const response = await api.put(`/drives/${driveId}`, driveData);
  return response.data;
};

export const deleteDrive = async (driveId: string): Promise<{ success: boolean }> => {
  const response = await api.delete(`/drives/${driveId}`);
  return response.data;
};

/**
 * Get student count by department for a specific drive
 * @param driveId The ID of the drive
 * @returns Promise with department counts
 */
export const getStudentCountByDepartment = async (driveId: string): Promise<Record<string, number>> => {
  try {
    console.log(`Fetching department counts for drive ${driveId}`);
    
    // Get the drive to get the collegeId
    const drive = await getDriveById(driveId);
    const collegeId = drive.collegeId;
    
    // Define departments to check
    const departments = [
      'Computer Science Engineering',
      'Information Technology',
      'AI & DS',
      'Electronics and Communication Engineering',
      'Mechanical Engineering',
      'Electrical and Electronics Engineering',
      'Biotechnology',
      'Civil Engineering'
    ];
    
    // Create a map to store department counts
    const departmentCounts: Record<string, number> = {};
    
    // Fetch students for each department
    for (const department of departments) {
      try {
        // Fetch students for this department
        const response = await api.get(`/students`, {
          params: {
            page: 1,
            limit: 1, // We only need the count, not the actual students
            collegeId,
            driveId,
            department
          }
        });
        
        // Store the count
        departmentCounts[department] = response.data.total || 0;
      } catch (err) {
        console.error(`Error fetching count for department ${department}:`, err);
        departmentCounts[department] = 0;
      }
    }
    
    return departmentCounts;
  } catch (error) {
    console.error(`Error fetching department counts for drive ${driveId}:`, error);
    throw error;
  }
};

/**
 * Get student count by round for a specific drive
 * @param driveId The ID of the drive
 * @returns Promise with round counts
 */
export const getStudentCountByRound = async (driveId: string): Promise<Record<string, number>> => {
  try {
    console.log(`Fetching round counts for drive ${driveId}`);
    
    // Get the drive to determine how many rounds it has
    const drive = await getDriveById(driveId);
    const collegeId = drive.collegeId;
    const roundCount = drive.rounds?.length || 3; // Default to 3 rounds if not specified
    
    // Create a map to store round counts
    const roundCounts: Record<string, number> = {};
    
    // Get all students for this drive
    const response = await api.get(`/students`, {
      params: {
        page: 1,
        limit: 1000, // Get a large number to ensure we get all students
        collegeId,
        driveId
      }
    });
    
    const students = response.data.data || [];
    
    // Initialize round counts
    for (let i = 1; i <= roundCount; i++) {
      roundCounts[i.toString()] = 0;
    }
    
    // Count students in each round
    students.forEach((student: any) => {
      if (student.rounds && Array.isArray(student.rounds)) {
        student.rounds.forEach((round: any) => {
          const roundNumber = round.roundNumber.toString();
          if (roundCounts[roundNumber] !== undefined) {
            roundCounts[roundNumber]++;
          } else {
            roundCounts[roundNumber] = 1;
          }
        });
      }
    });
    
    // If no students have rounds data, use total student count for round 1
    if (Object.values(roundCounts).every(count => count === 0) && students.length > 0) {
      roundCounts['1'] = students.length;
    }
    
    return roundCounts;
  } catch (error) {
    console.error(`Error fetching round counts for drive ${driveId}:`, error);
    throw error;
  }
};
