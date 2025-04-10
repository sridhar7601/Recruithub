import api from './api';
import { CreateDriveDto, DriveDocument, PaginatedDriveResponse } from '../types';

export const getDrives = async (page: number = 1, limit: number = 10): Promise<PaginatedDriveResponse> => {
  const response = await api.get('/drives', {
    params: { page, limit },
  });
  return response.data;
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