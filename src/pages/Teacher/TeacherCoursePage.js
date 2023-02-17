import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography } from '@mui/material';
// components
import { useSettingsContext } from '../../components/settings';
// sections
import TeacherCourse from '../../sections/dashboard/teacher/TeacherCourse';
import { currentTeacher } from './mockup';

// ----------------------------------------------------------------------

export default function TeacherCoursePage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
            <Helmet>
                <title> Teacher Course </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Typography variant="h4" gutterBottom>
                    Teacher Courses
                </Typography>
                <TeacherCourse currentTeacher={currentTeacher} />
            </Container>
        </>
    );
}