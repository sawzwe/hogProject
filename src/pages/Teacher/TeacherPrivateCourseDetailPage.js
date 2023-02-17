import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
// @mui
import { Container, Typography, Stack } from '@mui/material';
//
import { Icon } from '@iconify/react';
// components
import { useSettingsContext } from '../../components/settings';
// sections
import TeacherAllClasses from '../../sections/dashboard/teacher/TeacherAllClasses'
import { currentTeacher } from './mockup';

// ----------------------------------------------------------------------

export default function TeacherPrivateCourseDetailPage() {
    const { themeStretch } = useSettingsContext();
    const navigate = useNavigate();

    const { courseId } = useParams();
    const currentCourse = currentTeacher.teacherPrivateCourse.find(course => course.id === courseId);
    const classes = currentTeacher.teacherPrivateClass.filter(eachClass => (eachClass.course.id === currentCourse.id));

    console.log(classes);

    return (
        <>
            <Helmet>
                <title> Private Course Detail </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Stack
                    justifyContent="flex-start"
                    alignItems="center"
                    direction="row">
                    <Icon icon="ic:round-chevron-left" width="40" height="40" style={{cursor: 'pointer'}} onClick={() => navigate(-1)} />
                    <Typography variant="h6">
                        {`${currentCourse.course} ${currentCourse.subject} (${currentCourse.type.toUpperCase()})`}
                    </Typography>
                </Stack>
                <TeacherAllClasses classes={classes} />
            </Container>
        </>
    );
}