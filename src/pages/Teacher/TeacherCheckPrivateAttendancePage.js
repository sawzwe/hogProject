import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// @mui
import { Container, Typography, Stack } from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
// components
import { useSettingsContext } from '../../components/settings';
import { DiscardDialog } from '../../components/discard-dialog/DiscardDialog';
// sections
import TeacherCheckAttendance from '../../sections/dashboard/teacher/TeacherCheckAttendance';
import { currentTeacher } from './mockup';
// utils
import { fDate } from '../../utils/formatTime';

// ----------------------------------------------------------------------

export default function TeacherCheckPrivateAttendance() {
    const { themeStretch } = useSettingsContext();
    const navigate = useNavigate();

    const { classId } = useParams();
    const currentClass = currentTeacher.teacherPrivateClass.find(eachClass => (eachClass.id === classId));

    // Discard Dialog
    const [openDiscardDialog, setOpenDiscardDialog] = useState(false);

    const handleDiscard = () => {
        navigate(-1);
    };

    const assumeCurrentDate = fDate(new Date("2023-03-17"), 'dd MMMM yyyy');
    const classDate = fDate(new Date(currentClass.date), 'dd MMMM yyyy');

    const handleGoBack = () => {
        if (assumeCurrentDate === classDate) {
            setOpenDiscardDialog(true);
        } else {
            navigate(-1);
        }
    }

    return (
        <>
            <Helmet>
                <title> Check Attendance </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Stack
                    justifyContent="flex-start"
                    alignItems="center"
                    direction="row">
                    <ArrowBackIosNewRoundedIcon sx={{ cursor: 'pointer', mr: 0.5 }} onClick={handleGoBack} />
                    <Typography variant="h6">
                        {`${currentClass.course.course} ${currentClass.course.subject} (${currentClass.course.type.toUpperCase()})`}
                    </Typography>
                </Stack>
                <Typography variant="body2" sx={{ ml: 3.5 }}>
                    {currentClass.section}
                </Typography>
                <TeacherCheckAttendance currentClass={currentClass} isEdit={assumeCurrentDate === classDate} />
            </Container>

            <DiscardDialog
                open={openDiscardDialog}
                onClose={() => setOpenDiscardDialog(false)}
                title="Discard Change?"
                content="If you discard, your change will not be saved to the system"
                onDiscard={handleDiscard}
            />
        </>
    );
}