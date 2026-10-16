import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CheckCheck, MousePointerClick } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../ui/Sheet';
import { Tabs, TabsList, TabsTrigger } from '../ui/Tabs';
import { ReviewList } from './ReviewList';
import { SubmissionDetail } from './SubmissionDetail';
import { PageHeader } from '../shared/PageHeader';
import { StepActionBar } from '../shared/StepActionBar';
import { useGrading } from '../../contexts/GradingContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { GradeResult, ReviewFilter, Submission } from '../../types/grading';
import { maxScore, needsReview } from '../../utils/grading';

export function ReviewStep() {
  const { course, assignment, draft, submissions, state, setUi, updateResult, setApproved, goTo, retryFailed } =
  useGrading();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [sheetOpen, setSheetOpen] = useState(false);
  const { reviewFilter: filter, reviewSelectedId: selectedId } = state.ui;

  const all = useMemo(
    () =>
    draft ?
    submissions.
    map((s) => ({ submission: s, result: draft.results[s.id] })).
    filter((x): x is {submission: Submission;result: GradeResult;} => Boolean(x.result)) :
    [],
    [draft, submissions]
  );

  const groups = useMemo(
    () => ({
      flagged: all.filter((x) => needsReview(x.result) && !x.result.approved),
      ready: all.filter((x) => !needsReview(x.result) && !x.result.approved),
      approved: all.filter((x) => x.result.approved),
      all
    }),
    [all]
  );

  const items = groups[filter];

  // Keep a valid selection on desktop.
  useEffect(() => {
    if (!isDesktop) return;
    if (!selectedId || !items.some((x) => x.submission.id === selectedId)) {
      const stillExists = all.some((x) => x.submission.id === selectedId);
      if (!stillExists || filter !== 'all') {
        setUi({ reviewSelectedId: items[0]?.submission.id ?? null });
      }
    }
  }, [isDesktop, items, selectedId, all, filter, setUi]);

  if (!course || !assignment || !draft) return null;

  const criteria = draft.gradedCriteria ?? draft.criteria;
  const max = maxScore(criteria);
  const selected = all.find((x) => x.submission.id === selectedId) ?? null;
  const selectedIndex = items.findIndex((x) => x.submission.id === selectedId);
  const nextItem = items[selectedIndex + 1] ?? (filter !== 'approved' && filter !== 'all' ? items[selectedIndex - 1] : undefined);
  const pendingCount = groups.flagged.length + groups.ready.length;

  const select = (id: string) => {
    setUi({ reviewSelectedId: id });
    if (!isDesktop) setSheetOpen(true);
  };

  const approve = (advance: boolean) => {
    if (!selected) return;
    const next = advance ? nextItem : undefined;
    setApproved([selected.submission.id], true);
    toast.success(`Approved ${selected.submission.student.name}’s grade`, {
      action: { label: 'Undo', onClick: () => setApproved([selected.submission.id], false) }
    });
    if (next) {
      setUi({ reviewSelectedId: next.submission.id });
    } else if (!isDesktop) {
      setSheetOpen(false);
    }
  };

  const approveAllReady = () => {
    const ids = groups.ready.map((x) => x.submission.id);
    setApproved(ids, true);
    toast.success(`Approved ${ids.length} high-confidence grades`, {
      action: { label: 'Undo', onClick: () => setApproved(ids, false) }
    });
  };

  const detail = selected ?
  <SubmissionDetail
    key={selected.submission.id}
    submission={selected.submission}
    result={selected.result}
    criteria={criteria}
    answerKey={draft.answerKey}
    hasNext={Boolean(nextItem)}
    onChange={(patch) => updateResult(selected.submission.id, patch)}
    onApprove={approve}
    onUnapprove={() => setApproved([selected.submission.id], false)}
    onRetry={() => {
      retryFailed();
      goTo('grade');
    }} /> :

  null;

  const tabs: {value: ReviewFilter;label: string;count: number;}[] = [
  { value: 'flagged', label: 'Needs review', count: groups.flagged.length },
  { value: 'ready', label: 'Ready to approve', count: groups.ready.length },
  { value: 'approved', label: 'Approved', count: groups.approved.length },
  { value: 'all', label: 'All', count: all.length }];


  return (
    <div>
      <PageHeader
        eyebrow={`${course.name} · ${assignment.title}`}
        title="Review & approve"
        description="Check flagged submissions first, adjust scores where needed, then approve."
        actions={
        filter === 'ready' && groups.ready.length > 0 ?
        <Button variant="outline" size="sm" onClick={approveAllReady}>
              <CheckCheck aria-hidden="true" />
              Approve all {groups.ready.length}
            </Button> :
        undefined
        } />
      

      <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <Card className="gap-0 overflow-hidden py-0 lg:sticky lg:top-32 lg:max-h-[calc(100vh-12rem)] lg:self-start">
          <Tabs value={filter} onValueChange={(v) => setUi({ reviewFilter: v as ReviewFilter })} className="gap-0">
            <div className="overflow-x-auto border-b px-2 pt-2">
              <TabsList variant="line">
                {tabs.map((t) =>
                <TabsTrigger key={t.value} value={t.value} className="text-xs">
                    {t.label}
                    <span className="ml-1 tabular-nums text-muted-foreground">{t.count}</span>
                  </TabsTrigger>
                )}
              </TabsList>
            </div>
          </Tabs>
          <div className="overflow-y-auto">
            <ReviewList
              items={items}
              selectedId={isDesktop ? selectedId : null}
              maxPoints={max}
              filter={filter}
              onSelect={select} />
            
          </div>
          {filter === 'ready' && groups.ready.length > 0 && !isDesktop &&
          <div className="border-t p-3">
              <Button variant="outline" size="sm" className="w-full" onClick={approveAllReady}>
                <CheckCheck aria-hidden="true" />
                Approve all {groups.ready.length}
              </Button>
            </div>
          }
        </Card>

        {isDesktop &&
        <Card className="min-h-[480px] gap-0 overflow-hidden py-0">
            <AnimatePresence mode="wait" initial={false}>
              {detail ?
            <motion.div
              key={selected?.submission.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
              className="h-full">
              
                  {detail}
                </motion.div> :

            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full min-h-[480px] flex-col items-center justify-center p-8 text-center">
              
                  <MousePointerClick className="mb-3 size-5 text-muted-foreground" aria-hidden="true" />
                  <div className="text-sm font-medium">Select a submission to review</div>
                  <p className="mt-1 text-xs text-muted-foreground">Scores, AI reasoning, and the student’s work appear here.</p>
                </motion.div>
            }
            </AnimatePresence>
          </Card>
        }
      </div>

      {!isDesktop &&
      <Sheet open={sheetOpen && Boolean(selected)} onOpenChange={setSheetOpen}>
          <SheetContent side="right" className="w-full gap-0 overflow-y-auto p-0 sm:max-w-xl">
            <SheetHeader className="sr-only">
              <SheetTitle>{selected?.submission.student.name ?? 'Submission'}</SheetTitle>
              <SheetDescription>Review and approve this grade</SheetDescription>
            </SheetHeader>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
              key={selected?.submission.id ?? 'none'}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.16 }}
              className="min-h-full">
              
                {detail}
              </motion.div>
            </AnimatePresence>
          </SheetContent>
        </Sheet>
      }

      <StepActionBar
        summary={
        pendingCount === 0 ?
        'All grades approved — ready to export.' :
        `${groups.approved.length} of ${all.length} approved · ${groups.flagged.length} flagged remaining`
        }>
        
        <Button variant="outline" onClick={() => goTo('grade')}>
          Grading
        </Button>
        <Button onClick={() => goTo('export')} variant={pendingCount === 0 ? 'default' : 'secondary'}>
          Results & export
          <ArrowRight aria-hidden="true" />
        </Button>
      </StepActionBar>
    </div>);

}