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
import StudentAllClasses from '../../sections/dashboard/student/StudentAllClasses'
import { currentStudent } from './mockup';

// ----------------------------------------------------------------------

export default function StudentGroupCourseDetailPage() {
    const { themeStretch } = useSettingsContext();
    const navigate = useNavigate();

    const { id } = useParams();
    const currentCourse = currentStudent.groupCourse.find(course => course.id === id);
    const classes = currentStudent.groupClass.filter(eachClass => (eachClass.subject === currentCourse.subject));

    return (
        <>
            <Helmet>
                <title> Group Course Detail </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Stack
                    justifyContent="flex-start"
                    alignItems="center"
                    direction="row"
                    sx={{verticalAlign: 'middle'}}>
                    <Icon icon="ic:round-chevron-left" width="40" height="40" onClick={() => navigate(-1)} />
                    <Typography variant="h4" >
                        {`${currentCourse.subject} (${currentCourse.type.toUpperCase()})`}
                    </Typography>
                </Stack>
                <StudentAllClasses classes={classes} type="Group" />
            </Container>
        </>
    );
}