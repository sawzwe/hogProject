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

StudentCourse.propTypes = {
    currentStudent: PropTypes.object,
};

export default function StudentCourse({ currentStudent }) {
    const [courses, setCourses] = useState(currentStudent.studentPrivateCourse.filter((eachCourse) => eachCourse.isActive));

    const {
        studentPrivateCourse,
        // studentGroupCourse
    } = currentStudent;

    return (
        <>

            {courses.length > 0 ?
                courses.map((course, index) => <CourseCard key={index} accountRole='student' eachCourse={course} />)
                : (
                    <Container component={MotionContainer} sx={{ textAlign: 'center', mt: 4 }}>
                        <m.div variants={varBounce().in}>
                            <Typography variant="h3" paragraph>
                                No courses
                            </Typography>
                        </m.div>

                        <m.div variants={varBounce().in}>
                            <Typography sx={{ color: 'text.secondary' }}>Student can register a course at House of Griffin</Typography>
                        </m.div>

                        <m.div variants={varBounce().in}>
                            <UploadIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
                        </m.div>
                    </Container>
                )}
            {/* {studentGroupCourse.length > 0 && studentGroupCourse.map((course, index) => <CourseCard key={index} accountRole='student' eachCourse={course} />)} */}
        </>
    )
}

