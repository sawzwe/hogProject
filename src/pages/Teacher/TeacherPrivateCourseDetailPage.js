import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
// @mui
import { Container, Typography, Stack } from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
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
                    <ArrowBackIosNewRoundedIcon sx={{ cursor: 'pointer', mr: 0.5 }} onClick={() => navigate(-1)} />
                    <Typography variant="h6">
                        {`${currentCourse.course} ${currentCourse.subject} (${currentCourse.type.toUpperCase()})`}
                    </Typography>
                </Stack>
                <Typography variant="body2" sx={{ml: 3.5}}>
                    {currentCourse.section}
                </Typography>
                <TeacherAllClasses classes={classes} />
            </Container>
        </>
    );
}