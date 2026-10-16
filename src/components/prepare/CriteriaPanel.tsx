import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, ListChecks, Plus, Sparkles, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/Alert';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { CriterionRow } from './CriterionRow';
import { useGrading } from '../../contexts/GradingContext';
import { Criterion } from '../../types/grading';
import { formatPoints, maxScore, suggestCriteria } from '../../utils/grading';

export function CriteriaPanel() {
  const { assignment, draft, updateDraft } = useGrading();
  const [generating, setGenerating] = useState(false);
  if (!assignment || !draft) return null;

  const total = maxScore(draft.criteria);
  const matches = total === assignment.maxPoints;
  const hasResults = Object.keys(draft.results).length > 0;

  const setCriteria = (criteria: Criterion[]) => updateDraft({ criteria, criteriaConfirmed: false });

  const updateCriterion = (id: string, patch: Partial<Criterion>) =>
  setCriteria(draft.criteria.map((c) => c.id === id ? { ...c, ...patch } : c));

  const addCriterion = () =>
  setCriteria([
  ...draft.criteria,
  { id: `custom-${Date.now()}`, title: '', description: '', points: 1, source: 'custom' }]
  );

  const acceptSuggestions = () =>
  updateDraft({
    criteria: [...draft.criteria, ...draft.suggested.map((c) => ({ ...c }))],
    suggestion: 'accepted',
    criteriaConfirmed: false
  });

  const generateSuggestions = () => {
    setGenerating(true);
    window.setTimeout(() => {
      updateDraft({ suggested: suggestCriteria(assignment.maxPoints, assignment.id), suggestion: 'pending' });
      setGenerating(false);
    }, 900);
  };

  const canGenerate = draft.answerKey.trim().length > 0 && draft.suggestion !== 'pending';

  return (
    <Card className="gap-4">
      <CardHeader className="gap-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="size-4 text-muted-foreground" aria-hidden="true" />
              Grading criteria
            </CardTitle>
            <CardDescription className="mt-1">The AI scores each submission against these.</CardDescription>
          </div>
          <div
            className={cn(
              'shrink-0 rounded-md border px-2 py-1 text-right text-xs tabular-nums transition-colors duration-200',
              draft.criteria.length === 0 ?
              'text-muted-foreground' :
              matches ?
              'border-emerald-200 bg-emerald-50 text-emerald-700' :
              'border-amber-200 bg-amber-50 text-amber-800'
            )}
            aria-live="polite">
            
            <span className="font-semibold">{formatPoints(total)}</span> / {assignment.maxPoints} pts
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {hasResults &&
        <Alert>
            <AlertTriangle aria-hidden="true" />
            <AlertTitle>Already graded</AlertTitle>
            <AlertDescription>Changing criteria will re-run AI grading and clear your approvals.</AlertDescription>
          </Alert>
        }

        <AnimatePresence initial={false}>
          {generating &&
          <motion.div
            key="generating"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden">
            
              <div className="space-y-2 rounded-lg border border-dashed p-3" aria-busy="true">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Sparkles className="size-3.5 animate-pulse" aria-hidden="true" />
                  Reading your answer key…
                </div>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </motion.div>
          }

          {draft.suggestion === 'pending' && draft.suggested.length > 0 && !generating &&
          <motion.div
            key="suggestion"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden">
            
              <div className="rounded-lg border border-dashed bg-muted/40 p-3">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 text-sm font-medium">
                      <Sparkles className="size-3.5" aria-hidden="true" />
                      Suggested from your answer key
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">Review and edit before confirming.</p>
                  </div>
                  <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Dismiss suggestions"
                  onClick={() => updateDraft({ suggestion: 'dismissed' })}>
                  
                    <X aria-hidden="true" />
                  </Button>
                </div>
                <ul className="mb-3 space-y-1">
                  {draft.suggested.map((c) =>
                <li key={c.id} className="flex items-center justify-between gap-2 text-sm">
                      <span className="truncate">{c.title}</span>
                      <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{c.points} pts</span>
                    </li>
                )}
                </ul>
                <Button size="sm" className="w-full" onClick={acceptSuggestions}>
                  Use these criteria
                </Button>
              </div>
            </motion.div>
          }
        </AnimatePresence>

        {draft.criteria.length === 0 && draft.suggestion !== 'pending' && !generating &&
        <div className="rounded-lg border border-dashed p-6 text-center">
            <ListChecks className="mx-auto mb-2 size-5 text-muted-foreground" aria-hidden="true" />
            <div className="text-sm font-medium">No rubric attached</div>
            <p className="mx-auto mt-1 max-w-xs text-xs text-muted-foreground">
              {draft.answerKey.trim() ?
            'Generate criteria from your answer key, or add your own.' :
            'Add an answer key to get AI-suggested criteria, or add your own.'}
            </p>
          </div>
        }

        <ul className="space-y-2">
          <AnimatePresence initial={false} mode="popLayout">
            {draft.criteria.map((c, i) =>
            <CriterionRow
              key={c.id}
              criterion={c}
              index={i}
              onChange={(patch) => updateCriterion(c.id, patch)}
              onRemove={() => setCriteria(draft.criteria.filter((x) => x.id !== c.id))} />

            )}
          </AnimatePresence>
        </ul>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={addCriterion}>
            <Plus aria-hidden="true" />
            Add criterion
          </Button>
          {canGenerate && draft.criteria.length === 0 && !generating &&
          <Button variant="outline" size="sm" onClick={generateSuggestions}>
              <Sparkles aria-hidden="true" />
              Suggest from answer key
            </Button>
          }
        </div>

        {draft.criteria.length > 0 && !matches &&
        <p className="text-xs text-amber-800">
            Criteria total {formatPoints(total)} pts, but the assignment is worth {assignment.maxPoints}. Scores will be exported
            out of {formatPoints(total)}.
          </p>
        }
      </CardContent>
    </Card>);

}