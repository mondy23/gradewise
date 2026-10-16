import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Calculator,
  Check,
  ChevronRight,
  ClipboardList,
  FileText,
  FlaskConical,
  Minus,
  PenLine,
  Sparkles } from
'lucide-react';
import { format } from 'date-fns';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';
import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { StatusBadge } from '../shared/StatusBadge';
import { useGrading } from '../../contexts/GradingContext';
import { assignments } from '../../data/assignments';
import { Assignment, AssignmentType } from '../../types/grading';
import { getAssignmentStatus } from '../../utils/assignmentStatus';
import { getSubmissions } from '../../utils/submissions';

const TYPE_ICONS: Record<AssignmentType, React.ComponentType<{className?: string;}>> = {
  'Short answer': FileText,
  Essay: PenLine,
  'Problem set': Calculator,
  'Lab report': FlaskConical,
  'Exit ticket': ClipboardList
};

interface AssignmentListProps {
  loading: boolean;
  showBack: boolean;
}

function MaterialChip({ present, label, suggest }: {present: boolean;label: string;suggest?: boolean;}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px]',
        present ? 'bg-muted text-foreground' : 'text-muted-foreground'
      )}>
      
      {present ?
      <Check className="size-3" aria-hidden="true" /> :
      suggest ?
      <Sparkles className="size-3" aria-hidden="true" /> :

      <Minus className="size-3" aria-hidden="true" />
      }
      {suggest && !present ? 'Rubric suggested' : present ? label : `No ${label.toLowerCase()}`}
    </span>);

}

function AssignmentRow({ assignment, onOpen }: {assignment: Assignment;onOpen: () => void;}) {
  const { state } = useGrading();
  const Icon = TYPE_ICONS[assignment.type];
  const subs = getSubmissions(assignment);
  const turnedIn = subs.filter((s) => s.submittedAt).length;
  const status = getAssignmentStatus(assignment, state.drafts[assignment.id]);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex w-full items-start gap-3 p-4 text-left transition-colors duration-150 hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none sm:items-center">
      
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background">
        <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1 space-y-1.5">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-sm font-medium">{assignment.title}</span>
          <StatusBadge tone={status.tone} className="sm:hidden">
            {status.label}
          </StatusBadge>
        </span>
        <span className="block text-xs text-muted-foreground">
          {assignment.type} · Due {format(new Date(assignment.dueDate), 'MMM d')} · {assignment.maxPoints} pts ·{' '}
          <span className="tabular-nums">
            {turnedIn}/{subs.length}
          </span>{' '}
          turned in
        </span>
        <span className="flex flex-wrap gap-1">
          <MaterialChip present={Boolean(assignment.answerKey)} label="Answer key" />
          <MaterialChip present={Boolean(assignment.rubric)} label="Rubric" suggest={Boolean(assignment.suggestedCriteria)} />
        </span>
      </span>
      <StatusBadge tone={status.tone} className="hidden sm:inline-flex">
        {status.label}
      </StatusBadge>
      <ChevronRight
        className="mt-2 size-4 shrink-0 text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5 sm:mt-0"
        aria-hidden="true" />
      
    </button>);

}

export function AssignmentList({ loading, showBack }: AssignmentListProps) {
  const { course, selectCourse, openAssignment } = useGrading();
  const list = course ? assignments.filter((a) => a.courseId === course.id) : [];

  return (
    <section aria-labelledby="assignments-heading" className="min-w-0 space-y-3">
      <div className="flex items-center gap-2 px-1">
        {showBack &&
        <Button variant="ghost" size="icon-sm" onClick={() => selectCourse(null)} aria-label="Back to courses">
            <ArrowLeft aria-hidden="true" />
          </Button>
        }
        <h2 id="assignments-heading" className="text-sm font-medium">
          {course ? `Assignments in ${course.name}` : 'Assignments'}
        </h2>
      </div>

      <Card className="gap-0 overflow-hidden py-0">
        {loading || !course ?
        <div className="divide-y" aria-busy="true" aria-label="Loading assignments">
            {[0, 1, 2].map((i) =>
          <div key={i} className="flex items-center gap-3 p-4">
                <Skeleton className="size-9 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-64 max-w-full" />
                </div>
              </div>
          )}
          </div> :

        <AnimatePresence mode="wait" initial={false}>
            <motion.ul
            key={course.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="divide-y">
            
              {list.map((a) =>
            <li key={a.id}>
                  <AssignmentRow assignment={a} onOpen={() => openAssignment(a)} />
                </li>
            )}
            </motion.ul>
          </AnimatePresence>
        }
      </Card>
    </section>);

}