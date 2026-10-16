import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft, Check, Download, FileSpreadsheet, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '../ui/Alert';
import { Button } from '../ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { ResultsTable } from './ResultsTable';
import { ScoreDistribution } from './ScoreDistribution';
import { PageHeader } from '../shared/PageHeader';
import { StepActionBar } from '../shared/StepActionBar';
import { useGrading } from '../../contexts/GradingContext';
import { GradeResult, Submission } from '../../types/grading';
import { exportGradesToExcel } from '../../utils/exportExcel';
import { maxScore, needsReview, totalScore } from '../../utils/grading';

type ExportPhase = 'idle' | 'exporting' | 'error';

export function ExportStep() {
  const { course, assignment, draft, submissions, goTo, markExported, setUi } = useGrading();
  const [phase, setPhase] = useState<ExportPhase>('idle');
  if (!course || !assignment || !draft) return null;

  const criteria = draft.gradedCriteria ?? draft.criteria;
  const max = maxScore(criteria);
  const rows = submissions.
  map((s) => ({ submission: s, result: draft.results[s.id] })).
  filter((x): x is {submission: Submission;result: GradeResult;} => Boolean(x.result));

  const submitted = rows.filter((r) => r.submission.submittedAt);
  const percents = submitted.map((r) => max ? totalScore(r.result.scores) / max * 100 : 0);
  const average = percents.length ? Math.round(percents.reduce((a, b) => a + b, 0) / percents.length) : 0;
  const approved = rows.filter((r) => r.result.approved).length;
  const flagged = rows.filter((r) => !r.result.approved && needsReview(r.result)).length;
  const pending = rows.length - approved;
  const adjusted = rows.filter((r) => r.result.adjusted).length;

  const stats = [
  { label: 'Class average', value: `${average}%`, hint: `${submitted.length} submissions` },
  { label: 'Approved', value: `${approved}/${rows.length}`, hint: pending ? `${pending} pending` : 'All approved' },
  { label: 'Needs review', value: String(flagged), hint: flagged ? 'Flagged by AI' : 'None remaining' },
  { label: 'Adjusted by you', value: String(adjusted), hint: 'Overrode AI scores' }];


  const handleExport = () => {
    setPhase('exporting');
    window.setTimeout(() => {
      try {
        const fileName = exportGradesToExcel({ course, assignment, criteria, submissions, results: draft.results });
        markExported();
        setPhase('idle');
        toast.success('Excel file downloaded', { description: fileName });
      } catch {
        setPhase('error');
        toast.error('Export failed. Please try again.');
      }
    }, 700);
  };

  const exported = Boolean(draft.exportedAt);

  return (
    <div>
      <PageHeader
        eyebrow={`${course.name} · ${assignment.title}`}
        title="Results & export"
        description="A summary of this grading run. Export includes every grade plus a separate sheet of items still needing review." />
      

      <AnimatePresence initial={false}>
        {pending > 0 &&
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden">
          
            <Alert className="mb-6 border-amber-200 bg-amber-50 text-amber-900">
              <AlertTriangle aria-hidden="true" />
              <AlertTitle>{pending} grades aren’t approved yet</AlertTitle>
              <AlertDescription className="text-amber-800">
                <span>They’ll be exported marked as “Pending approval” or “Needs review”.</span>
                <Button
                size="sm"
                variant="outline"
                className="mt-2 bg-background"
                onClick={() => {
                  setUi({ reviewFilter: flagged ? 'flagged' : 'ready', reviewSelectedId: null });
                  goTo('review');
                }}>
                
                  <ArrowLeft aria-hidden="true" />
                  Continue reviewing
                </Button>
              </AlertDescription>
            </Alert>
          </motion.div>
        }
      </AnimatePresence>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s, i) =>
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: i * 0.04 }}>
          
            <Card size="sm" className="h-full">
              <CardContent className="space-y-1">
                <div className="text-xs text-muted-foreground">{s.label}</div>
                <div className="text-2xl font-semibold tabular-nums tracking-tight">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.hint}</div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Card className="order-2 gap-0 overflow-hidden py-0 lg:order-1">
          <div className="border-b px-4 py-3">
            <h2 className="text-sm font-medium">Student results</h2>
          </div>
          <ResultsTable rows={rows} maxPoints={max} />
        </Card>

        <div className="order-1 space-y-6 lg:order-2 lg:sticky lg:top-32 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="size-4 text-muted-foreground" aria-hidden="true" />
                Export to Excel
              </CardTitle>
              <CardDescription>Sheets: Grades (per-criterion scores, status, feedback) and Needs Review.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" size="lg" onClick={handleExport} disabled={phase === 'exporting'}>
                {phase === 'exporting' ?
                <>
                    <Loader2 className="animate-spin" aria-hidden="true" />
                    Preparing file…
                  </> :

                <>
                    <Download aria-hidden="true" />
                    {exported ? 'Download again' : 'Export .xlsx'}
                  </>
                }
              </Button>
              <div aria-live="polite" className="min-h-4">
                <AnimatePresence initial={false} mode="wait">
                  {exported && phase !== 'exporting' &&
                  <motion.p
                    key="ok"
                    initial={{ opacity: 0, y: 2 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 text-xs text-emerald-700">
                    
                      <Check className="size-3.5" aria-hidden="true" />
                      Exported {format(new Date(draft.exportedAt as string), 'MMM d, h:mm a')}
                    </motion.p>
                  }
                  {phase === 'error' &&
                  <motion.p key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-700">
                      Something went wrong creating the file. Try again.
                    </motion.p>
                  }
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Score distribution</CardTitle>
              <CardDescription>Submitted work only</CardDescription>
            </CardHeader>
            <CardContent>
              <ScoreDistribution percents={percents} />
            </CardContent>
          </Card>
        </div>
      </div>

      <StepActionBar summary={exported ? 'Exported. You can keep refining grades and export again.' : `${approved} of ${rows.length} grades approved`}>
        <Button variant="outline" onClick={() => goTo('review')}>
          Review
        </Button>
        <Button variant="secondary" onClick={() => goTo('select')}>
          Grade another
        </Button>
      </StepActionBar>
    </div>);

}