import PropTypes from 'prop-types';
import React from 'react';
// components
import ClassCard from '../../../components/app-card/ClassCard';

StudentAllClasses.propTypes = {
    classes: PropTypes.array,
};

export default function StudentAllClasses({ classes }) {

    // Separate Completed class and Incomplete class here

    return (
        <>
            {classes.map((eachClass, index) => <ClassCard key={index} classNo={index + 1} eachClass={eachClass} />)}
        </>
    )
}

