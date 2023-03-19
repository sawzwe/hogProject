import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { useNavigate } from 'react-router';
import Moment from 'moment';
import { extendMoment } from "moment-range";
// @mui
import { LoadingButton } from '@mui/lab';
import {
    TextField,
    Grid,
    Stack,
    Dialog,
    Paper,
    Typography,
    Button,
    IconButton,
    MenuItem,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    InputAdornment,
    Container,
    Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
// utils
import { fDate } from '../../utils/formatTime'
import { useSnackbar } from '../../components/snackbar';
import Scrollbar from '../../components/scrollbar/Scrollbar';
//
import { AddClassDialog } from './AddClassDialog';
import { EditClassDialog } from './EditClassDialog';
import { HOG_API } from '../../config';

// ----------------------------------------------------------------

ViewEditScheduleDialog.propTypes = {
    selectedCourse: PropTypes.object,
    selectedSchedules: PropTypes.array,
    selectedRequest: PropTypes.object,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    role: PropTypes.string,
    students: PropTypes.array
}

export function ViewEditScheduleDialog({ selectedCourse, selectedSchedules, selectedRequest, open, onClose, role, students }) {
    // console.log(selectedSchedules)
    const { enqueueSnackbar } = useSnackbar();
    const moment = extendMoment(Moment);
    const navigate = useNavigate();

    const {
        courseType
    } = selectedRequest;

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [openAddClassDialog, setOpenAddClassDialog] = useState(false);

    const [schedules, setSchedules] = useState([]);
    const [selectedClass, setSelectedClass] = useState({})
    const [selectedStudents, setSelectedStudents] = useState([])
    const [openEditClassDialog, setOpenEditClassDialog] = useState(false);

    const [deletedClass, setDeletedClass] = useState({});
    const [openDeleteClassDialog, setOpenDeleteClassDialog] = useState(false);

    useEffect(() => {
        setSchedules(selectedSchedules);
    }, [selectedSchedules])

    const handleAddClass = async (addedClass) => {
        try {
            const formattedData = {
                courseId: selectedCourse.id,
                privateClass: {
                    room: "",
                    method: addedClass.method,
                    date: fDate(addedClass.date, 'dd-MMM-yyyy'),
                    fromTime: addedClass.fromTime,
                    toTime: addedClass.toTime,
                    studentPrivateClasses: students.map((student) => ({
                        studentId: student.studentId,
                        attendance: "None"
                    })),
                    teacherPrivateClass: {
                        teacherId: addedClass.teacher.id,
                        workType: addedClass.teacher.workType,
                        status: "Incomplete"
                    }
                }
            }
            console.log(formattedData);

            await axios.post(`${HOG_API}/api/Schedule/Class/Post`, formattedData)
                .then((res) => console.log(res))
                .catch((error) => {
                    throw error;
                })

            // navigate(0);
        } catch (error) {
            console.error(error);
            enqueueSnackbar(error.message, { variant: "error" })
        }

    };

    const handleOpenEditDialog = (row) => {
        const formattedRow = {
            date: new Date(row.date),
            fromTime: row.fromTime,
            toTime: row.toTime,
            teacher: { id: row.teacherPrivateClass.teacherId },
            method: _.capitalize(row.method),
            id: row.id
        }

        setSelectedStudents(row.studentPrivateClasses)
        setSelectedClass(formattedRow);
        setOpenEditClassDialog(true);
    }

    const handleCloseEditClassDialog = () => {
        setSelectedClass({});
        setOpenEditClassDialog(false);
    }

    const handleEditClass = async (newClass) => {
        let hasConflict = false;
        const filteredSchedules = schedules.filter((eachSchedule) => eachSchedule.id !== newClass.id)
        // console.log(filteredSchedules)
        await filteredSchedules.forEach((eachClass) => {

            // Calculate overlapping time
            const timeAStart = moment([eachClass.fromTime.slice(0, 2), eachClass.fromTime.slice(3, 5)], "HH:mm")
            const timeAEnd = moment([eachClass.toTime.slice(0, 2), eachClass.toTime.slice(3, 5)], "HH:mm")

            const timeBStart = moment([newClass.fromTime.slice(0, 2), newClass.fromTime.slice(3, 5)], "HH:mm");
            const timeBEnd = moment([newClass.toTime.slice(0, 2), newClass.toTime.slice(3, 5)], "HH:mm");

            const range1 = moment.range(timeAStart, timeAEnd);
            const range2 = moment.range(timeBStart, timeBEnd);

            if (new Date(eachClass.date).getTime() === newClass.date.getTime() && range1.overlaps(range2)) {
                hasConflict = true;
            }
        })

        if (!hasConflict) {
            // console.log(newClass)
            const previousData = schedules.find((eachClass) => eachClass.id === newClass.id)

            const formattedData = {
                id: newClass.id,
                room: previousData.room,
                method: newClass.method,
                date: fDate(newClass.date, 'dd-MMM-yyyy'),
                fromTime: newClass.fromTime,
                toTime: newClass.toTime,
                studentPrivateClasses: previousData.studentPrivateClasses.map((student) => ({
                    id: student.id,
                    studentId: student.studentId,
                    attendance: student.attendance
                })),
                teacherPrivateClass: {
                    id: previousData.teacherPrivateClass.id,
                    teacherId: newClass.teacher.id,
                    workType: newClass.teacher.workType,
                    status: previousData.teacherPrivateClass.status
                }
            }

            try {
                // console.log(schedules)
                // console.log(formattedData)
                await axios.put(`${HOG_API}/api/Schedule/Put`, formattedData)
                    .then((res) => console.log(res))
                    .catch((error) => {
                        throw error
                    })

                navigate(0)
            } catch (error) {
                console.error(error)
                enqueueSnackbar(error.message, { variant: 'error' })
            }
        } else {
            enqueueSnackbar('Selected time overlaps with existing schedules', { variant: 'error' });
        }
    }


    const handleOpenDeleteClassDialog = (deletedClass) => {
        setDeletedClass(deletedClass);
        setOpenDeleteClassDialog(true);
        // const filteredSchedules = schedules.filter((eachSchedule) => eachSchedule !== deletedClass)
        // setSchedules(filteredSchedules.sort((class1, class2) => class1.date - class2.date));
    }

    const handleDeleteClass = async () => {
        setIsSubmitting(true)
        try {
            await axios.delete(`${HOG_API}/api/Schedule/Class/Delete/${deletedClass.id}`)
                .then((res) => console.log(res))
                .catch((error) => {
                    throw error;
                })
            setIsSubmitting(false)
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' })
            setIsSubmitting(false)
        }
    }

    const handleCloseDeleteDialog = () => {
        setDeletedClass({});
        setOpenDeleteClassDialog(false);
    }

    const calculateTotalHour = (schedule) => {
        let HoursCount = 0;
        schedule.forEach((eachSchedule) => {
            const timeA = moment([eachSchedule.fromTime.slice(0, 2), eachSchedule.fromTime.slice(3, 5)], "HH:mm")
            const timeB = moment([eachSchedule.toTime.slice(0, 2), eachSchedule.toTime.slice(3, 5)], "HH:mm")
            HoursCount += timeB.diff(timeA, 'hours');
        })
        return HoursCount;
    };

    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // Tables ---------------------------------------------------------------------------------
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.divider,
            color: theme.palette.common.black,
            fontSize: '0.7rem',
            border: `1px solid ${theme.palette.divider}`,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: '0.7rem',
            padding: (role === 'Education Admin' ? 5 : 16),
            border: `1px solid ${theme.palette.divider}`,

        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:last-child td, &:last-child th': {
            backgroundColor: theme.palette.divider,
            padding: 16,
            fontWeight: 600,
            border: `1px solid ${theme.palette.divider}`,
        },
    }));

    const customTextFieldStyle = {
        fontSize: '0.9rem'
    }

    let displayAccumulatedHours = 0;

    function accumulatedHours() {
        let HoursCount = 0;
        schedules.forEach((eachSchedule) => {
            const timeA = moment([eachSchedule.fromTime.slice(0, 2), eachSchedule.fromTime.slice(3, 5)], "HH:mm")
            const timeB = moment([eachSchedule.toTime.slice(0, 2), eachSchedule.toTime.slice(3, 5)], "HH:mm")
            HoursCount += timeB.diff(timeA, 'hours');
        })
        return HoursCount;
    }

    // console.log('schedules', schedules);
    // console.log(role)

    return (
        <Dialog fullWidth maxWidth="xl" open={open} onClose={onClose}>

            <Grid container direction="row" sx={{ p: 3, pb: 1 }} spacing={2} >
                <Grid container item xs={12} md={12} justifyContent="space-between" alignItems="center">
                    <Typography variant="h6"> Edit Class </Typography>
                    <IconButton variant="h6" onClick={onClose}> <CloseIcon /> </IconButton>
                </Grid>
            </Grid>

            <Grid container direction="row" sx={{ px: 3, mb: 3 }} spacing={2}>
                <Grid item xs={12} md={5}>
                    <Grid item xs={12} md={12} sx={{ pb: 2 }}>
                        <Typography variant="h6"> Course Information </Typography>
                    </Grid>

                    <Stack direction="row" sx={{ pb: 2 }}>
                        <Grid container direction="row" spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={selectedCourse.course.concat(' ', selectedCourse.subject, ' ', selectedCourse.level)}
                                    label="Course"
                                    disabled
                                    InputProps={{
                                        style: customTextFieldStyle
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={courseType.toUpperCase()}
                                    label="Course Type"
                                    disabled
                                    InputProps={{
                                        style: customTextFieldStyle
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Stack>

                    <Stack direction="row" sx={{ pb: 2 }}>
                        <Grid container direction="row" spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={_.capitalize(selectedCourse.method)}
                                    label="Learning Method"
                                    disabled
                                    inputProps={{
                                        style: { textTransform: "capitalize", fontSize: "0.9rem" }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={selectedCourse.totalHour}
                                    label="Total Hours"
                                    disabled
                                    InputProps={{
                                        style: customTextFieldStyle
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={selectedCourse.hourPerClass}
                                    label="Hours/Class"
                                    disabled
                                    InputProps={{
                                        style: customTextFieldStyle
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Stack>

                    <Stack direction="row" sx={{ pb: 2 }} spacing={2}>
                        <Grid container direction="row" spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={fDate(selectedCourse.fromDate, 'dd-MMM-yyyy')}
                                    label="Start Date"
                                    disabled
                                    InputProps={{
                                        style: customTextFieldStyle
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={fDate(selectedCourse.toDate, 'dd-MMM-yyyy')}
                                    label="End Date"
                                    disabled
                                    InputProps={{
                                        style: customTextFieldStyle
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Stack>
                </Grid>

                <Grid item xs={12} md={7}>
                    <Scrollbar sx={{ maxHeight: '28.1rem', pr: 1.5 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: role === 'Education Admin' ? 1 : 2 }}>
                            <Typography variant="h6">
                                Classes & Schedules
                            </Typography>

                            {role === 'Education Admin' && (
                                <Button variant="text" color="primary" onClick={() => setOpenAddClassDialog(true)}>
                                    <AddIcon sx={{ mr: 0.5 }} /> Add Class
                                </Button>
                            )}

                        </Stack>
                        {schedules.length > 0 && (
                            <TableContainer component={Paper} >
                                <Table sx={{ width: '100%' }}>
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align="center">No.</StyledTableCell>
                                            <StyledTableCell align="center">Day</StyledTableCell>
                                            <StyledTableCell align="center">Date</StyledTableCell>
                                            <StyledTableCell colSpan={2} align="center">Time</StyledTableCell>
                                            <StyledTableCell align="center">Method</StyledTableCell>
                                            <StyledTableCell align="center">Teacher</StyledTableCell>
                                            <StyledTableCell align="center">Hours</StyledTableCell>
                                            {role === 'Education Admin' && (
                                                <StyledTableCell align="center" />
                                            )}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {schedules.map((eachClass, index) => {
                                            const timeA = moment([eachClass.fromTime.slice(0, 2), eachClass.fromTime.slice(3, 5)], "HH:mm")
                                            const timeB = moment([eachClass.toTime.slice(0, 2), eachClass.toTime.slice(3, 5)], "HH:mm")
                                            const hourPerClass = timeB.diff(timeA, 'hours')
                                            displayAccumulatedHours += hourPerClass;
                                            const classDate = new Date(eachClass.date);
                                            return (
                                                <StyledTableRow key={index}>
                                                    <StyledTableCell component="th" scope="row" align="center">
                                                        {(index + 1).toString()}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center"> {weekday[classDate.getDay()].slice(0, 3)} </StyledTableCell>
                                                    <StyledTableCell align="center">{fDate(classDate, 'dd-MMM-yyyy')}</StyledTableCell>
                                                    <StyledTableCell align="center">{eachClass.fromTime} - {eachClass.toTime}</StyledTableCell>
                                                    <StyledTableCell sx={{ width: '8%' }} align="center">{hourPerClass.toString()}</StyledTableCell>
                                                    <StyledTableCell align="center">{_.capitalize(eachClass.method)}</StyledTableCell>
                                                    <StyledTableCell sx={{ width: '15%' }} align="center">{eachClass.teacherPrivateClass.nickname} {!!eachClass.teacherPrivateClass?.workType ? `(${eachClass.teacherPrivateClass.workType})` : ''}</StyledTableCell>
                                                    <StyledTableCell align="center">{displayAccumulatedHours.toString()}</StyledTableCell>
                                                    {role === 'Education Admin' && (
                                                        <StyledTableCell align="center">
                                                            <IconButton onClick={() => handleOpenEditDialog(eachClass, index)}>
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                        </StyledTableCell>
                                                    )}
                                                </StyledTableRow>
                                            )
                                        })}
                                        <StyledTableRow>
                                            <StyledTableCell colSpan={7} align="center">TOTAL</StyledTableCell>
                                            <StyledTableCell align="center">{accumulatedHours()}</StyledTableCell>
                                            {role === 'Education Admin' && (
                                                <StyledTableCell align="center" />
                                            )}
                                        </StyledTableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Scrollbar>
                </Grid>
            </Grid>

            {/* <AddClassDialog
                open={openAddClassDialog}
                onClose={() => setOpenAddClassDialog(false)}
                onAdd={onAdd}
            /> */}

            {Object.keys(selectedClass).length > 0 && (
                <EditClassDialog
                    open={openEditClassDialog}
                    close={handleCloseEditClassDialog}
                    schedule={selectedClass}
                    students={selectedStudents}
                    hourPerClass={selectedCourse.hourPerClass}
                    onEdit={handleEditClass}
                    onDelete={handleOpenDeleteClassDialog}
                    courseCustom
                />
            )}

            <AddClassDialog
                open={openAddClassDialog}
                onClose={() => setOpenAddClassDialog(false)}
                students={selectedStudents}
                hourPerClass={selectedCourse.hourPerClass}
                onAdd={handleAddClass}
            />

            {Object.keys(deletedClass).length > 0 && (
                <Dialog open={openDeleteClassDialog} onClose={handleCloseDeleteDialog}>
                    <DialogTitle>
                        Delete Class?
                    </DialogTitle>
                    <DialogContent>
                        {`Once deleted, class on ${fDate(deletedClass.date, 'dd-MMM-yyyy')} (${deletedClass.fromTime} - ${deletedClass.toTime}) will be removed from the system.`}
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" color="inherit" onClick={handleCloseDeleteDialog}>Cancel</Button>
                        <LoadingButton loading={isSubmitting} variant="contained" color="error" onClick={handleDeleteClass}>
                            Delete
                        </LoadingButton>
                    </DialogActions>
                </Dialog>
            )}

        </Dialog>
    )
}