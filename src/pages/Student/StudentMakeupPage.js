import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
// @mui
import { Container, Typography, Stack } from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
// components
import { useSettingsContext } from '../../components/settings';
// sections
import StudentMakeup from '../../sections/dashboard/student/StudentMakeup';
import { currentStudent } from './mockup';

// ----------------------------------------------------------------------

export default function StudentMakeupPage() {
    const { themeStretch } = useSettingsContext();
    const navigate = useNavigate();

    const { classId } = useParams();
    const currentClass = currentStudent.studentPrivateClass.find(eachClass => (eachClass.id === classId));

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
                        Cancel and Makeup Class
                    </Typography>
                </Stack>
                <StudentMakeup currentClass={currentClass} />
            </Container>
        </>
    );
}