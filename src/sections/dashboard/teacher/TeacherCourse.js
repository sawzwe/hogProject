import PropTypes from 'prop-types';
import { useState } from 'react';
import { m } from 'framer-motion';
// @mui
import { Container, Typography } from '@mui/material';
// components
import { MotionContainer, varBounce } from '../../../components/animate';
import NotFound from '../../../components/NotFound';
import CourseCard from '../../../components/app-card/CourseCard';
// assets
import { UploadIllustration } from '../../../assets/illustrations';

TeacherCourse.propTypes = {
    currentTeacher: PropTypes.object,
};

export default function TeacherCourse({ currentTeacher }) {
    const [courses, setCourses] = useState(currentTeacher.teacherPrivateCourse.filter((eachCourse) => eachCourse.isActive));
    // console.log('current teacher',currentTeacher)
    const {
        teacherPrivateCourse,
        // teacherGroupCourse
    } = currentTeacher;

    return (
        <>
            {courses.length > 0 ? teacherPrivateCourse.map(
                (course, index) => <CourseCard key={index} accountRole='teacher' eachCourse={course} />
            ) : (
                <Container component={MotionContainer} sx={{ textAlign: 'center', mt: 4 }}>
                    <m.div variants={varBounce().in}>
                        <Typography variant="h3" paragraph>
                            No courses
                        </Typography>
                    </m.div>

                    <m.div variants={varBounce().in}>
                        <Typography sx={{ color: 'text.secondary' }}>Teacher has not been assigned to any courses</Typography>
                    </m.div>

                    <m.div variants={varBounce().in}>
                        <UploadIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
                    </m.div>
                </Container>
            )}
            {/* {teacherGroupCourse.length > 0 && teacherGroupCourse.map((course, index) => <CourseCard key={index} accountRole='teacher' eachCourse={course} />)} */}
        </>
    )
}