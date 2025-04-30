// Round-related types
import { Student } from './student';
import { EvaluationCriteriaDto } from './drives';

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

export interface StudentRoundDetails {
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

export interface UpdateStudentRoundDetailsDto {
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
