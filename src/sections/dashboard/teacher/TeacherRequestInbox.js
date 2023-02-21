import PropTypes from 'prop-types';
import React from 'react';
// components
import RequestCard from '../../../components/app-card/RequestCard';

TeacherLeave.propTypes = {
    currentTeacherRequest: PropTypes.object,
};

export default function TeacherLeave({ currentTeacherRequest }) {

    const {
        teacherLeaveRequest,
    } = currentTeacherRequest;

    return (
        <>
            {teacherLeaveRequest.length > 0 && teacherLeaveRequest.map((course, index) => <RequestCard key={index} accountRole='teacher' eachCourse={course} />)}
        </>
    )
}

