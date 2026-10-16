import React from 'react';
import { CheckCircle2, Clock, Flag, PencilLine } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';
import { StudentAvatar } from '../shared/StudentAvatar';
import { GradeResult, Submission } from '../../types/grading';
import { formatPoints, needsReview, totalScore } from '../../utils/grading';

interface ResultsTableProps {
  rows: {submission: Submission;result: GradeResult;}[];
  maxPoints: number;
}

function StatusCell({ result }: {result: GradeResult;}) {
  if (result.approved) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
        <CheckCircle2 className="size-3.5" aria-hidden="true" />
        Approved
      </span>);

  }
  if (needsReview(result)) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-800">
        <Flag className="size-3.5" aria-hidden="true" />
        Needs review
      </span>);

  }
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <Clock className="size-3.5" aria-hidden="true" />
      Pending approval
    </span>);

}

export function ResultsTable({ rows, maxPoints }: ResultsTableProps) {
  return (
    <>
      {/* Tablet & desktop */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead className="text-right">Percent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(({ submission, result }) => {
              const total = totalScore(result.scores);
              const pct = maxPoints ? Math.round(total / maxPoints * 100) : 0;
              return (
                <TableRow key={submission.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <StudentAvatar name={submission.student.name} size="sm" />
                      <span className="font-medium">{submission.student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatPoints(total)}
                    <span className="text-muted-foreground">/{formatPoints(maxPoints)}</span>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{pct}%</TableCell>
                  <TableCell>
                    <StatusCell result={result} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    <span className="flex items-center gap-2">
                      {result.adjusted &&
                      <span className="inline-flex items-center gap-1">
                          <PencilLine className="size-3" aria-hidden="true" />
                          Adjusted
                        </span>
                      }
                      {!submission.submittedAt && 'Missing'}
                      {submission.late && 'Late'}
                    </span>
                  </TableCell>
                </TableRow>);

            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile */}
      <ul className="divide-y md:hidden">
        {rows.map(({ submission, result }) => {
          const total = totalScore(result.scores);
          const pct = maxPoints ? Math.round(total / maxPoints * 100) : 0;
          return (
            <li key={submission.id} className="flex items-center gap-3 px-4 py-3">
              <StudentAvatar name={submission.student.name} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{submission.student.name}</div>
                <StatusCell result={result} />
              </div>
              <div className="text-right">
                <div className="text-sm font-medium tabular-nums">
                  {formatPoints(total)}/{formatPoints(maxPoints)}
                </div>
                <div className="text-xs tabular-nums text-muted-foreground">{pct}%</div>
              </div>
            </li>);

        })}
      </ul>
    </>);

}