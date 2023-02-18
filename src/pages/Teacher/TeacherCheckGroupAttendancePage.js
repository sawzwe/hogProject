import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
// @mui
import { Container, Typography, Stack } from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
// components
import { useSettingsContext } from '../../components/settings';
// sections
import TeacherCheckAttendance from '../../sections/dashboard/teacher/TeacherCheckAttendance';
import { currentTeacher } from './mockup';

// ----------------------------------------------------------------------

export default function TeacherCheckGroupAttendance() {
    const { themeStretch } = useSettingsContext();
    const navigate = useNavigate();

    const { classId } = useParams();
    const currentClass = currentTeacher.teacherGroupClass.find(eachClass => (eachClass.id === classId));

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
                    <ArrowBackIosNewRoundedIcon sx={{ cursor: 'pointer', mr: 0.5 }} onClick={() => navigate(-1)} />
                    <Typography variant="h6">
                        {`${currentClass.course.course} ${currentClass.course.subject} (${currentClass.course.type.toUpperCase()})`}
                    </Typography>
                </Stack>
                <Typography variant="body2" sx={{ ml: 3.5 }}>
                    {currentClass.section}
                </Typography>
                <TeacherCheckAttendance currentClass={currentClass} />
            </Container>
        </>
    );
}