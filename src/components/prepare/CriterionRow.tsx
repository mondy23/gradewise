import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Trash2, UserPen } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Criterion } from '../../types/grading';

interface CriterionRowProps {
  criterion: Criterion;
  index: number;
  onChange: (patch: Partial<Criterion>) => void;
  onRemove: () => void;
}

const SOURCE_LABEL: Record<Criterion['source'], string> = {
  teacher: 'From your rubric',
  ai: 'AI suggested',
  custom: 'Added by you'
};

export const CriterionRow = React.forwardRef<HTMLLIElement, CriterionRowProps>(function CriterionRow(
{ criterion, index, onChange, onRemove },
ref)
{
  const titleInvalid = criterion.title.trim().length === 0;
  const pointsInvalid = !(criterion.points > 0);
  const SourceIcon = criterion.source === 'ai' ? Sparkles : UserPen;

  return (
    <motion.li
      ref={ref}
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.18 }}
      className="rounded-lg border bg-card p-3">
      
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex gap-2">
            <Input
              value={criterion.title}
              onChange={(e) => onChange({ title: e.target.value })}
              aria-label={`Criterion ${index + 1} title`}
              aria-invalid={titleInvalid || undefined}
              placeholder="Criterion name"
              className="font-medium" />
            
            <div className="relative w-24 shrink-0">
              <Input
                type="number"
                inputMode="decimal"
                min={0}
                step={0.5}
                value={Number.isFinite(criterion.points) ? criterion.points : ''}
                onChange={(e) => onChange({ points: e.target.value === '' ? NaN : Number(e.target.value) })}
                aria-label={`Criterion ${index + 1} points`}
                aria-invalid={pointsInvalid || undefined}
                className="pr-9 text-right tabular-nums" />
              
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                pts
              </span>
            </div>
          </div>
          <Textarea
            value={criterion.description}
            onChange={(e) => onChange({ description: e.target.value })}
            aria-label={`Criterion ${index + 1} description`}
            placeholder="What earns full credit?"
            rows={2}
            className="min-h-0 resize-none text-sm" />
          
          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <SourceIcon className="size-3" aria-hidden="true" />
            {SOURCE_LABEL[criterion.source]}
          </span>
        </div>
        <Button variant="ghost" size="icon-sm" onClick={onRemove} aria-label={`Remove ${criterion.title || 'criterion'}`}>
          <Trash2 aria-hidden="true" />
        </Button>
      </div>
    </motion.li>);

});