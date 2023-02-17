import PropTypes from 'prop-types';
import React from 'react';
// components
import CourseCard from '../../../components/app-card/CourseCard';

StudentCourse.propTypes = {
    currentStudent: PropTypes.object,
};

export default function StudentCourse({ currentStudent }) {

    const {
        studentPrivateCourse,
        studentGroupCourse
    } = currentStudent;

    return (
        <>
            {studentPrivateCourse.length > 0 && studentPrivateCourse.map((course, index) => <CourseCard key={index} accountRole='student' eachCourse={course} />)}
            {studentGroupCourse.length > 0 && studentGroupCourse.map((course, index) => <CourseCard key={index} accountRole='student' eachCourse={course} />)}
        </>
    )
}

