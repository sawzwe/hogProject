import PropTypes from 'prop-types';
import React from 'react';
// components
import RequestCard from '../../../components/app-card/RequestCard';

StudentCourse.propTypes = {
  currentStudentRequest: PropTypes.object,
};

export default function StudentCourse({ currentStudentRequest }) {

    const {
        studentClassRequest,
    } = currentStudentRequest;

    return (
        <>
            {studentClassRequest.length > 0 && studentClassRequest.map((course, index) => <RequestCard key={index} accountRole='student' eachCourse={course} />)}
        </>
    )
}

