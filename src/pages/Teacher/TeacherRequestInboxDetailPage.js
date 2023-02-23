import { Helmet } from 'react-helmet-async';
// @mui
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Stack, } from '@mui/material';
//
import { Icon } from '@iconify/react';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import TeacherRequestInboxEach from '../../sections/dashboard/teacher/TeacherRequestInboxEach'

// mock data
import { currentTeacher } from './mockup';


// ----------------------------------------------------------------------

export default function TeacherRequestInboxDetailPage() {
    const { themeStretch } = useSettingsContext();
    const { id } = useParams();
    const navigate = useNavigate();

    const currentRequest = currentTeacher.teacherLeaveRequest.find(leaveType => leaveType.id === id);




    return (
        <>
            <>
                <Helmet>
                    <title> Request Inbox </title>
                </Helmet>

                <Container maxWidth={themeStretch ? false : 'xl'}>
                    <Stack
                        justifyContent="flex-start"
                        alignItems="center"
                        direction="row">
                        <Icon icon="ic:round-chevron-left" width="40" height="40" style={{ cursor: 'pointer' }} onClick={() => navigate(-1)} />
                        <Typography variant='h4'>Leave Request</Typography>
                    </Stack>
                    <TeacherRequestInboxEach currentRequest={currentRequest} />
                </Container>
            </>
        </>
    );
}
