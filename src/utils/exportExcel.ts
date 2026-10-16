import * as XLSX from 'xlsx';
import { Assignment, Course, Criterion, GradeResult, Submission } from '../types/grading';
import { FLAG_META } from '../data/flags';
import { maxScore, totalScore } from './grading';

interface ExportInput {
  course: Course;
  assignment: Assignment;
  criteria: Criterion[];
  submissions: Submission[];
  results: Record<string, GradeResult>;
}

function statusLabel(r?: GradeResult): string {
  if (!r) return 'Not graded';
  if (r.approved) return 'Teacher approved';
  if (r.status === 'failed') return 'AI failed — needs manual grade';
  if (r.flags.length > 0) return 'Needs review';
  return 'Pending approval';
}

export function exportGradesToExcel({ course, assignment, criteria, submissions, results }: ExportInput): string {
  const max = maxScore(criteria);

  const gradeRows = submissions.map((s) => {
    const r = results[s.id];
    const total = r ? totalScore(r.scores) : 0;
    const row: Record<string, string | number> = {
      Student: s.student.name,
      Email: s.student.email,
      Submitted: s.submittedAt ?? 'Missing',
      Late: s.late ? 'Yes' : 'No'
    };
    criteria.forEach((c) => {
      row[`${c.title} (/${c.points})`] = r?.scores[c.id] ?? 0;
    });
    row[`Total (/${max})`] = total;
    row['Percent'] = max > 0 ? Math.round(total / max * 1000) / 10 : 0;
    row['AI confidence'] = r ? `${Math.round(r.confidence * 100)}%` : '';
    row['Status'] = statusLabel(r);
    row['Teacher adjusted'] = r?.adjusted ? 'Yes' : 'No';
    row['Feedback'] = r?.feedback ?? '';
    return row;
  });

  const reviewRows = submissions.
  filter((s) => {
    const r = results[s.id];
    return r && !r.approved && (r.status === 'failed' || r.flags.length > 0);
  }).
  map((s) => {
    const r = results[s.id];
    return {
      Student: s.student.name,
      Email: s.student.email,
      'AI score': r ? totalScore(r.scores) : 0,
      'Max points': max,
      'AI confidence': r ? `${Math.round(r.confidence * 100)}%` : '',
      Reasons: r ?
      r.status === 'failed' ?
      r.error ?? 'AI grading failed' :
      r.flags.map((f) => FLAG_META[f].label).join('; ') :
      ''
    };
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(gradeRows), 'Grades');
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(reviewRows.length ? reviewRows : [{ Note: 'No submissions require review.' }]),
    'Needs Review'
  );
  const safe = `${course.name} - ${assignment.title}`.replace(/[^a-z0-9 \-]/gi, '').trim();
  const fileName = `${safe} - Grades.xlsx`;
  XLSX.writeFile(wb, fileName);
  return fileName;
}