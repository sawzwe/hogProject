import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
// sections
import StudentRequestInbox from '../../sections/dashboard/student/StudentRequestInbox';
// mock data
import { currentStudent } from './mockup';


// ----------------------------------------------------------------------

export default function StudentCoursePage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
            <Helmet>
                <title> Request Inbox </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Typography variant="h4" gutterBottom>
                    Request Inbox
                </Typography>
                <StudentRequestInbox currentStudentRequest= {currentStudent} />
            </Container>
        </>
    );
}
