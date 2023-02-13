import PropTypes from 'prop-types';
import React from 'react';
// components
import CourseCard from '../../../components/app-card/CourseCard';

StudentCourse.propTypes = {
    currentStudent: PropTypes.object,
};

export default function StudentCourse({ currentStudent }) {

    const {
        privateCourse,
        groupCourse
    } = currentStudent;

    return (
        <>
            {privateCourse.length > 0 && privateCourse.map((course, index) => <CourseCard key={index} course={course} />)}
            {groupCourse.length > 0 && groupCourse.map((course, index) => <CourseCard key={index} course={course} />)}
        </>
    )
}

