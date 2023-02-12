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
    schedules: [
        {date: '10-Feb-2023', from: '10:00', to: '12:00', type: 'Private', subject: 'SAT Math', room: 'R.306', teacher: 'Kiratijuta Bhumichitr'},
        {date: '10-Feb-2023', from: '14:00', to: '6:00', type: 'Private', subject: 'SAT Reading', room: 'R.306', teacher: 'Kiratijuta Bhumichitr'},
        {date: '12-Feb-2023', from: '10:00', to: '12:00', type: 'Private', subject: 'SAT Math', room: '-', teacher: 'Kiratijuta Bhumichitr'}
    ]
}

// ----------------------------------------------------------------------


export default function StudentCalendarPage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
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
        </>
    );
}
