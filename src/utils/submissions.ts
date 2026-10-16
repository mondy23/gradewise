import { addHours, format, subHours } from 'date-fns';
import { courses } from '../data/courses';
import { students } from '../data/students';
import { Assignment, Submission } from '../types/grading';
import { hashString } from './grading';

const cache = new Map<string, Submission[]>();

export function getSubmissions(assignment: Assignment): Submission[] {
  const cached = cache.get(assignment.id);
  if (cached) return cached;
  const course = courses.find((c) => c.id === assignment.courseId);
  if (!course) return [];
  const due = new Date(assignment.dueDate);
  const list: Submission[] = [];
  for (let i = 0; i < course.studentCount; i++) {
    const student = students[(course.studentOffset + i) % students.length];
    const sample = assignment.samples[i % assignment.samples.length];
    const id = `${assignment.id}-${student.id}`;
    const h = hashString(id);
    const missing = sample.flag === 'missing';
    const late = !missing && h % 6 === 0;
    const submitted = late ? addHours(due, h % 20 + 2) : subHours(due, h % 60 + 1);
    list.push({
      id,
      assignmentId: assignment.id,
      student,
      submittedAt: missing ? null : format(submitted, 'MMM d, h:mm a'),
      late,
      text: sample.text,
      attachment: sample.attachment,
      sample
    });
  }
  list.sort((a, b) => a.student.name.localeCompare(b.student.name));
  cache.set(assignment.id, list);
  return list;
}