import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
// @mui
import { Container, Typography, Stack } from '@mui/material';
//
import { Icon } from '@iconify/react';
// components
import { useSettingsContext } from '../../components/settings';
// sections
import StudentMakeupRequest from '../../sections/dashboard/student/StudentMakeupRequest';
import { currentStudent } from './mockup';

// ----------------------------------------------------------------------

export default function StudentMakeupRequestPage() {
    const { themeStretch } = useSettingsContext();
    const navigate = useNavigate();

    const { courseId, classId } = useParams();
    const currentCourse = currentStudent.privateCourse.find(course => course.id === courseId);
    const currentClass = currentStudent.privateClass.find(eachClass => (eachClass.id === classId));

    return (
        <>
            <Helmet>
                <title> Cancel and makeup </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Stack
                    justifyContent="flex-start"
                    alignItems="center"
                    direction="row">
                    <Icon icon="ic:round-chevron-left" width="40" height="40" onClick={() => navigate(-1)} />
                    <Typography variant="h4">
                        Makeup Request
                    </Typography>
                </Stack>
                <StudentMakeupRequest currentCourse={currentCourse} currentClass={currentClass} />
            </Container>
        </>
    );
}