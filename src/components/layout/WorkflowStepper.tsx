import React from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useGrading } from '../../contexts/GradingContext';
import { StepId } from '../../types/grading';
import { STEP_ORDER } from '../../utils/gradingReducer';

const STEP_LABELS: Record<StepId, string> = {
  select: 'Select',
  prepare: 'Criteria',
  grade: 'AI grading',
  review: 'Review',
  export: 'Export'
};

export function WorkflowStepper() {
  const { state, draft, goTo, canReach } = useGrading();
  const currentIndex = STEP_ORDER.indexOf(state.step);

  const isComplete = (step: StepId): boolean => {
    if (!draft) return false;
    switch (step) {
      case 'select':
        return true;
      case 'prepare':
        return draft.criteriaConfirmed || draft.gradingStatus !== 'idle';
      case 'grade':
        return draft.gradingStatus === 'done';
      case 'review':
        return (
          draft.gradingStatus === 'done' &&
          Object.values(draft.results).length > 0 &&
          Object.values(draft.results).every((r) => r.approved));

      case 'export':
        return Boolean(draft.exportedAt);
      default:
        return false;
    }
  };

  return (
    <nav aria-label="Grading workflow" className="border-t">
      {/* Desktop / tablet */}
      <ol className="mx-auto hidden h-12 max-w-7xl items-center gap-1 px-4 sm:flex sm:px-6">
        {STEP_ORDER.map((step, i) => {
          const current = i === currentIndex;
          const complete = isComplete(step) && !current;
          const reachable = canReach(step);
          return (
            <li key={step} className="flex items-center gap-1">
              <button
                type="button"
                disabled={!reachable}
                onClick={() => goTo(step)}
                aria-current={current ? 'step' : undefined}
                className={cn(
                  'relative flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
                  current ? 'text-foreground' : 'text-muted-foreground',
                  reachable && !current && 'hover:bg-muted/60 hover:text-foreground',
                  !reachable && 'cursor-not-allowed opacity-50'
                )}>
                
                {current &&
                <motion.span
                  layoutId="stepper-active"
                  className="absolute inset-0 rounded-md bg-muted"
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }} />

                }
                <span
                  className={cn(
                    'relative flex size-5 items-center justify-center rounded-full border text-[11px] font-medium tabular-nums transition-colors duration-200',
                    complete && 'border-primary bg-primary text-primary-foreground',
                    current && 'border-foreground text-foreground'
                  )}>
                  
                  {complete ? <Check className="size-3" aria-hidden="true" /> : i + 1}
                </span>
                <span className="relative font-medium">{STEP_LABELS[step]}</span>
              </button>
              {i < STEP_ORDER.length - 1 &&
              <ChevronRight className="size-4 text-muted-foreground/40" aria-hidden="true" />
              }
            </li>);

        })}
      </ol>

      {/* Mobile */}
      <div className="px-4 py-2.5 sm:hidden">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-medium text-foreground">{STEP_LABELS[state.step]}</span>
          <span className="text-muted-foreground tabular-nums">
            Step {currentIndex + 1} of {STEP_ORDER.length}
          </span>
        </div>
        <ol className="grid grid-cols-5 gap-1.5">
          {STEP_ORDER.map((step, i) => {
            const reachable = canReach(step);
            return (
              <li key={step}>
                <button
                  type="button"
                  disabled={!reachable}
                  onClick={() => goTo(step)}
                  aria-label={`${STEP_LABELS[step]}${i === currentIndex ? ' (current)' : ''}`}
                  className="flex h-6 w-full items-center disabled:cursor-not-allowed">
                  
                  <span className="relative h-1 w-full overflow-hidden rounded-full bg-muted">
                    <motion.span
                      className="absolute inset-y-0 left-0 rounded-full bg-primary"
                      initial={false}
                      animate={{ width: i < currentIndex || isComplete(step) ? '100%' : i === currentIndex ? '50%' : '0%' }}
                      transition={{ duration: 0.25 }} />
                    
                  </span>
                </button>
              </li>);

          })}
        </ol>
      </div>
    </nav>);

}