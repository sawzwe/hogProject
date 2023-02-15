import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
// sections
import StudentCourse from '../../sections/dashboard/student/StudentCourse'

// ----------------------------------------------------------------------

const currentStudent = {
    fName: 'Piyaphon',
    lName: 'Wu',
    privateClass: [
        { id: '0', subject: 'SAT MATH', type: 'Private', date: '13-Mar-2023', from: '10:00', to: '12:00', room: '306', teacher: 'Kiratijuta Bhumichitr' },
        { id: '1', subject: 'SAT MATH', type: 'Private', date: '15-Mar-2023', from: '10:00', to: '12:00', room: '', teacher: 'Kiratijuta Bhumichitr' }
    ],
    groupClass: [
        { id: '0', subject: 'SAT READING', type: 'Group', date: '13-Mar-2023', from: '14:00', to: '16:00', room: '306', teacher: 'Kiratijuta Bhumichitr' }
    ],
    privateCourse : [
        { id: '0', subject: 'SAT MATH', type: 'Private'}
    ],
    groupCourse: [
        {id: '0', subject: 'SAT READING', type: 'Group'}
    ]
}

export default function StudentCoursePage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
            <Helmet>
                <title> Courses </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Typography variant="h4" gutterBottom>
                    Courses
                </Typography>
                <StudentCourse currentStudent={currentStudent} />
            </Container>
        </>
    );
}
