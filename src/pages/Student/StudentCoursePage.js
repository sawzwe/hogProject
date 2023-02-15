import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
// sections
import StudentCourse from '../../sections/dashboard/student/StudentCourse';
import { currentStudent } from './mockup';

// ----------------------------------------------------------------------

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
