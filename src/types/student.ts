// Student types from API

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

export interface StudentEvaluationCriteriaDto {
  criteriaId: string;
  name?: string;
  description?: string;
  ratingType?: 'percentage' | 'scale-5' | 'scale-10' | 'yes-no' | 'text';
  isRequired?: boolean;
  value?: any;
  feedback?: string;
}

export interface StudentRoundEvaluatorDto {
  employeeId: string;
  name: string;
  emailId: string;
}

export interface StudentRound {
  roundNumber: number;
  name: string;
  evaluationCriteria?: StudentEvaluationCriteriaDto[];
  overallRating?: number;
  notes?: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'SUBMITTED';
  evaluatedBy?: StudentRoundEvaluatorDto;
  evaluationStartTime?: string;
  evaluationEndTime?: string;
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
  rounds?: StudentRound[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedStudentResponseDto {
  data: Student[];
  total: number;
  page: number;
  limit: number;
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

export interface StudentFilterParams {
  page?: number;
  limit?: number;
  collegeId?: string;
  driveId?: string;
  department?: string | string[];
  testBatch?: string | string[];
  search?: string;
  sortBy?: 'rank' | 'name';
  sortOrder?: 'asc' | 'desc';
}