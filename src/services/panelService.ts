import api from './api';
import { CreatePanelDto, Panel, PanelMemberDto } from '../types';

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

// Extended PanelMemberDto with UUID for use as SPOC
export interface SpocDto extends PanelMemberDto {
  uuid: string; // This will be the panelId to use as primarySpocId
}

// Function to get available SPOCs from panel members
export const getAvailableSpocs = async (): Promise<SpocDto[]> => {
  try {
    // Get all panels
    const panels = await getPanels(1, 100);
    
    // Extract unique panel members (both primary and additional)
    const spocs: SpocDto[] = [];
    const spocIds = new Set<string>();
    
    panels.forEach(panel => {
      // Add primary panel member if not already added
      if (!spocIds.has(panel.primaryPanelMember.employeeId)) {
        spocs.push({
          ...panel.primaryPanelMember,
          uuid: panel.panelId // Use panelId as UUID for SPOC
        });
        spocIds.add(panel.primaryPanelMember.employeeId);
      }
      
      // Add additional panel members if not already added
      if (panel.additionalPanelMembers) {
        panel.additionalPanelMembers.forEach(member => {
          if (!spocIds.has(member.employeeId)) {
            spocs.push({
              ...member,
              uuid: panel.panelId // Use panelId as UUID for SPOC
            });
            spocIds.add(member.employeeId);
          }
        });
      }
    });
    
    return spocs;
  } catch (error) {
    console.error('Failed to fetch available SPOCs:', error);
    return [];
  }
};
