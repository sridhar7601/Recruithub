import api from './api';
import { CreatePanelDto, Panel } from '../types';

export const getPanels = async (page: number = 1, limit: number = 10, primaryPanelMemberEmployeeId?: string): Promise<Panel[]> => {
  const response = await api.get('/panels', {
    params: { page, limit, primaryPanelMemberEmployeeId },
  });
  return response.data;
};

export const getPanelById = async (panelId: string): Promise<Panel> => {
  const response = await api.get(`/panels/${panelId}`);
  return response.data;
};

export const createPanel = async (panelData: CreatePanelDto): Promise<Panel> => {
  const response = await api.post('/panels', panelData);
  return response.data;
};

export const updatePanel = async (panelId: string, panelData: Partial<CreatePanelDto>): Promise<Panel> => {
  const response = await api.put(`/panels/${panelId}`, panelData);
  return response.data;
};