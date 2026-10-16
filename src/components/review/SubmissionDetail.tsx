import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Check, ChevronDown, KeyRound, Paperclip, RotateCcw, Undo2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/Alert';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';
import { Label } from '../ui/Label';
import { Separator } from '../ui/Separator';
import { Textarea } from '../ui/Textarea';
import { ScoreStepper } from './ScoreStepper';
import { ConfidenceIndicator } from '../shared/ConfidenceIndicator';
import { FLAG_ICONS } from '../shared/FlagBadges';
import { StudentAvatar } from '../shared/StudentAvatar';
import { FLAG_META } from '../../data/flags';
import { Criterion, GradeResult, Submission } from '../../types/grading';
import { formatPoints, maxScore, totalScore } from '../../utils/grading';

interface SubmissionDetailProps {
  submission: Submission;
  result: GradeResult;
  criteria: Criterion[];
  answerKey: string;
  hasNext: boolean;
  onChange: (patch: Partial<GradeResult>) => void;
  onApprove: (advance: boolean) => void;
  onUnapprove: () => void;
  onRetry: () => void;
}

export function SubmissionDetail({
  submission,
  result,
  criteria,
  answerKey,
  hasNext,
  onChange,
  onApprove,
  onUnapprove,
  onRetry
}: SubmissionDetailProps) {
  const [showKey, setShowKey] = useState(false);
  const total = totalScore(result.scores);
  const max = maxScore(criteria);
  const failed = result.status === 'failed';

  const setScore = (id: string, value: number) => onChange({ scores: { ...result.scores, [id]: value } });

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-5 p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start gap-3">
          <StudentAvatar name={submission.student.name} size="lg" />
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-semibold">{submission.student.name}</h2>
            <p className="truncate text-xs text-muted-foreground">
              {submission.submittedAt ? `Turned in ${submission.submittedAt}` : 'Not turned in'}
              {submission.late && ' · Late'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold tabular-nums tracking-tight" aria-live="polite">
              {formatPoints(total)}
              <span className="text-base font-normal text-muted-foreground">/{formatPoints(max)}</span>
            </div>
            {!failed && <ConfidenceIndicator confidence={result.confidence} showLabel />}
          </div>
        </div>

        {/* Status / flags */}
        {failed ?
        <Alert variant="destructive">
            <AlertCircle aria-hidden="true" />
            <AlertTitle>AI couldn’t grade this submission</AlertTitle>
            <AlertDescription>
              <span>{result.error} You can retry or enter scores manually below.</span>
              <Button size="sm" variant="outline" className="mt-2" onClick={onRetry}>
                <RotateCcw aria-hidden="true" />
                Retry AI grading
              </Button>
            </AlertDescription>
          </Alert> :

        result.flags.length > 0 &&
        <ul className="space-y-2">
              {result.flags.map((f) => {
            const Icon = FLAG_ICONS[f];
            return (
              <li key={f} className="flex gap-2.5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900">
                    <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <div>
                      <div className="text-sm font-medium">{FLAG_META[f].label}</div>
                      <div className="text-xs text-amber-800">{FLAG_META[f].description}</div>
                    </div>
                  </li>);

          })}
            </ul>

        }

        {/* Student response */}
        <section aria-labelledby="response-heading" className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 id="response-heading" className="text-sm font-medium">
              Student response
            </h3>
            {answerKey.trim() &&
            <Button variant="ghost" size="xs" onClick={() => setShowKey((v) => !v)} aria-expanded={showKey}>
                <KeyRound aria-hidden="true" />
                {showKey ? 'Hide' : 'Compare with'} answer key
                <ChevronDown className={cn('transition-transform duration-200', showKey && 'rotate-180')} aria-hidden="true" />
              </Button>
            }
          </div>
          <div className={cn('grid gap-2', showKey && 'md:grid-cols-2')}>
            <div className="rounded-lg border bg-muted/30 p-3">
              {submission.text ?
              <p className="whitespace-pre-line text-sm leading-relaxed">{submission.text}</p> :

              <p className="text-sm italic text-muted-foreground">No response submitted.</p>
              }
              {submission.attachment &&
              <span className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Paperclip className="size-3" aria-hidden="true" />
                  {submission.attachment}
                </span>
              }
            </div>
            <AnimatePresence initial={false}>
              {showKey &&
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="rounded-lg border border-dashed p-3">
                
                  <div className="mb-1 text-xs font-medium text-muted-foreground">Answer key</div>
                  <p className="whitespace-pre-line text-sm leading-relaxed">{answerKey}</p>
                </motion.div>
              }
            </AnimatePresence>
          </div>
        </section>

        <Separator />

        {/* Criteria scores */}
        <section aria-labelledby="scores-heading" className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 id="scores-heading" className="text-sm font-medium">
              Scores by criterion
            </h3>
            {result.adjusted &&
            <Button variant="ghost" size="xs" onClick={() => onChange({ scores: { ...result.aiScores } })}>
                <Undo2 aria-hidden="true" />
                Reset to AI scores
              </Button>
            }
          </div>
          <ul className="space-y-3">
            {criteria.map((c) => {
              const score = result.scores[c.id] ?? 0;
              const ai = result.aiScores[c.id];
              const changed = ai !== undefined && ai !== score;
              return (
                <li key={c.id} className="rounded-lg border p-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium">{c.title}</span>
                        {changed &&
                        <Badge variant="outline" className="font-normal text-muted-foreground">
                            AI: {formatPoints(ai)}
                          </Badge>
                        }
                      </div>
                      {result.rationale[c.id] &&
                      <p className="text-xs leading-relaxed text-muted-foreground">{result.rationale[c.id]}</p>
                      }
                    </div>
                    <ScoreStepper
                      value={score}
                      max={c.points}
                      label={`${c.title} score`}
                      onChange={(v) => setScore(c.id, v)} />
                    
                  </div>
                </li>);

            })}
          </ul>
        </section>

        {/* Feedback */}
        <section className="space-y-2">
          <Label htmlFor={`feedback-${submission.id}`}>Feedback for student</Label>
          <Textarea
            id={`feedback-${submission.id}`}
            value={result.feedback}
            onChange={(e) => onChange({ feedback: e.target.value })}
            rows={3}
            placeholder="Optional comment included in the export."
            className="text-sm" />
          
        </section>
      </div>

      {/* Actions */}
      <div className="sticky bottom-0 flex flex-col gap-2 border-t bg-background/95 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <AnimatePresence mode="wait" initial={false}>
          {result.approved ?
          <motion.div
            key="approved"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex w-full items-center justify-between gap-2">
            
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                <Check className="size-4" aria-hidden="true" />
                Approved by you{result.adjusted ? ' · adjusted' : ''}
              </span>
              <Button variant="ghost" size="sm" onClick={onUnapprove}>
                <Undo2 aria-hidden="true" />
                Undo approval
              </Button>
            </motion.div> :

          <motion.div
            key="pending"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            
              <span className="text-xs text-muted-foreground">
                {result.adjusted ? 'You adjusted this grade.' : 'AI-suggested grade · not yet approved'}
              </span>
              <div className="flex gap-2 [&>*]:flex-1 sm:[&>*]:flex-none">
                <Button variant="outline" onClick={() => onApprove(false)}>
                  Approve
                </Button>
                {hasNext &&
              <Button onClick={() => onApprove(true)}>
                    <Check aria-hidden="true" />
                    Approve & next
                  </Button>
              }
              </div>
            </motion.div>
          }
        </AnimatePresence>
      </div>
    </div>);

}