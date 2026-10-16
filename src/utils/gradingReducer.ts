import {
  Assignment,
  AssignmentDraft,
  GradeResult,
  StepId,
  Submission,
  UiState } from
'../types/grading';
import { createQueuedResult, gradeSubmission } from './grading';

export const STEP_ORDER: StepId[] = ['select', 'prepare', 'grade', 'review', 'export'];
const CONCURRENCY = 3;

export interface GradingState {
  connected: boolean;
  coursesLoaded: boolean;
  step: StepId;
  direction: 1 | -1;
  courseId: string | null;
  assignmentId: string | null;
  drafts: Record<string, AssignmentDraft>;
  ui: UiState;
}

export type GradingAction =
{type: 'CONNECT';} |
{type: 'DISCONNECT';} |
{type: 'COURSES_LOADED';} |
{type: 'GO_TO';step: StepId;} |
{type: 'SELECT_COURSE';courseId: string | null;} |
{type: 'SELECT_ASSIGNMENT';assignment: Assignment;} |
{type: 'UPDATE_DRAFT';assignmentId: string;patch: Partial<AssignmentDraft>;} |
{type: 'RESET_RESULTS';assignmentId: string;} |
{type: 'START_GRADING';assignmentId: string;submissions: Submission[];} |
{type: 'TICK';assignmentId: string;submissions: Submission[];} |
{type: 'RETRY_FAILED';assignmentId: string;} |
{type: 'UPDATE_RESULT';assignmentId: string;submissionId: string;patch: Partial<GradeResult>;} |
{type: 'SET_APPROVED';assignmentId: string;submissionIds: string[];approved: boolean;} |
{type: 'MARK_EXPORTED';assignmentId: string;} |
{type: 'SET_UI';patch: Partial<UiState>;};

export const initialState: GradingState = {
  connected: false,
  coursesLoaded: false,
  step: 'select',
  direction: 1,
  courseId: null,
  assignmentId: null,
  drafts: {},
  ui: { reviewFilter: 'flagged', reviewSelectedId: null }
};

export function createDraft(assignment: Assignment): AssignmentDraft {
  return {
    answerKey: assignment.answerKey ?? '',
    criteria: assignment.rubric ? assignment.rubric.map((c) => ({ ...c })) : [],
    suggested: assignment.suggestedCriteria ?? [],
    suggestion: !assignment.rubric && assignment.suggestedCriteria ? 'pending' : 'none',
    criteriaConfirmed: false,
    gradedCriteria: null,
    gradingStatus: 'idle',
    results: {}
  };
}

function resumeStep(draft: AssignmentDraft): StepId {
  if (draft.gradingStatus === 'done') {
    const pending = Object.values(draft.results).some((r) => !r.approved);
    return pending ? 'review' : 'export';
  }
  if (draft.gradingStatus === 'running' || draft.criteriaConfirmed) return 'grade';
  return 'prepare';
}

function directionFor(from: StepId, to: StepId): 1 | -1 {
  return STEP_ORDER.indexOf(to) >= STEP_ORDER.indexOf(from) ? 1 : -1;
}

function withDraft(
state: GradingState,
assignmentId: string,
update: (draft: AssignmentDraft) => AssignmentDraft)
: GradingState {
  const draft = state.drafts[assignmentId];
  if (!draft) return state;
  return { ...state, drafts: { ...state.drafts, [assignmentId]: update(draft) } };
}

export function gradingReducer(state: GradingState, action: GradingAction): GradingState {
  switch (action.type) {
    case 'CONNECT':
      return { ...state, connected: true };
    case 'DISCONNECT':
      return { ...initialState };
    case 'COURSES_LOADED':
      return { ...state, coursesLoaded: true };
    case 'GO_TO':
      if (action.step === state.step) return state;
      return { ...state, step: action.step, direction: directionFor(state.step, action.step) };
    case 'SELECT_COURSE':
      return { ...state, courseId: action.courseId };
    case 'SELECT_ASSIGNMENT':{
        const { assignment } = action;
        const draft = state.drafts[assignment.id] ?? createDraft(assignment);
        const step = resumeStep(draft);
        return {
          ...state,
          courseId: assignment.courseId,
          assignmentId: assignment.id,
          step,
          direction: 1,
          drafts: { ...state.drafts, [assignment.id]: draft },
          ui: { reviewFilter: 'flagged', reviewSelectedId: null }
        };
      }
    case 'UPDATE_DRAFT':
      return withDraft(state, action.assignmentId, (d) => ({ ...d, ...action.patch }));
    case 'RESET_RESULTS':
      return withDraft(state, action.assignmentId, (d) => ({
        ...d,
        results: {},
        gradingStatus: 'idle',
        gradedCriteria: null,
        startedAt: undefined,
        completedAt: undefined,
        exportedAt: undefined
      }));
    case 'START_GRADING':
      return withDraft(state, action.assignmentId, (d) => {
        const results: Record<string, GradeResult> = {};
        action.submissions.forEach((s) => {
          results[s.id] = createQueuedResult(s.id);
        });
        return {
          ...d,
          results,
          gradingStatus: 'running',
          gradedCriteria: d.criteria.map((c) => ({ ...c })),
          startedAt: new Date().toISOString(),
          completedAt: undefined,
          exportedAt: undefined
        };
      });
    case 'TICK':
      return withDraft(state, action.assignmentId, (d) => {
        if (d.gradingStatus !== 'running') return d;
        const results = { ...d.results };
        const order = action.submissions.map((s) => s.id);
        const firstProcessing = order.find((id) => results[id]?.status === 'processing');
        if (firstProcessing) {
          const sub = action.submissions.find((s) => s.id === firstProcessing);
          const r = results[firstProcessing];
          if (sub && r) {
            if (sub.sample.failsFirst && r.attempts <= 1) {
              results[firstProcessing] = {
                ...r,
                status: 'failed',
                error: `Couldn’t read ${sub.attachment ?? 'the attachment'}. Retry with enhanced text recognition.`
              };
            } else {
              results[firstProcessing] = {
                ...r,
                ...gradeSubmission(sub, d.criteria),
                status: 'graded',
                error: undefined
              };
            }
          }
        }
        let active = order.filter((id) => results[id]?.status === 'processing').length;
        for (const id of order) {
          if (active >= CONCURRENCY) break;
          const r = results[id];
          if (r && r.status === 'queued') {
            results[id] = { ...r, status: 'processing', attempts: r.attempts + 1 };
            active++;
          }
        }
        const finished = order.every(
          (id) => results[id]?.status === 'graded' || results[id]?.status === 'failed'
        );
        return {
          ...d,
          results,
          gradingStatus: finished ? 'done' : 'running',
          completedAt: finished ? new Date().toISOString() : d.completedAt
        };
      });
    case 'RETRY_FAILED':
      return withDraft(state, action.assignmentId, (d) => {
        const results = { ...d.results };
        let any = false;
        Object.values(results).forEach((r) => {
          if (r.status === 'failed') {
            results[r.submissionId] = { ...r, status: 'queued' };
            any = true;
          }
        });
        return any ? { ...d, results, gradingStatus: 'running' } : d;
      });
    case 'UPDATE_RESULT':
      return withDraft(state, action.assignmentId, (d) => {
        const r = d.results[action.submissionId];
        if (!r) return d;
        const next = { ...r, ...action.patch };
        if (action.patch.scores) {
          next.adjusted = Object.keys(next.scores).some((k) => next.scores[k] !== next.aiScores[k]);
        }
        return { ...d, results: { ...d.results, [action.submissionId]: next } };
      });
    case 'SET_APPROVED':
      return withDraft(state, action.assignmentId, (d) => {
        const results = { ...d.results };
        action.submissionIds.forEach((id) => {
          const r = results[id];
          if (r) results[id] = { ...r, approved: action.approved };
        });
        return { ...d, results };
      });
    case 'MARK_EXPORTED':
      return withDraft(state, action.assignmentId, (d) => ({ ...d, exportedAt: new Date().toISOString() }));
    case 'SET_UI':
      return { ...state, ui: { ...state.ui, ...action.patch } };
    default:
      return state;
  }
}