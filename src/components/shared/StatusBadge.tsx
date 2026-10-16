import React from 'react';
import { Badge } from '../ui/Badge';
import { cn } from '../../utils/cn';
import { StatusTone } from '../../utils/assignmentStatus';

interface StatusBadgeProps {
  tone: StatusTone;
  children: React.ReactNode;
  className?: string;
}

const TONE_CLASSES: Record<StatusTone, string> = {
  neutral: 'border-border bg-muted/60 text-muted-foreground',
  progress: 'border-sky-200 bg-sky-50 text-sky-700',
  attention: 'border-amber-200 bg-amber-50 text-amber-800',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700'
};

const DOT_CLASSES: Record<StatusTone, string> = {
  neutral: 'bg-muted-foreground/50',
  progress: 'bg-sky-500',
  attention: 'bg-amber-500',
  success: 'bg-emerald-500'
};

export function StatusBadge({ tone, children, className }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn('gap-1.5 whitespace-nowrap font-medium', TONE_CLASSES[tone], className)}>
      <span className={cn('size-1.5 rounded-full', DOT_CLASSES[tone])} aria-hidden="true" />
      {children}
    </Badge>);

}