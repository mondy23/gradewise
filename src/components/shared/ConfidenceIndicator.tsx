import React from 'react';
import { cn } from '../../utils/cn';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/Tooltip';
import { confidenceLevel } from '../../utils/grading';

interface ConfidenceIndicatorProps {
  confidence: number;
  showLabel?: boolean;
  className?: string;
}

const LEVEL_META = {
  high: { label: 'High', bars: 3, color: 'bg-emerald-500', text: 'text-emerald-700' },
  medium: { label: 'Medium', bars: 2, color: 'bg-amber-500', text: 'text-amber-700' },
  low: { label: 'Low', bars: 1, color: 'bg-red-500', text: 'text-red-700' }
};

export function ConfidenceIndicator({ confidence, showLabel = false, className }: ConfidenceIndicatorProps) {
  const level = confidenceLevel(confidence);
  const meta = LEVEL_META[level];
  const pct = Math.round(confidence * 100);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn('inline-flex items-center gap-1.5 text-xs tabular-nums', className)}
          aria-label={`AI confidence ${pct}%, ${meta.label.toLowerCase()}`}>
          
          <span className="flex items-end gap-0.5" aria-hidden="true">
            {[0, 1, 2].map((i) =>
            <span
              key={i}
              className={cn(
                'w-1 rounded-full transition-colors duration-200',
                i === 0 ? 'h-1.5' : i === 1 ? 'h-2.5' : 'h-3.5',
                i < meta.bars ? meta.color : 'bg-border'
              )} />

            )}
          </span>
          {showLabel ?
          <span className={cn('font-medium', meta.text)}>
              {meta.label} · {pct}%
            </span> :

          <span className="text-muted-foreground">{pct}%</span>
          }
        </span>
      </TooltipTrigger>
      <TooltipContent>AI confidence: {pct}% ({meta.label.toLowerCase()})</TooltipContent>
    </Tooltip>);

}