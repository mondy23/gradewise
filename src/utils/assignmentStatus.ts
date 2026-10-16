import { format } from 'date-fns';
import { Assignment, AssignmentDraft } from '../types/grading';

export type StatusTone = 'neutral' | 'progress' | 'attention' | 'success';

export interface AssignmentStatus {
  label: string;
  tone: StatusTone;
}

export function getAssignmentStatus(assignment: Assignment, draft?: AssignmentDraft): AssignmentStatus {
  if (draft) {
    if (draft.exportedAt) {
      return { label: `Exported ${format(new Date(draft.exportedAt), 'MMM d')}`, tone: 'success' };
    }
    if (draft.gradingStatus === 'running') return { label: 'Grading…', tone: 'progress' };
    if (draft.gradingStatus === 'done') {
      const pending = Object.values(draft.results).filter((r) => !r.approved).length;
      return pending > 0 ?
      { label: `${pending} to approve`, tone: 'attention' } :
      { label: 'Ready to export', tone: 'success' };
    }
    if (draft.criteriaConfirmed) return { label: 'Criteria ready', tone: 'progress' };
    if (draft.criteria.length > 0 || draft.suggestion === 'accepted') return { label: 'In progress', tone: 'progress' };
  }
  if (assignment.previouslyGraded) {
    return { label: `Graded ${assignment.previouslyGraded.date}`, tone: 'neutral' };
  }
  return { label: 'Not started', tone: 'neutral' };
}