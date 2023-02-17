import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography } from '@mui/material';
// components
import { useSettingsContext } from '../../components/settings';
// sections
import StudentCalendar from '../../sections/dashboard/student/StudentCalendar'
//
import { currentStudent } from './mockup';

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
