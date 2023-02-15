import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
// sections
import StudentCalendar from '../../sections/dashboard/student/StudentCalendar'

// ----------------------------------------------------------------------

const currentStudent = {
    fName: 'Piyaphon',
    lName: 'Wu',
    studyCourses: [
        { id: '0', subject: 'SAT MATH', type: 'Private' },
        { id: '1', subject: 'SAT READING', type: 'Private' },
    ],
    classes: [
        { id: '0', date: '13-Mar-2023', from: '10:00', to: '12:00', studyCourse: { id: '0', subject: 'SAT MATH', type: 'Private' }, room: '306', teacher: 'Kiratijuta Bhumichitr' },
        { id: '1', date: '13-Mar-2023', from: '14:00', to: '16:00', studyCourse: { id: '1', subject: 'SAT READING', type: 'Private' }, room: '306', teacher: 'Kiratijuta Bhumichitr' },
        { id: '2', date: '15-Mar-2023', from: '10:00', to: '12:00', studyCourse: { id: '0', subject: 'SAT MATH', type: 'Private' }, room: '', teacher: 'Kiratijuta Bhumichitr' }
    ],
}

// ----------------------------------------------------------------------


export default function StudentCalendarPage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
            <Helmet>
                <title> Student Calendar </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Typography variant="h4" gutterBottom>
                    Calendar
                </Typography>
                <StudentCalendar currentStudent={currentStudent} />
            </Container>
        </>
    );
}
