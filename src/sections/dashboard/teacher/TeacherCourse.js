import PropTypes from 'prop-types';
import React from 'react';
// components
import CourseCard from '../../../components/app-card/CourseCard';

TeacherCourse.propTypes = {
    currentTeacher: PropTypes.object,
};

export default function TeacherCourse({ currentTeacher }) {
    // console.log('current teacher',currentTeacher)
    const {
        teacherPrivateCourse,
        // teacherGroupCourse
    } = currentTeacher;
    return (
        <>
            {teacherPrivateCourse.length > 0 && teacherPrivateCourse.map((course, index) => <CourseCard key={index} accountRole='teacher' eachCourse={course} />)}
            {/* {teacherGroupCourse.length > 0 && teacherGroupCourse.map((course, index) => <CourseCard key={index} accountRole='teacher' eachCourse={course} />)} */}
        </>
    )
}