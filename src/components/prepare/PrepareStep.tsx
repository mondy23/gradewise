import React from 'react';
import { ArrowLeft, ArrowRight, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../ui/Button';
import { CriteriaPanel } from './CriteriaPanel';
import { MaterialsPanel } from './MaterialsPanel';
import { PageHeader } from '../shared/PageHeader';
import { StepActionBar } from '../shared/StepActionBar';
import { useGrading } from '../../contexts/GradingContext';

export function PrepareStep() {
  const { course, assignment, draft, submissions, goTo, updateDraft, resetResults } = useGrading();
  if (!course || !assignment || !draft) return null;

  const valid =
  draft.criteria.length > 0 && draft.criteria.every((c) => c.title.trim().length > 0 && c.points > 0);
  const hasResults = Object.keys(draft.results).length > 0;
  const changedSinceGrading =
  hasResults && JSON.stringify(draft.criteria) !== JSON.stringify(draft.gradedCriteria);

  const confirm = () => {
    if (changedSinceGrading) resetResults();
    updateDraft({ criteriaConfirmed: true });
    goTo('grade');
  };

  const turnedIn = submissions.filter((s) => s.submittedAt).length;

  return (
    <div>
      <PageHeader
        eyebrow={`${course.name} · ${course.section}`}
        title={assignment.title}
        description={
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="size-3.5" aria-hidden="true" />
              Due {format(new Date(assignment.dueDate), 'EEE, MMM d')}
            </span>
            <span>{assignment.maxPoints} points</span>
            <span>
              {turnedIn} of {submissions.length} turned in
            </span>
          </span>
        }
        actions={
        <Button variant="ghost" size="sm" onClick={() => goTo('select')}>
            <ArrowLeft aria-hidden="true" />
            Change assignment
          </Button>
        } />
      

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_440px]">
        <MaterialsPanel />
        <div className="lg:sticky lg:top-32 lg:self-start">
          <CriteriaPanel />
        </div>
      </div>

      <StepActionBar
        summary={
        valid ?
        `${draft.criteria.length} criteria ready · AI will grade ${submissions.length} submissions` :
        'Add at least one criterion with a name and points to continue.'
        }>
        
        <Button variant="outline" onClick={() => goTo('select')}>
          Back
        </Button>
        <Button onClick={confirm} disabled={!valid}>
          {changedSinceGrading ? 'Confirm & regrade' : 'Confirm criteria'}
          <ArrowRight aria-hidden="true" />
        </Button>
      </StepActionBar>
    </div>);

}