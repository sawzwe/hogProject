import PropTypes from 'prop-types';
// @mui
import { Divider } from '@mui/material';
// components
import ClassCard from '../../../components/app-card/ClassCard';

TeacherAllClasses.propTypes = {
    classes: PropTypes.array,
};

export default function TeacherAllClasses({ classes }) {
    console.log(classes)

    // Separate Completed class and Incomplete class here
    const completeClass = classes.filter(eachClass => eachClass.attendanceStatus !== 'None');
    const upcommingClass = classes.filter(eachClass => eachClass.attendanceStatus === 'None');

    return (
        <>
            {upcommingClass.length > 0 && upcommingClass.map((eachClass, index) => <ClassCard key={index} accountRole="teacher" eachClass={eachClass} />)}
            {upcommingClass.length > 0 && completeClass.length > 0 && <Divider />}
            {completeClass.length > 0 && completeClass.map((eachClass, index) => <ClassCard key={index} accountRole="teacher" eachClass={eachClass} />)}
        </>
    )
}
