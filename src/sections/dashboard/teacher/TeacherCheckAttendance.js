import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import _ from 'lodash';
// @mui
import axios from 'axios';
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded';
import { Divider, Typography, Stack, Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Box, Card, CardContent } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// components
import { useSnackbar } from '../../../components/snackbar';
// utils
import { fDate } from '../../../utils/formatTime';
import { useAuthContext } from '../../../auth/useAuthContext';


TeacherCheckAttendance.propTypes = {
    currentClass: PropTypes.object,
    isEdit: PropTypes.bool
};

export default function TeacherCheckAttendance({ currentClass, isEdit }) {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { classId } = useParams();
    const { user } = useAuthContext();
    const teacherId = user.id;
    // console.log(teacherId);

    const {
        students,
        course,
        studentAttendance
    } = currentClass;

    const [attendances, setAttendances] = useState(studentAttendance.length ? studentAttendance : []);

    const handleCheckAttendance = (student, attendanceValue) => {
        if (attendances.some(attendance => attendance.student.id === student.id)) {
            const filteredAttendance = attendances.filter(attendance => attendance.student.id !== student.id);
            setAttendances([...filteredAttendance, { student, value: attendanceValue }]);
        } else {
            setAttendances([...attendances, { student, value: attendanceValue }]);
        }
    };

    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const isValidateAttendance = () => (attendances.length === students.length && !attendances.some(attendance => attendance.value === ''));

    // const handleSubmitAttendance = () => {
    //     if (isValidateAttendance()) {
    //         console.log(attendances)
    //         // navigate(0, { replace: true });
    //         // navigate(`/dashboard/teacher-course/${course.type === 'Group' ? 'group' : 'private'}-course/${course.id}`, { replace: true });
    //         enqueueSnackbar('Successfully submitted', { variant: 'success' });
    //     } else {
    //         enqueueSnackbar('Please check all attendance!', { variant: 'error' });
    //     }
    // };
    const handleSubmitAttendance = async () => {
        if (isValidateAttendance()) {
            const newAttendanceData = attendances.map(({ student, value }) => ({
                data: {
                    id: parseInt(student.apiId, 10),
                    studentId: student.id,
                    attendance: value,
                },
            }));

            // Update the attendance data using Axios PUT request
            await axios
                .all(
                    newAttendanceData.map(({ data }) => {
                        // console.log(data);
                        return axios.put(`${process.env.REACT_APP_HOG_API}/api/Teacher/Student/Attendance/Put`, data)
                            // .then(res => console.log(res))
                    })
                )

                .then(async () => {
                    // console.log('Attendance data updated successfully');

                    // Update the attendance status using Axios PUT request
                    const attendanceStatusData = {
                        id: parseInt(classId, 10),
                        teacherId,
                        workType: 'Normal',
                        status: 'Complete',
                    };
                    console.log(attendanceStatusData)

                    await axios.put(`${process.env.REACT_APP_HOG_API}/api/Teacher/Class/Status/Put`, attendanceStatusData)
                        // .then(() => {
                        //     console.log('Attendance status updated successfully');
                        // })
                        .catch((error) => {
                            console.error('Error updating attendance status', error);
                        });

                    navigate(-1, { replace: true });
                    enqueueSnackbar('Successfully submitted', { variant: 'success' });
                })
                .catch((error) => {
                    console.error('Error updating attendance data', error);
                });
            // navigate(`/dashboard/teacher-course/${course.type === 'Group' ? 'group' : 'private'}-course/${course.id}`, { replace: true });
        } else {
            enqueueSnackbar('Please check all attendance!', { variant: 'error' });
        }
    };


    return (
        <>
            <SelectedClassCard eachClass={currentClass} />
            <Typography variant='h6'>Attendance</Typography>
            <Stack direction="column" spacing={2} sx={{ my: 2 }}>
                {students.map((student, index) =>
                    <AttendanceButtons
                        key={index}
                        student={student}
                        studentAttendance={studentAttendance}
                        readOnly={!isEdit}
                        onCheck={handleCheckAttendance} />
                )}
            </Stack>
            <Stack direction="row" sx={{ mt: 4 }}>
                {isEdit && (
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        color="primary"
                        onClick={() => setOpenConfirmDialog(true)}>
                        {studentAttendance.length ? 'Save Changes' : 'Submit'}
                    </Button>
                )}
                <ConfirmDialog
                    open={openConfirmDialog}
                    onClose={() => setOpenConfirmDialog(false)}
                    onSubmit={handleSubmitAttendance}
                    isEdit={!!studentAttendance.length}
                />
            </Stack>
        </>
    )
}

// ----------------------------------------------------------------

SelectedClassCard.propTypes = {
    eachClass: PropTypes.object,
};

export function SelectedClassCard({ eachClass }) {

    const {
        date,
        classNo,
        fromTime,
        toTime,
        room,
    } = eachClass;

    return (
        <Grid container sx={{ my: 2 }}>
            <Box display="inline-block" sx={{ width: '100%' }}>
                <Card
                    variant='outlined'
                    sx={{ display: 'flex', justifyContent: 'space-between', borderRadius: 1, boxShadow: 1, textDecoration: 'none' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ pr: 0 }}>
                            <Typography variant="body1" component="div">
                                Class {classNo.toString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {fDate(date, 'dd MMMM yyyy')} | {fromTime} - {toTime} {room ? `| R.${room}` : ''}
                            </Typography>
                        </CardContent>
                    </Box>
                </Card>
            </Box>
        </Grid>
    )
}

// ----------------------------------------------------------------

AttendanceButtons.propTypes = {
    student: PropTypes.object,
    studentAttendance: PropTypes.array,
    readOnly: PropTypes.bool,
    onCheck: PropTypes.func
};

export function AttendanceButtons({ student, studentAttendance, readOnly, onCheck }) {

    const defaultValue = (studentAttendance.length && studentAttendance.find(attendance => attendance.student.id === student.id).value);

    const [isActivePresent, setIsActivePresent] = useState(defaultValue === 'Present');
    const [isActiveAbsent, setIsActiveAbsent] = useState(defaultValue === 'Absent');
    const [isActiveLate, setIsActiveLate] = useState(defaultValue === 'Late');

    const [attendanceValue, setAttendanceValue] = useState('');

    const isAlreadyChecked = () => (isActivePresent || isActiveAbsent || isActiveLate);

    const resetAllButtons = () => {
        setIsActivePresent(false);
        setIsActiveAbsent(false);
        setIsActiveLate(false);
    }

    const handleToggleButton = (event, setButton) => {
        if (isAlreadyChecked()) {
            if (event.target.value === attendanceValue) {
                setButton(current => !current);
                setAttendanceValue('');
                onCheck(student, '');
            } else {
                resetAllButtons();
                setButton(current => !current);
                setAttendanceValue(event.target.value);
                onCheck(student, event.target.value);
            }
        } else {
            setButton(current => !current);
            setAttendanceValue(event.target.value);
            onCheck(student, event.target.value);
        }
    };

    const formattedStudentName = student.fullName.split(' ')

    return (
        <>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center">
                <Stack
                    direction="column">
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>{_.capitalize(student.nickname)}</Typography>
                    <Typography variant="body2">{`${_.capitalize(formattedStudentName[0])} ${formattedStudentName[1].charAt(0).toUpperCase()}.`}</Typography>
                </Stack>
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={1.5}>
                    <Button
                        variant={isActivePresent ? 'contained' : 'outlined'}
                        color="primary"
                        value="Present"
                        onClick={(event) => handleToggleButton(event, setIsActivePresent)}
                        disabled={readOnly}
                        sx={{ width: '70px', py: 1, fontSize: '14px' }}>
                        Present
                    </Button>
                    <Button
                        variant={isActiveAbsent ? 'contained' : 'outlined'}
                        color="error"
                        value="Absent"
                        onClick={(event) => handleToggleButton(event, setIsActiveAbsent)}
                        disabled={readOnly}
                        sx={{ width: '70px', py: 1, fontSize: '14px' }}>
                        Absent
                    </Button>
                    <Button
                        variant={isActiveLate ? 'contained' : 'outlined'}
                        color="warning"
                        value="Late"
                        onClick={(event) => handleToggleButton(event, setIsActiveLate)}
                        disabled={readOnly}
                        sx={{ width: '70px', py: 1, fontSize: '14px', color: (isActiveLate ? 'white' : '#FFAB00') }}>
                        Late
                    </Button>
                </Stack>
            </Stack>
            <Divider />
        </>
    )
}

// ----------------------------------------------------------------

ConfirmDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    isEdit: PropTypes.bool
};

export function ConfirmDialog({ open, onClose, onSubmit, isEdit }) {
    // console.log('Edit',isEdit)
    return (
        <Dialog open={open} fullWidth maxWidth="xs">
            <DialogTitle sx={{ mx: 'auto', pb: 0 }}>
                <AssignmentTurnedInRoundedIcon sx={{ fontSize: '100px' }} />
            </DialogTitle>
            <DialogContent>
                <Typography variant="body1" align="center" sx={{ fontWeight: 'bold', fontSize: 'h5.fontSize', mb: 1 }}>
                    {isEdit ? 'Update the attendance?' : 'Submit the attendance?'}
                </Typography>
                <Typography align="center">
                    {isEdit ? 'Once saved, the attendance will be updated to the system' : 'Once submitted, the attendance will be updated to the system'}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button fullWidth variant="outlined" color="inherit" onClick={onClose}>Cancel</Button>
                <LoadingButton fullWidth variant="contained" color="primary" onClick={onSubmit}>{isEdit ? 'Save Changes' : 'Submit'}</LoadingButton>
            </DialogActions>
        </Dialog>
    )
}
