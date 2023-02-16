import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography } from '@mui/material';
// components
import { useSettingsContext } from '../../components/settings';
// sections
import TeacherCalendar from '../../sections/dashboard/teacher/TeacherCalendar'
//
import { currentTeacher } from './mockup'

// ----------------------------------------------------------------------

export default function TeacherCalendarPage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
            <Helmet>
                <title> Teacher Calendar </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Typography variant="h4" gutterBottom>
                    Teacher Calendar
                </Typography>
                <TeacherCalendar currentTeacher={currentTeacher} />
            </Container>
        </>
    );
}