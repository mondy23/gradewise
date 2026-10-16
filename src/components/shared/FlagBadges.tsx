import React from 'react';
import { AlertTriangle, FileQuestion, GitBranch, ScanLine, UserX } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { cn } from '../../utils/cn';
import { FLAG_META } from '../../data/flags';
import { FlagReason } from '../../types/grading';

export const FLAG_ICONS: Record<FlagReason, React.ComponentType<{className?: string;}>> = {
  'low-confidence': AlertTriangle,
  incomplete: FileQuestion,
  missing: UserX,
  'off-key': GitBranch,
  unreadable: ScanLine
};

interface FlagBadgesProps {
  flags: FlagReason[];
  max?: number;
  className?: string;
}

export function FlagBadges({ flags, max = 2, className }: FlagBadgesProps) {
  if (flags.length === 0) return null;
  const visible = flags.slice(0, max);
  const extra = flags.length - visible.length;
  return (
    <span className={cn('flex flex-wrap items-center gap-1', className)}>
      {visible.map((f) => {
        const Icon = FLAG_ICONS[f];
        return (
          <Badge
            key={f}
            variant="outline"
            className="gap-1 border-amber-200 bg-amber-50 font-normal text-amber-800">
            
            <Icon className="size-3" aria-hidden="true" />
            {FLAG_META[f].label}
          </Badge>);

      })}
      {extra > 0 &&
      <Badge variant="outline" className="font-normal text-muted-foreground">
          +{extra}
        </Badge>
      }
    </span>);

}