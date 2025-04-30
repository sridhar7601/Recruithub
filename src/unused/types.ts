// Types for RecruitHub application

// Student types
export interface AcademicDetailsDto {
  tenthMarks?: string;
  twelfthMarks?: string;
  diplomaMarks?: string;
  ugMarks?: string;
  pgMarks?: string;
}

export interface GitHubDetailsDto {
  totalScore?: number;
  domainScore?: number;
  contributionScore?: number;
  domains?: string;
  technologies?: string;
  consideration?: boolean;
  error?: string;
  lastAttempt?: string;
}

export interface WeCPDataDto {
  candidateId?: string;
  percentage?: number;
  programmingLanguagesUsed?: string[];
  testStartTime?: string;
  testDuration?: string;
  testFinished?: boolean;
  reportLink?: string;
}

export interface AIScoreComponentsDto {
  github?: {
    fullStack?: number;
    aiml?: number;
    contribution?: number;
  };
  resume?: {
    fullStack?: {
      frontend?: number;
      backend?: number;
      database?: number;
      infrastructure?: number;
    };
    aiml?: {
      core?: number;
      genai?: number;
    };
  };
}

export interface AIScoreDto {
  total?: number;
  components?: AIScoreComponentsDto;
  expertise?: {
    fullStack?: string;
    aiml?: string;
  };
}

export interface Student {
  studentId: string;
  registrationNumber: string;
  emailId: string;
  name?: string;
  phoneNumber?: string;
  degree?: string;
  department: string;
  gender?: string;
  dateOfBirth?: string;
  githubProfile?: string;
  linkedInProfile?: string;
  resumeUrl?: string;
  leetCodeProfile?: string;
  academicDetails?: AcademicDetailsDto;
  backlogHistory?: string;
  currentBacklogs?: number;
  aiScore?: AIScoreDto;
  wecpTestScore?: number;
  githubDetails?: GitHubDetailsDto;
  githubEvaluated?: boolean;
  resumeEvaluated?: boolean;
  wecpData?: WeCPDataDto;
  testBatch: string;
  collegeId: string;
  collegeName: string;
  driveId: string;
  driveName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  currentRound?: number;
}

export interface PaginatedStudentResponse {
  data: Student[];
  total: number;
  page: number;
  limit: number;
}

export interface StudentFilterParams {
  search?: string;
  departments?: string[];
  testBatches?: string[];
  sortBy?: 'aiRank' | 'name' | 'department' | 'registrationNumber';
  sortOrder?: 'asc' | 'desc';
}

export interface DepartmentCount {
  department: string;
  count: number;
}

export interface RoundCount {
  roundNumber: number;
  count: number;
}

export interface CreateStudentDto {
  registrationNumber: string;
  emailId: string;
  name?: string;
  phoneNumber?: string;
  degree?: string;
  department: string;
  gender?: string;
  dateOfBirth?: string;
  githubProfile?: string;
  linkedInProfile?: string;
  resumeUrl?: string;
  leetCodeProfile?: string;
  academicDetails?: AcademicDetailsDto;
  backlogHistory?: string;
  currentBacklogs?: number;
  testBatch: string;
  collegeId: string;
  collegeName: string;
  driveId: string;
  driveName: string;
}

export interface ImportResult {
  totalInserted: number;
  skippedEntries: {
    duplicates: {
      count: number;
      details: {
        registrationNumber: string;
        reason: string;
      }[];
    };
    invalidData: {
      count: number;
      details: {
        row: number;
        errors: string[];
      }[];
    };
  };
}

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

// Round types
export interface Round {
  roundId?: string;
  roundNumber: number;
  name: string;
  startTime: string;
  endTime: string;
  evaluationCriteria: EvaluationCriteriaDto[];
  createdAt?: string;
  updatedAt?: string;
}

export type StudentRoundStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'PASSED' | 'FAILED';

export interface EvaluationResult {
  criteriaId: string;
  value: number | string | boolean;
  feedback?: string;
}

export interface Evaluator {
  employeeId: string;
  name: string;
  emailId: string;
}

export interface StudentRound {
  studentId: string;
  roundNumber: number;
  status: StudentRoundStatus;
  panelId?: string;
  panelName?: string;
  evaluatedBy?: Evaluator;
  evaluationStartTime?: string;
  evaluationEndTime?: string;
  evaluationResults?: EvaluationResult[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateStudentRoundDto {
  status?: StudentRoundStatus;
  panelId?: string;
  evaluatedBy?: Evaluator;
  evaluationStartTime?: string;
  evaluationEndTime?: string;
  evaluationResults?: EvaluationResult[];
  notes?: string;
}

export interface StudentsByRound {
  [roundNumber: number]: Student[];
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
