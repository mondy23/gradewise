import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Users } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Skeleton } from '../ui/Skeleton';
import { useGrading } from '../../contexts/GradingContext';
import { assignments } from '../../data/assignments';
import { courses } from '../../data/courses';

interface CourseListProps {
  loading: boolean;
  showChevron: boolean;
}

export function CourseList({ loading, showChevron }: CourseListProps) {
  const { state, selectCourse } = useGrading();

  return (
    <section aria-labelledby="courses-heading" className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 id="courses-heading" className="text-sm font-medium">
          Courses
        </h2>
        {!loading && <span className="text-xs text-muted-foreground">{courses.length} from Classroom</span>}
      </div>

      {loading ?
      <div className="space-y-2" aria-busy="true" aria-label="Loading courses">
          {[0, 1, 2].map((i) =>
        <div key={i} className="flex items-center gap-3 rounded-xl border p-3">
              <Skeleton className="size-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
        )}
        </div> :

      <ul className="space-y-2">
          {courses.map((course, i) => {
          const selected = state.courseId === course.id;
          const count = assignments.filter((a) => a.courseId === course.id).length;
          return (
            <motion.li
              key={course.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.04 }}>
              
                <button
                type="button"
                onClick={() => selectCourse(course.id)}
                aria-pressed={selected}
                className={cn(
                  'relative flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 active:scale-[0.995]',
                  selected ? 'border-foreground/20' : 'hover:bg-muted/50'
                )}>
                
                  {selected &&
                <motion.span
                  layoutId="course-selected"
                  className="absolute inset-0 rounded-xl bg-muted"
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }} />

                }
                  <span className="relative flex size-10 shrink-0 items-center justify-center rounded-lg border bg-background text-sm font-semibold">
                    {course.name.
                  split(' ').
                  map((w) => w[0]).
                  join('').
                  slice(0, 2)}
                  </span>
                  <span className="relative min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{course.name}</span>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      {course.section}
                      <span aria-hidden="true">·</span>
                      <Users className="size-3" aria-hidden="true" />
                      {course.studentCount}
                      <span aria-hidden="true">·</span>
                      {count} assignments
                    </span>
                  </span>
                  {showChevron && <ChevronRight className="relative size-4 text-muted-foreground" aria-hidden="true" />}
                </button>
              </motion.li>);

        })}
        </ul>
      }
    </section>);

}