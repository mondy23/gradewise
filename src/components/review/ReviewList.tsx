import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Inbox } from 'lucide-react';
import { cn } from '../../utils/cn';
import { ConfidenceIndicator } from '../shared/ConfidenceIndicator';
import { FlagBadges } from '../shared/FlagBadges';
import { StudentAvatar } from '../shared/StudentAvatar';
import { GradeResult, ReviewFilter, Submission } from '../../types/grading';
import { formatPoints, totalScore } from '../../utils/grading';

interface ReviewListProps {
  items: {submission: Submission;result: GradeResult;}[];
  selectedId: string | null;
  maxPoints: number;
  filter: ReviewFilter;
  onSelect: (id: string) => void;
}

const EMPTY: Record<ReviewFilter, {title: string;text: string;}> = {
  flagged: { title: 'No flagged submissions left', text: 'Everything uncertain has been reviewed.' },
  ready: { title: 'Nothing waiting for approval', text: 'All high-confidence grades are approved.' },
  approved: { title: 'No approved grades yet', text: 'Approve grades to see them here.' },
  all: { title: 'No submissions', text: 'This assignment has no student work.' }
};

export function ReviewList({ items, selectedId, maxPoints, filter, onSelect }: ReviewListProps) {
  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center px-6 py-12 text-center">
        
        <span className="mb-3 flex size-10 items-center justify-center rounded-full bg-muted">
          {filter === 'flagged' || filter === 'ready' ?
          <CheckCircle2 className="size-5 text-emerald-600" aria-hidden="true" /> :

          <Inbox className="size-5 text-muted-foreground" aria-hidden="true" />
          }
        </span>
        <div className="text-sm font-medium">{EMPTY[filter].title}</div>
        <p className="mt-1 text-xs text-muted-foreground">{EMPTY[filter].text}</p>
      </motion.div>);

  }

  return (
    <ul className="divide-y" aria-label="Submissions">
      <AnimatePresence initial={false}>
        {items.map(({ submission, result }) => {
          const selected = selectedId === submission.id;
          return (
            <motion.li
              key={submission.id}
              layout="position"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden">
              
              <button
                type="button"
                aria-current={selected ? 'true' : undefined}
                onClick={() => onSelect(submission.id)}
                className={cn(
                  'relative flex w-full items-start gap-3 px-4 py-3 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-ring/50',
                  selected ? 'bg-muted' : 'hover:bg-muted/40'
                )}>
                
                {selected &&
                <motion.span
                  layoutId="review-selected"
                  className="absolute inset-y-0 left-0 w-0.5 bg-foreground"
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }} />

                }
                <StudentAvatar name={submission.student.name} size="sm" />
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium">{submission.student.name}</span>
                    <span className="shrink-0 text-sm tabular-nums">
                      {formatPoints(totalScore(result.scores))}
                      <span className="text-muted-foreground">/{formatPoints(maxPoints)}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    {result.status === 'failed' ?
                    <span className="inline-flex items-center gap-1 text-xs text-red-700">
                        <AlertCircle className="size-3" aria-hidden="true" />
                        AI grading failed
                      </span> :
                    result.flags.length > 0 ?
                    <FlagBadges flags={result.flags} max={1} /> :

                    <ConfidenceIndicator confidence={result.confidence} />
                    }
                    {result.approved &&
                    <span className="inline-flex shrink-0 items-center gap-1 text-xs text-emerald-700">
                        <CheckCircle2 className="size-3" aria-hidden="true" />
                        Approved
                      </span>
                    }
                  </div>
                </div>
              </button>
            </motion.li>);

        })}
      </AnimatePresence>
    </ul>);

}