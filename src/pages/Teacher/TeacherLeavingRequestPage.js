import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography } from '@mui/material';
// components
import { useSettingsContext } from '../../components/settings';
import TeacherNewLeavingRequest from '../../sections/dashboard/teacher/TeacherNewLeavingRequest';

// ----------------------------------------------------------------------

export default function TeacherLeavingRequestPage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
            <Helmet>
                <title> Teacher Leaving </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Typography variant="h4" gutterBottom>
                    Teacher Leaving Page
                </Typography>
                <TeacherNewLeavingRequest />
            </Container>
        </>
    );
}