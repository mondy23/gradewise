import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowRight, CheckCircle2, Clock, Flag, Loader2, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/Alert';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { Progress } from '../ui/Progress';
import { GradingRow } from './GradingRow';
import { PageHeader } from '../shared/PageHeader';
import { StepActionBar } from '../shared/StepActionBar';
import { useGrading } from '../../contexts/GradingContext';
import { maxScore } from '../../utils/grading';

export function GradeStep() {
  const { course, assignment, draft, submissions, startGrading, retryFailed, goTo, resetResults } = useGrading();
  if (!course || !assignment || !draft) return null;

  const results = Object.values(draft.results);
  const counts = {
    queued: results.filter((r) => r.status === 'queued').length,
    processing: results.filter((r) => r.status === 'processing').length,
    graded: results.filter((r) => r.status === 'graded').length,
    failed: results.filter((r) => r.status === 'failed').length,
    flagged: results.filter((r) => r.status === 'graded' && r.flags.length > 0).length
  };
  const total = submissions.length;
  const finished = counts.graded + counts.failed;
  const pct = total ? Math.round(finished / total * 100) : 0;
  const status = draft.gradingStatus;
  const criteria = draft.gradedCriteria ?? draft.criteria;
  const max = maxScore(criteria);
  const criteriaChanged =
  status !== 'idle' && JSON.stringify(draft.criteria) !== JSON.stringify(draft.gradedCriteria);
  const needsAttention = counts.flagged + counts.failed;

  const regrade = () => {
    resetResults();
    startGrading();
  };

  return (
    <div>
      <PageHeader
        eyebrow={`${course.name} · ${assignment.title}`}
        title="AI-assisted grading"
        description="Grades are drafts until you approve them. Nothing is posted to Classroom." />
      

      {criteriaChanged &&
      <Alert className="mb-4">
          <AlertCircle aria-hidden="true" />
          <AlertTitle>Criteria changed since this run</AlertTitle>
          <AlertDescription>
            <span>Regrade to apply your updated criteria. Current approvals will be cleared.</span>
            <Button size="sm" variant="outline" className="mt-2" onClick={regrade}>
              <RotateCcw aria-hidden="true" />
              Regrade with new criteria
            </Button>
          </AlertDescription>
        </Alert>
      }

      <Card className="mb-6">
        <CardContent className="p-5 sm:p-6">
          <AnimatePresence mode="wait" initial={false}>
            {status === 'idle' ?
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              
                <div className="flex gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Sparkles className="size-5" aria-hidden="true" />
                  </span>
                  <div className="space-y-1">
                    <h2 className="text-base font-medium">Ready to grade {total} submissions</h2>
                    <p className="text-sm text-muted-foreground">
                      Scored against {draft.criteria.length} criteria ({max} pts)
                      {draft.answerKey.trim() ? ' using your answer key' : ''}. Uncertain results are flagged for you.
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <ShieldCheck className="size-3.5" aria-hidden="true" />
                      You review and approve every grade before export.
                    </p>
                  </div>
                </div>
                <Button size="lg" onClick={startGrading} className="md:w-auto">
                  <Sparkles aria-hidden="true" />
                  Start AI grading
                </Button>
              </motion.div> :

            <motion.div
              key="progress"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="space-y-4">
              
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    {status === 'running' ?
                  <Loader2 className="size-5 animate-spin text-sky-600" aria-hidden="true" /> :
                  counts.failed > 0 ?
                  <AlertCircle className="size-5 text-amber-600" aria-hidden="true" /> :

                  <CheckCircle2 className="size-5 text-emerald-600" aria-hidden="true" />
                  }
                    <div aria-live="polite">
                      <h2 className="text-base font-medium">
                        {status === 'running' ?
                      `Grading ${finished} of ${total}…` :
                      counts.failed > 0 ?
                      'Grading finished with issues' :
                      'Grading complete'}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {status === 'running' ?
                      'You can keep working — grading continues in the background.' :
                      `${needsAttention} of ${total} need your review.`}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {status === 'done' && counts.failed > 0 &&
                  <Button variant="outline" onClick={retryFailed}>
                        <RotateCcw aria-hidden="true" />
                        Retry {counts.failed} failed
                      </Button>
                  }
                  </div>
                </div>

                <div className="space-y-2">
                  <Progress value={pct} aria-label="Grading progress" className="h-2 [&>*]:transition-transform [&>*]:duration-300" />
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3" aria-hidden="true" />
                      <span className="tabular-nums">{counts.queued}</span> queued
                    </span>
                    <span className="inline-flex items-center gap-1 text-sky-700">
                      <Loader2 className="size-3" aria-hidden="true" />
                      <span className="tabular-nums">{counts.processing}</span> processing
                    </span>
                    <span className="inline-flex items-center gap-1 text-emerald-700">
                      <CheckCircle2 className="size-3" aria-hidden="true" />
                      <span className="tabular-nums">{counts.graded - counts.flagged}</span> graded
                    </span>
                    <span className="inline-flex items-center gap-1 text-amber-800">
                      <Flag className="size-3" aria-hidden="true" />
                      <span className="tabular-nums">{counts.flagged}</span> flagged
                    </span>
                    <span className="inline-flex items-center gap-1 text-red-700">
                      <AlertCircle className="size-3" aria-hidden="true" />
                      <span className="tabular-nums">{counts.failed}</span> failed
                    </span>
                    <span className="ml-auto font-medium tabular-nums text-foreground">{pct}%</span>
                  </div>
                </div>
              </motion.div>
            }
          </AnimatePresence>
        </CardContent>
      </Card>

      <Card className="gap-0 overflow-hidden py-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-sm font-medium">Submissions</h2>
          <span className="hidden text-xs text-muted-foreground sm:block">Confidence · Score · Status</span>
        </div>
        <ul className="divide-y">
          {submissions.map((s) =>
          <GradingRow key={s.id} submission={s} result={draft.results[s.id]} maxPoints={max} />
          )}
        </ul>
      </Card>

      <StepActionBar
        summary={
        status === 'done' ?
        `${counts.graded} graded · ${needsAttention} need review` :
        status === 'running' ?
        `${pct}% complete` :
        'Review is unlocked once grading finishes.'
        }>
        
        <Button variant="outline" onClick={() => goTo('prepare')}>
          Criteria
        </Button>
        <Button onClick={() => goTo('review')} disabled={status !== 'done'}>
          Review grades
          <ArrowRight aria-hidden="true" />
        </Button>
      </StepActionBar>
    </div>);

}