import PropTypes from 'prop-types';
import React from 'react';
// components
import CourseCard from '../../../components/app-card/CourseCard';

StudentCourse.propTypes = {
    currentStudent: PropTypes.object,
};

export default function StudentCourse({ currentStudent }) {

    const {
        studyCourses
    } = currentStudent;

    return (
        studyCourses.map((eachCourse, index) => <CourseCard key={index} eachCourse={eachCourse} />)
    )
}

