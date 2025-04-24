import api from './api';
import { Round, StudentRound, UpdateStudentRoundDto } from '../types';

/**
 * Get all rounds for a drive
 * @param driveId The ID of the drive
 * @returns Promise with the rounds
 */
export const getDriveRounds = async (driveId: string): Promise<Round[]> => {
  try {
    const response = await api.get(`/drives/${driveId}/rounds`);
    return response.data;
  } catch (error) {
    console.error('Error fetching drive rounds:', error);
    throw error;
  }
};

/**
 * Get a specific round for a drive
 * @param driveId The ID of the drive
 * @param roundNumber The round number
 * @returns Promise with the round
 */
export const getDriveRound = async (driveId: string, roundNumber: number): Promise<Round> => {
  try {
    const response = await api.get(`/drives/${driveId}/rounds/${roundNumber}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching drive round ${roundNumber}:`, error);
    throw error;
  }
};

/**
 * Create a new round for a drive
 * @param driveId The ID of the drive
 * @param round The round data
 * @returns Promise with the created round
 */
export const createDriveRound = async (driveId: string, round: Omit<Round, 'roundId'>): Promise<Round> => {
  try {
    const response = await api.post(`/drives/${driveId}/rounds`, round);
    return response.data;
  } catch (error) {
    console.error('Error creating drive round:', error);
    throw error;
  }
};

/**
 * Update a round for a drive
 * @param driveId The ID of the drive
 * @param roundNumber The round number
 * @param round The updated round data
 * @returns Promise with the updated round
 */
export const updateDriveRound = async (
  driveId: string,
  roundNumber: number,
  round: Partial<Round>
): Promise<Round> => {
  try {
    const response = await api.put(`/drives/${driveId}/rounds/${roundNumber}`, round);
    return response.data;
  } catch (error) {
    console.error(`Error updating drive round ${roundNumber}:`, error);
    throw error;
  }
};

/**
 * Delete a round from a drive
 * @param driveId The ID of the drive
 * @param roundNumber The round number
 * @returns Promise with the deletion result
 */
export const deleteDriveRound = async (driveId: string, roundNumber: number): Promise<void> => {
  try {
    await api.delete(`/drives/${driveId}/rounds/${roundNumber}`);
  } catch (error) {
    console.error(`Error deleting drive round ${roundNumber}:`, error);
    throw error;
  }
};

/**
 * Get all rounds for a student
 * @param studentId The ID of the student
 * @returns Promise with the student rounds
 */
export const getStudentRounds = async (studentId: string): Promise<StudentRound[]> => {
  try {
    const response = await api.get(`/students/${studentId}/rounds`);
    return response.data;
  } catch (error) {
    console.error('Error fetching student rounds:', error);
    throw error;
  }
};

/**
 * Get a specific round for a student
 * @param studentId The ID of the student
 * @param roundNumber The round number
 * @returns Promise with the student round
 */
export const getStudentRound = async (studentId: string, roundNumber: number): Promise<StudentRound> => {
  try {
    const response = await api.get(`/students/${studentId}/rounds/${roundNumber}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching student round ${roundNumber}:`, error);
    throw error;
  }
};

/**
 * Update a round for a student
 * @param studentId The ID of the student
 * @param roundNumber The round number
 * @param roundData The updated round data
 * @returns Promise with the updated student round
 */
export const updateStudentRound = async (
  studentId: string,
  roundNumber: number,
  roundData: UpdateStudentRoundDto
): Promise<StudentRound> => {
  try {
    const response = await api.put(`/students/${studentId}/rounds/${roundNumber}`, roundData);
    return response.data;
  } catch (error) {
    console.error(`Error updating student round ${roundNumber}:`, error);
    throw error;
  }
};

/**
 * Sync rounds for a student with the drive configuration
 * @param studentId The ID of the student
 * @returns Promise with the sync result
 */
export const syncStudentRounds = async (studentId: string): Promise<void> => {
  try {
    await api.post(`/students/${studentId}/rounds/sync`);
  } catch (error) {
    console.error('Error syncing student rounds:', error);
    throw error;
  }
};

/**
 * Sync rounds for all students in a drive with the drive configuration
 * @param driveId The ID of the drive
 * @returns Promise with the sync result
 */
export const syncAllStudentRounds = async (driveId: string): Promise<void> => {
  try {
    await api.post(`/drives/${driveId}/students/rounds/sync`);
  } catch (error) {
    console.error('Error syncing all student rounds:', error);
    throw error;
  }
};

/**
 * Get students by round for a drive
 * @param driveId The ID of the drive
 * @returns Promise with students grouped by round
 */
export const getStudentsByRound = async (driveId: string): Promise<Record<number, any[]>> => {
  try {
    // Get all students for the drive with their rounds included
    const studentsResponse = await api.get(`/students`, {
      params: {
        driveId,
        limit: 1000 // Get all students
      }
    });
    
    // Extract students from the response
    const students = studentsResponse.data.data;
    const studentsByRound: Record<number, any[]> = {};
    
    // Always include hired and rejected categories
    studentsByRound[-1] = []; // Hired
    studentsByRound[-2] = []; // Rejected
    
    // Group students by their current round
    for (const student of students) {
      // Check if student has rounds data
      if (student.rounds && student.rounds.length > 0) {
        // Find the current round based on status
        // Priority: IN_PROGRESS > NOT_STARTED > COMPLETED > PASSED/FAILED
        let currentRound = student.rounds[0];
        
        // First, look for rounds with status IN_PROGRESS
        const inProgressRound = student.rounds.find((round: StudentRound) => round.status === 'IN_PROGRESS');
        if (inProgressRound) {
          currentRound = inProgressRound;
        } else {
          // Then, look for rounds with status NOT_STARTED
          const notStartedRound = student.rounds.find((round: StudentRound) => round.status === 'NOT_STARTED');
          if (notStartedRound) {
            currentRound = notStartedRound;
          } else {
            // If no IN_PROGRESS or NOT_STARTED rounds, use the highest round number
            for (const round of student.rounds as StudentRound[]) {
              if (round.roundNumber > currentRound.roundNumber) {
                currentRound = round;
              }
            }
          }
        }
        
        // Initialize the round array if it doesn't exist
        if (!studentsByRound[currentRound.roundNumber]) {
          studentsByRound[currentRound.roundNumber] = [];
        }
        
        // Determine which group to put the student in
        if (currentRound.status === 'PASSED' && currentRound.roundNumber === Math.max(...student.rounds.map((r: StudentRound) => r.roundNumber))) {
          // Student passed the final round, consider them hired
          studentsByRound[-1].push({...student, currentRound});
        } else if (currentRound.status === 'FAILED') {
          // Student failed a round, consider them rejected
          studentsByRound[-2].push({...student, currentRound});
        } else {
          // Student is in a regular round
          studentsByRound[currentRound.roundNumber].push({...student, currentRound});
        }
      } else {
        // No rounds assigned yet, put in round 1 by default
        if (!studentsByRound[1]) {
          studentsByRound[1] = [];
        }
        studentsByRound[1].push(student);
      }
    }
    
    return studentsByRound;
  } catch (error) {
    console.error('Error fetching students by round:', error);
    throw error;
  }
};
