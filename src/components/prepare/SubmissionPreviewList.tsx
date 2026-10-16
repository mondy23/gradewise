import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Paperclip } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { cn } from '../../utils/cn';
import { StudentAvatar } from '../shared/StudentAvatar';
import { Submission } from '../../types/grading';

export function SubmissionPreviewList({ submissions }: {submissions: Submission[];}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const turnedIn = submissions.filter((s) => s.submittedAt).length;
  const late = submissions.filter((s) => s.late).length;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span>
          <span className="font-medium tabular-nums text-foreground">{turnedIn}</span> turned in
        </span>
        <span>
          <span className="font-medium tabular-nums text-foreground">{submissions.length - turnedIn}</span> missing
        </span>
        <span>
          <span className="font-medium tabular-nums text-foreground">{late}</span> late
        </span>
      </div>
      <ul className="divide-y rounded-lg border">
        {submissions.map((s) => {
          const open = expanded === s.id;
          const missing = !s.submittedAt;
          return (
            <li key={s.id}>
              <button
                type="button"
                disabled={missing}
                onClick={() => setExpanded(open ? null : s.id)}
                aria-expanded={missing ? undefined : open}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors duration-150 hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none disabled:cursor-default disabled:hover:bg-transparent">
                
                <StudentAvatar name={s.student.name} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{s.student.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {missing ? 'Not turned in' : `Turned in ${s.submittedAt}`}
                  </span>
                </span>
                {s.late &&
                <Badge variant="outline" className="border-amber-200 bg-amber-50 font-normal text-amber-800">
                    Late
                  </Badge>
                }
                {missing ?
                <Badge variant="outline" className="font-normal text-muted-foreground">
                    Missing
                  </Badge> :

                <ChevronDown
                  className={cn('size-4 text-muted-foreground transition-transform duration-200', open && 'rotate-180')}
                  aria-hidden="true" />

                }
              </button>
              <AnimatePresence initial={false}>
                {open &&
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden">
                  
                    <div className="space-y-2 px-3 pb-3 pl-[52px]">
                      <p className="whitespace-pre-line rounded-md bg-muted/50 p-3 text-sm leading-relaxed">{s.text}</p>
                      {s.attachment &&
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Paperclip className="size-3" aria-hidden="true" />
                          {s.attachment}
                        </span>
                    }
                    </div>
                  </motion.div>
                }
              </AnimatePresence>
            </li>);

        })}
      </ul>
    </div>);

}