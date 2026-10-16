import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { toast } from 'sonner';
import { assignments } from '../data/assignments';
import { courses } from '../data/courses';
import {
  Assignment,
  AssignmentDraft,
  Course,
  GradeResult,
  StepId,
  Submission,
  UiState } from
'../types/grading';
import { GradingState, gradingReducer, initialState } from '../utils/gradingReducer';
import { getSubmissions } from '../utils/submissions';

interface GradingContextValue {
  state: GradingState;
  course: Course | null;
  assignment: Assignment | null;
  draft: AssignmentDraft | null;
  submissions: Submission[];
  connect: () => void;
  disconnect: () => void;
  markCoursesLoaded: () => void;
  goTo: (step: StepId) => void;
  selectCourse: (courseId: string | null) => void;
  openAssignment: (assignment: Assignment) => void;
  updateDraft: (patch: Partial<AssignmentDraft>) => void;
  resetResults: () => void;
  startGrading: () => void;
  retryFailed: () => void;
  updateResult: (submissionId: string, patch: Partial<GradeResult>) => void;
  setApproved: (submissionIds: string[], approved: boolean) => void;
  markExported: () => void;
  setUi: (patch: Partial<UiState>) => void;
  canReach: (step: StepId) => boolean;
}

const GradingContext = createContext<GradingContextValue | null>(null);

export function GradingProvider({ children }: {children: React.ReactNode;}) {
  const [state, dispatch] = useReducer(gradingReducer, initialState);

  const course = useMemo(() => courses.find((c) => c.id === state.courseId) ?? null, [state.courseId]);
  const assignment = useMemo(
    () => assignments.find((a) => a.id === state.assignmentId) ?? null,
    [state.assignmentId]
  );
  const draft = state.assignmentId ? state.drafts[state.assignmentId] ?? null : null;
  const submissions = useMemo(() => assignment ? getSubmissions(assignment) : [], [assignment]);

  // Background grading runner — keeps working while the teacher moves between steps.
  const runningIds = Object.entries(state.drafts).
  filter(([, d]) => d.gradingStatus === 'running').
  map(([id]) => id).
  join(',');

  useEffect(() => {
    if (!runningIds) return;
    const ids = runningIds.split(',');
    const timer = window.setInterval(() => {
      ids.forEach((id) => {
        const a = assignments.find((x) => x.id === id);
        if (a) dispatch({ type: 'TICK', assignmentId: id, submissions: getSubmissions(a) });
      });
    }, 360);
    return () => window.clearInterval(timer);
  }, [runningIds]);

  // Notify when a grading run completes.
  const prevStatuses = useRef<Record<string, string>>({});
  useEffect(() => {
    Object.entries(state.drafts).forEach(([id, d]) => {
      const prev = prevStatuses.current[id];
      if (prev === 'running' && d.gradingStatus === 'done') {
        const a = assignments.find((x) => x.id === id);
        const failed = Object.values(d.results).filter((r) => r.status === 'failed').length;
        if (failed > 0) {
          toast.warning(`Grading finished for ${a?.title ?? 'assignment'}`, {
            description: `${failed} submission${failed > 1 ? 's' : ''} couldn’t be graded and need attention.`
          });
        } else {
          toast.success(`Grading finished for ${a?.title ?? 'assignment'}`, {
            description: 'Review flagged submissions before exporting.'
          });
        }
      }
      prevStatuses.current[id] = d.gradingStatus;
    });
  }, [state.drafts]);

  const aid = state.assignmentId;

  const canReach = useCallback(
    (step: StepId) => {
      if (step === 'select') return true;
      if (!draft) return false;
      if (step === 'prepare') return true;
      if (step === 'grade') return draft.criteriaConfirmed || draft.gradingStatus !== 'idle';
      return draft.gradingStatus === 'done';
    },
    [draft]
  );

  const stable = useMemo(
    () => ({
      connect: () => dispatch({ type: 'CONNECT' }),
      disconnect: () => dispatch({ type: 'DISCONNECT' }),
      markCoursesLoaded: () => dispatch({ type: 'COURSES_LOADED' }),
      goTo: (step: StepId) => dispatch({ type: 'GO_TO', step }),
      selectCourse: (courseId: string | null) => dispatch({ type: 'SELECT_COURSE', courseId }),
      openAssignment: (a: Assignment) => dispatch({ type: 'SELECT_ASSIGNMENT', assignment: a }),
      setUi: (patch: Partial<UiState>) => dispatch({ type: 'SET_UI', patch })
    }),
    []
  );

  const value = useMemo<GradingContextValue>(
    () => ({
      state,
      course,
      assignment,
      draft,
      submissions,
      ...stable,
      connect: stable.connect,
      updateDraft: (patch) => aid && dispatch({ type: 'UPDATE_DRAFT', assignmentId: aid, patch }),
      resetResults: () => aid && dispatch({ type: 'RESET_RESULTS', assignmentId: aid }),
      startGrading: () => aid && dispatch({ type: 'START_GRADING', assignmentId: aid, submissions }),
      retryFailed: () => aid && dispatch({ type: 'RETRY_FAILED', assignmentId: aid }),
      updateResult: (submissionId, patch) =>
      aid && dispatch({ type: 'UPDATE_RESULT', assignmentId: aid, submissionId, patch }),
      setApproved: (submissionIds, approved) =>
      aid && dispatch({ type: 'SET_APPROVED', assignmentId: aid, submissionIds, approved }),
      markExported: () => aid && dispatch({ type: 'MARK_EXPORTED', assignmentId: aid }),
      canReach
    }),
    [state, course, assignment, draft, submissions, aid, canReach, stable]
  );

  return <GradingContext.Provider value={value}>{children}</GradingContext.Provider>;
}

export function useGrading(): GradingContextValue {
  const ctx = useContext(GradingContext);
  if (!ctx) throw new Error('useGrading must be used within GradingProvider');
  return ctx;
}