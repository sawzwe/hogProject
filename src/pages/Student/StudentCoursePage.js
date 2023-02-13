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
    schedules: [
        {scheduleId: '0', date: '13-Mar-2023', from: '10:00', to: '12:00', type: 'Private', subject: 'SAT MATH', room: '306', teacher: 'Kiratijuta Bhumichitr'},
        {scheduleId: '1', date: '13-Mar-2023', from: '14:00', to: '16:00', type: 'Private', subject: 'SAT READING', room: '306', teacher: 'Kiratijuta Bhumichitr'},
        {scheduleId: '2', date: '15-Mar-2023', from: '10:00', to: '12:00', type: 'Private', subject: 'SAT MATH', room: '', teacher: 'Kiratijuta Bhumichitr'}
    ],
    studyCourses: [
        {studyCourseId: '0', subject: 'SAT MATH', type: 'Private'},
        {studyCourseId: '1', subject: 'SAT READING', type: 'Private'},
    ]
}

export default function StudentCoursePage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
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
        </>
    );
}
