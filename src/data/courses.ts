import { Course } from '../types/grading';

export const teacher = {
  name: 'Elena Ruiz',
  email: 'elena.ruiz@lincolnhs.edu',
  school: 'Lincoln High School'
};

export const courses: Course[] = [
{ id: 'bio', name: 'AP Biology', section: 'Period 2', room: 'Room 214', studentOffset: 0, studentCount: 14 },
{ id: 'hist', name: 'World History', section: 'Period 4', room: 'Room 108', studentOffset: 5, studentCount: 12 },
{ id: 'alg', name: 'Algebra II', section: 'Period 6', room: 'Room 302', studentOffset: 9, studentCount: 11 }];