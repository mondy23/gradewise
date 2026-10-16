import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Clock, Flag, Loader2 } from 'lucide-react';
import { ConfidenceIndicator } from '../shared/ConfidenceIndicator';
import { StudentAvatar } from '../shared/StudentAvatar';
import { GradeResult, Submission } from '../../types/grading';
import { formatPoints, totalScore } from '../../utils/grading';

interface GradingRowProps {
  submission: Submission;
  result?: GradeResult;
  maxPoints: number;
}

function StatusPill({ result }: {result?: GradeResult;}) {
  const status = result?.status ?? 'queued';
  const common = 'inline-flex items-center gap-1.5 text-xs';
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={status}
        initial={{ opacity: 0, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -3 }}
        transition={{ duration: 0.15 }}
        className="inline-flex">
        
        {status === 'queued' &&
        <span className={`${common} text-muted-foreground`}>
            <Clock className="size-3.5" aria-hidden="true" />
            Queued
          </span>
        }
        {status === 'processing' &&
        <span className={`${common} font-medium text-sky-700`}>
            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
            Grading…
          </span>
        }
        {status === 'graded' && result && result.flags.length > 0 &&
        <span className={`${common} font-medium text-amber-800`}>
            <Flag className="size-3.5" aria-hidden="true" />
            Flagged
          </span>
        }
        {status === 'graded' && result && result.flags.length === 0 &&
        <span className={`${common} font-medium text-emerald-700`}>
            <CheckCircle2 className="size-3.5" aria-hidden="true" />
            Graded
          </span>
        }
        {status === 'failed' &&
        <span className={`${common} font-medium text-red-700`}>
            <AlertCircle className="size-3.5" aria-hidden="true" />
            Failed
          </span>
        }
      </motion.span>
    </AnimatePresence>);

}

export function GradingRow({ submission, result, maxPoints }: GradingRowProps) {
  const graded = result?.status === 'graded';
  const processing = result?.status === 'processing';
  return (
    <li className="relative flex items-center gap-3 overflow-hidden px-4 py-3">
      {processing &&
      <motion.span
        className="absolute inset-y-0 left-0 w-0.5 bg-sky-500"
        layoutId={`proc-${submission.id}`}
        aria-hidden="true" />

      }
      <StudentAvatar name={submission.student.name} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{submission.student.name}</div>
        <div className="truncate text-xs text-muted-foreground">
          {result?.status === 'failed' ? result.error : submission.submittedAt ? `Turned in ${submission.submittedAt}` : 'Not turned in'}
        </div>
      </div>
      <div className="hidden w-24 sm:block">
        {graded && result && <ConfidenceIndicator confidence={result.confidence} />}
      </div>
      <div className="w-20 text-right text-sm tabular-nums">
        {graded && result ?
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
            <span className="font-medium">{formatPoints(totalScore(result.scores))}</span>
            <span className="text-muted-foreground">/{formatPoints(maxPoints)}</span>
          </motion.span> :

        <span className="text-muted-foreground">—</span>
        }
      </div>
      <div className="w-20 sm:w-24">
        <StatusPill result={result} />
      </div>
    </li>);

}