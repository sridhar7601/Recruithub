import api from './api';
import { CreateDriveDto, DriveDocument, PaginatedDriveResponse } from '../types';

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
