import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../ui/Sheet';
import { StatusBadge } from '../shared/StatusBadge';
import { useGrading } from '../../contexts/GradingContext';
import { assignments } from '../../data/assignments';
import { courses } from '../../data/courses';
import { getAssignmentStatus } from '../../utils/assignmentStatus';

interface HistorySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HistorySheet({ open, onOpenChange }: HistorySheetProps) {
  const { state, openAssignment } = useGrading();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle>Grading history</SheetTitle>
          <SheetDescription>Pick up any assignment where you left off. Your work is saved per assignment.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4">
          {courses.map((course) =>
          <section key={course.id} className="mb-6 last:mb-0" aria-labelledby={`hist-${course.id}`}>
              <h3 id={`hist-${course.id}`} className="mb-2 px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {course.name} · {course.section}
              </h3>
              <ul className="space-y-1">
                {assignments.
              filter((a) => a.courseId === course.id).
              map((a) => {
                const status = getAssignmentStatus(a, state.drafts[a.id]);
                const active = state.assignmentId === a.id;
                return (
                  <li key={a.id}>
                        <button
                      type="button"
                      onClick={() => {
                        openAssignment(a);
                        onOpenChange(false);
                      }}
                      className="group flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors duration-150 hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
                      
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium">
                              {a.title}
                              {active && <span className="ml-2 text-xs font-normal text-muted-foreground">Current</span>}
                            </div>
                            <div className="mt-1">
                              <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                            </div>
                          </div>
                          <ChevronRight className="size-4 text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
                        </button>
                      </li>);

              })}
              </ul>
            </section>
          )}
        </div>
      </SheetContent>
    </Sheet>);

}