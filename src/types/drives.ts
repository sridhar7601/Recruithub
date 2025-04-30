// Drive-related types

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
