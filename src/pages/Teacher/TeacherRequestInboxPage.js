import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography } from '@mui/material';
// components
import { useSettingsContext } from '../../components/settings';
// sections
import TeacherRequestInbox from '../../sections/dashboard/teacher/TeacherRequestInbox';
// mock data
import { currentTeacher } from './mockup';

// ----------------------------------------------------------------------

export default function TeacherRequestInboxPage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
            <>
                <Helmet>
                    <title> Teacher Inbox </title>
                </Helmet>

                <Container maxWidth={themeStretch ? false : 'xl'}>
                    <TeacherRequestInbox currentTeacherRequest={currentTeacher} />
                </Container>
            </>
        </>
    );
}