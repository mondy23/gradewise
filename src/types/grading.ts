export type StepId = 'select' | 'prepare' | 'grade' | 'review' | 'export';

export type FlagReason =
'low-confidence' |
'incomplete' |
'missing' |
'off-key' |
'unreadable';

export type CriterionSource = 'teacher' | 'ai' | 'custom';

export interface Criterion {
  id: string;
  title: string;
  description: string;
  points: number;
  source: CriterionSource;
}

export interface SampleAnswer {
  text: string;
  quality: number;
  confidence: number;
  flag?: FlagReason;
  failsFirst?: boolean;
  attachment?: string;
}

export type AssignmentType = 'Short answer' | 'Essay' | 'Problem set' | 'Lab report' | 'Exit ticket';

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  type: AssignmentType;
  dueDate: string;
  maxPoints: number;
  instructions: string;
  answerKey?: string;
  rubric?: Criterion[];
  suggestedCriteria?: Criterion[];
  previouslyGraded?: {date: string;average: number;};
  samples: SampleAnswer[];
}

export interface Course {
  id: string;
  name: string;
  section: string;
  room: string;
  studentOffset: number;
  studentCount: number;
}

export interface Student {
  id: string;
  name: string;
  email: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  student: Student;
  submittedAt: string | null;
  late: boolean;
  text: string;
  attachment?: string;
  sample: SampleAnswer;
}

export type GradeStatus = 'queued' | 'processing' | 'graded' | 'failed';

export interface GradeResult {
  submissionId: string;
  status: GradeStatus;
  scores: Record<string, number>;
  aiScores: Record<string, number>;
  rationale: Record<string, string>;
  confidence: number;
  flags: FlagReason[];
  feedback: string;
  approved: boolean;
  adjusted: boolean;
  attempts: number;
  error?: string;
}

export type SuggestionState = 'none' | 'pending' | 'accepted' | 'dismissed';

export interface AssignmentDraft {
  answerKey: string;
  criteria: Criterion[];
  suggested: Criterion[];
  suggestion: SuggestionState;
  criteriaConfirmed: boolean;
  gradedCriteria: Criterion[] | null;
  gradingStatus: 'idle' | 'running' | 'done';
  results: Record<string, GradeResult>;
  startedAt?: string;
  completedAt?: string;
  exportedAt?: string;
}

export type ReviewFilter = 'flagged' | 'ready' | 'approved' | 'all';

export interface UiState {
  reviewFilter: ReviewFilter;
  reviewSelectedId: string | null;
}