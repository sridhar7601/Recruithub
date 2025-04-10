// Types for RecruitHub application

// College types
export interface CollegeResponseDto {
  collegeId: string;
  name: string;
  city: string;
  isDeleted: boolean;
  createdTimestamp: string;
  updatedTimestamp: string;
}

export interface PaginationMetaDto {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

export interface PaginatedCollegeResponseDto {
  items: CollegeResponseDto[];
  meta: PaginationMetaDto;
}

// Drive types
export interface SecondarySpocDto {
  spocId: string;
  spocEmail: string;
  spocName: string;
}

export interface EvaluationCriteriaDto {
  criteriaId?: string;
  name: string;
  description?: string;
  ratingType: 'percentage' | 'scale-5' | 'scale-10' | 'yes-no' | 'text';
  isRequired: boolean;
}

export interface RoundDto {
  roundNumber: number;
  name: string;
  startTime: string;
  endTime: string;
  evaluationCriteria: EvaluationCriteriaDto[];
}

export interface DriveDocument {
  driveId: string;
  name: string;
  collegeId: string;
  collegeName: string;
  role: 'Associate Engineer' | 'Business Analyst';
  practice: 'Application Development' | 'DevOps' | 'PMO' | 'BaUX';
  startDate: string;
  primarySpocId: string;
  primarySpocEmail: string;
  primarySpocName: string;
  secondarySpocs?: SecondarySpocDto[];
  isPinned: boolean;
  isCompleted: boolean;
  isActive: boolean;
  wecpTestIds?: string[];
  rounds?: RoundDto[];
  createdTimestamp: string;
  updatedTimestamp: string;
  // UI display properties
  studentCount?: number;
  activeRound?: number;
}

export interface PaginatedDriveResponse {
  drives: DriveDocument[];
  total: number;
  page: number;
  limit: number;
}

// Create Drive DTO
export interface CreateDriveDto {
  name: string;
  collegeId: string;
  collegeName: string;
  role: 'Associate Engineer' | 'Business Analyst';
  practice: 'Application Development' | 'DevOps' | 'PMO' | 'BaUX';
  startDate: string;
  primarySpocId: string;
  primarySpocEmail: string;
  primarySpocName: string;
  secondarySpocs?: SecondarySpocDto[];
  isPinned?: boolean;
  isCompleted?: boolean;
  rounds?: RoundDto[];
}

// Panel types
export interface PanelMemberDto {
  employeeId: string;
  emailId: string;
  name: string;
}

export interface Panel {
  panelId: string;
  primaryPanelMember: PanelMemberDto;
  additionalPanelMembers?: PanelMemberDto[];
  name?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePanelDto {
  primaryPanelMember: PanelMemberDto;
  additionalPanelMembers?: PanelMemberDto[];
  name?: string;
}