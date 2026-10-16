import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AssignmentList } from './AssignmentList';
import { CourseList } from './CourseList';
import { PageHeader } from '../shared/PageHeader';
import { useGrading } from '../../contexts/GradingContext';
import { courses, teacher } from '../../data/courses';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export function SelectStep() {
  const { state, selectCourse, markCoursesLoaded } = useGrading();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const loading = !state.coursesLoaded;

  useEffect(() => {
    if (!loading) return;
    const t = window.setTimeout(markCoursesLoaded, 700);
    return () => window.clearTimeout(t);
  }, [loading, markCoursesLoaded]);

  useEffect(() => {
    if (isDesktop && !state.courseId && !loading) selectCourse(courses[0].id);
  }, [isDesktop, state.courseId, loading, selectCourse]);

  const firstName = teacher.name.split(' ')[0];

  return (
    <div className="pb-10">
      <PageHeader
        eyebrow={`Welcome back, ${firstName}`}
        title="What would you like to grade?"
        description="Choose a course from Google Classroom, then pick an assignment with student work." />
      

      {isDesktop ?
      <div className="grid grid-cols-[320px_minmax(0,1fr)] gap-6">
          <CourseList loading={loading} showChevron={false} />
          <AssignmentList loading={loading} showBack={false} />
        </div> :

      <AnimatePresence mode="wait" initial={false}>
          {state.courseId ?
        <motion.div
          key="assignments"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 16 }}
          transition={{ duration: 0.2 }}>
          
              <AssignmentList loading={loading} showBack />
            </motion.div> :

        <motion.div
          key="courses"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2 }}>
          
              <CourseList loading={loading} showChevron />
            </motion.div>
        }
        </AnimatePresence>
      }
    </div>);

}