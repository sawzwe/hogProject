import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
// @mui
import { Container, Typography } from '@mui/material';
// components
import { useSettingsContext } from '../../components/settings';
// sections
import StudentAllClasses from '../../sections/dashboard/student/StudentAllClasses'

// ----------------------------------------------------------------------

const currentStudent = {
    fName: 'Piyaphon',
    lName: 'Wu',
    privateClass: [
        { id: '0', subject: 'SAT MATH', type: 'Private', date: '13-Mar-2023', from: '10:00', to: '12:00', room: '306', teacher: 'Kiratijuta Bhumichitr' },
        { id: '1', subject: 'SAT MATH', type: 'Private', date: '15-Mar-2023', from: '10:00', to: '12:00', room: '', teacher: 'Kiratijuta Bhumichitr' },
        { id: '2', subject: 'SAT VERBAL', type: 'Private', date: '18-Mar-2023', from: '10:00', to: '12:00', room: '', teacher: 'Nirawit Janturong' }
    ],
    groupClass: [
        { id: '0', subject: 'SAT READING', type: 'Group', date: '13-Mar-2023', from: '14:00', to: '16:00', room: '306', teacher: 'Kiratijuta Bhumichitr' }
    ],
    privateCourse : [
        { id: '0', subject: 'SAT MATH', type: 'Private'},
        { id: '1', subject: 'SAT VERBAL', type: 'Private'},
    ],
    groupCourse: [
        {id: '0', subject: 'SAT READING', type: 'Group'}
    ]
}

export default function StudentGroupCourseDetailPage() {
    const { themeStretch } = useSettingsContext();

    const { id } = useParams();
    const currentCourse = currentStudent.groupCourse.find(course => course.id === id);
    const classes = currentStudent.groupClass.filter(eachClass => (eachClass.subject === currentCourse.subject));

    return (
        <>
            <Helmet>
                <title> Group Course Detail </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Typography variant="h4" gutterBottom>
                    {`${currentCourse.subject} (${currentCourse.type.toUpperCase()})`}
                </Typography>
                <StudentAllClasses classes={classes} />
            </Container>
        </>
    );
}