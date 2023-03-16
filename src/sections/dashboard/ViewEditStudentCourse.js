import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { useNavigate } from 'react-router';
import moment from 'moment';
// form
import { useForm, Controller } from 'react-hook-form';
// @mui
import { DatePicker } from '@mui/x-date-pickers';
import { LoadingButton } from '@mui/lab';
import CircularProgress from '@mui/material/CircularProgress';
import {
    Fade,
    TextField,
    Grid,
    Stack,
    Card,
    Box,
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
    InputAdornment
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import EventNoteIcon from '@mui/icons-material/EventNote';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// utils
import { fDate } from '../../utils/formatTime'
// components
import { useSnackbar } from '../../components/snackbar';
import Scrollbar from '../../components/scrollbar/Scrollbar';
import FormProvider, { RHFSelect } from '../../components/hook-form';
//
import { AddClassDialog } from './AddClassDialog';
import { EditClassDialog } from './EditClassDialog';
import { ViewCourseDialog } from './ViewCourseDialog';
import { HOG_API } from '../../config';
import { useAuthContext } from '../../auth/useAuthContext';

// ----------------------------------------------------------------

ViewEditStudentCourse.propTypes = {
    currentStudent: PropTypes.object,
    currentCourses: PropTypes.array
}

export default function ViewEditStudentCourse({ currentStudent, currentCourses }) {

    // console.log(currentStudent);
    // console.log(currentCourses);

    // const mockupCourse = {
    //     course: 'SAT',
    //     subject: 'VERBAL',
    //     level: 'REGULAR',
    //     type: 'Private',
    //     section: 'Hong',
    //     method: 'Onsite',
    //     totalHour: '20',
    //     hourPerClass: '2',
    //     startDate: '01 Mar 2023',
    //     endDate: '31 Mar 2023',
    //     primaryTeacher: 'KWAN',
    //     preferredDay: [
    //         { day: 'Wednesday', fromTime: '10:00', toTime: '12:00' },
    //         { day: 'Friday', fromTime: '10:00', toTime: '12:00' },
    //         { day: 'Friday', fromTime: '10:00', toTime: '12:00' },
    //         { day: 'Friday', fromTime: '10:00', toTime: '12:00' },
    //         { day: 'Friday', fromTime: '10:00', toTime: '12:00' },
    //     ],
    //     schedule: [
    //         { date: '01-Mar-2023', fromTime: '10:00', toTime: '12:00', method: 'Onsite', teacher: 'KWAN' },
    //         { date: '03-Mar-2023', fromTime: '10:00', toTime: '12:00', method: 'Onsite', teacher: 'KWAN' },
    //         { date: '08-Mar-2023', fromTime: '10:00', toTime: '12:00', method: 'Onsite', teacher: 'KWAN' },
    //         { date: '10-Mar-2023', fromTime: '10:00', toTime: '12:00', method: 'Onsite', teacher: 'KWAN' },
    //         { date: '15-Mar-2023', fromTime: '10:00', toTime: '12:00', method: 'Onsite', teacher: 'KWAN' },
    //         { date: '17-Mar-2023', fromTime: '10:00', toTime: '12:00', method: 'Onsite', teacher: 'KWAN' },
    //         { date: '22-Mar-2023', fromTime: '10:00', toTime: '12:00', method: 'Onsite', teacher: 'KWAN' },
    //         { date: '24-Mar-2023', fromTime: '10:00', toTime: '12:00', method: 'Onsite', teacher: 'KWAN' },
    //         { date: '29-Mar-2023', fromTime: '10:00', toTime: '12:00', method: 'Onsite', teacher: 'KWAN' },
    //         { date: '31-Mar-2023', fromTime: '10:00', toTime: '12:00', method: 'Onsite', teacher: 'KWAN' },
    //     ],
    // }

    // const mockupCourse2 = {
    //     course: 'GED',
    //     subject: 'MATH',
    //     level: 'REGULAR',
    //     type: 'Semi Private',
    //     section: 'Haw',
    //     method: 'Onsite',
    //     totalHour: '10',
    //     hourPerClass: '2',
    //     startDate: '07 Mar 2023',
    //     endDate: '28 Mar 2023',
    //     primaryTeacher: 'BOY',
    //     preferredDay: [
    //         { day: 'Tuesday', fromTime: '10:00', toTime: '12:00' },
    //         { day: 'Thursday', fromTime: '10:00', toTime: '12:00' },
    //     ],
    //     schedule: [
    //         { date: '07-Mar-2023', fromTime: '10:00', toTime: '12:00', method: 'Onsite', teacher: 'BOY' },
    //         { date: '14-Mar-2023', fromTime: '10:00', toTime: '12:00', method: 'Online', teacher: 'BOY' },
    //         { date: '21-Mar-2023', fromTime: '10:00', toTime: '12:00', method: 'Online', teacher: 'BOY' },
    //         { date: '28-Mar-2023', fromTime: '10:00', toTime: '12:00', method: 'Onsite', teacher: 'BOY' }
    //     ]
    // }

    const { user } = useAuthContext()

    const {
        role
    } = user;

    const [selectedCourse, setSelectedCourse] = useState({});
    const [selectedSchedules, setSelectedSchedules] = useState([]);
    const [openViewEditSchedule, setOpenViewEditSchedule] = useState(false);
    // const [openViewCourseDialog, setOpenViewCourseDialog] = useState(false);

    const handleSelect = async (course) => {
        const currentCourse = currentCourses.find((eachCourse) => eachCourse.registeredCourses.id === course.id).registeredCourses
        await setSelectedCourse(currentCourse)
        console.log(currentCourse)

        const currentSchedules = currentCourses.find((eachCourse) => eachCourse.registeredCourses.id === course.id).registeredClasses
        console.log(currentSchedules)
        await setSelectedSchedules(currentSchedules)

        setOpenViewEditSchedule(true);
    }

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                    <Typography variant="h6">
                        Registered Course
                    </Typography>
                </Grid>

                <Grid item xs={12} md={12}>
                    <Stack direction="column" spacing={2}>
                        {currentCourses.map((eachCourse) => (
                            <ClassPaper key={eachCourse.registeredCourses.id} _course={eachCourse.registeredCourses} onSelect={handleSelect} role={role} />
                        ))}
                    </Stack>
                </Grid>
            </Grid>
            {/* {
                Object.keys(selectedCourse).length !== 0 && (
                    <ViewCourseDialog
                        open={openViewEditSchedule}
                        onClose={() => setOpenViewEditSchedule(false)}
                        selectedCourse={selectedCourse}
                        role={role}
                    />
                )
            } */}
            {
                Object.keys(selectedCourse).length !== 0 && (
                    <ViewEditScheduleDialog
                        open={openViewEditSchedule}
                        onClose={() => setOpenViewEditSchedule(false)}
                        selectedCourse={selectedCourse}
                        selectedSchedules={selectedSchedules}
                        role={role}
                    />
                )
            }
        </>
    )
}

// ----------------------------------------------------------------

ClassPaper.propTypes = {
    _course: PropTypes.object,
    onSelect: PropTypes.func,
    role: PropTypes.string
}

export function ClassPaper({ _course, onSelect, role }) {

    const {
        course,
        subject,
        level,
        totalHour,
        section
    } = _course;

    return (
        <Paper variant="elevation" elevation={2} sx={{ p: 3 }}>
            <Grid container direction="row" spacing={2}>
                <Grid item xs={12} md={3.5}>
                    <TextField
                        fullWidth
                        disabled
                        variant="outlined"
                        label="Course"
                        defaultValue={`${course} ${subject} ${level}`}
                    />
                </Grid>
                <Grid item xs={12} md={2.875}>
                    <TextField
                        fullWidth
                        disabled
                        variant="outlined"
                        label="Section"
                        defaultValue={section}
                    />
                </Grid>
                <Grid item xs={12} md={2.875}>
                    <TextField
                        fullWidth
                        disabled
                        variant="outlined"
                        label="Total Hours"
                        defaultValue={totalHour}
                    />
                </Grid>
                <Grid item xs={12} md>
                    <Button fullWidth variant="contained" color="inherit" sx={{ height: 56 }} onClick={() => onSelect(_course)}>
                        {role === 'Education Admin' ? (
                            <>
                                <EditIcon sx={{ mr: 1 }} />
                                Edit schedule
                            </>
                        ) : (
                            <>
                                <EventNoteIcon sx={{ mr: 1 }} />
                                schedule
                            </>
                        )
                        }
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    )
}

// // ----------------------------------------------------------------

ViewEditScheduleDialog.propTypes = {
    selectedCourse: PropTypes.object,
    selectedSchedules: PropTypes.array,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    role: PropTypes.string
}

export function ViewEditScheduleDialog({ selectedCourse, selectedSchedules, open, onClose, role }) {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const {
        preferredDay
    } = selectedCourse;

    const [schedules, setSchedules] = useState([]);
    const [selectedClass, setSelectedClass] = useState({})
    const [selectedStudents, setSelectedStudents] = useState([])
    const [openEditClassDialog, setOpenEditClassDialog] = useState(false);

    const handleOpenEditDialog = (row) => {
        console.log(row)
        const formattedRow = {
            date: new Date(row.date),
            fromTime: row.fromTime,
            toTime: row.toTime,
            teacher: { id: '' },
            method: _.capitalize(row.method)
        }

        setSelectedStudents(row.studentPrivateClasses)

        setSelectedClass(formattedRow);
        setOpenEditClassDialog(true);
    }

    const handleCloseEditClassDialog = () => {
        setSelectedClass({});
        setOpenEditClassDialog(false);
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

    useEffect(() => {
        setSchedules(selectedSchedules);
    }, [selectedSchedules])

    // const handleAddClass = (newClass) => {
    //     const newSchedule = [...currentSchedule, newClass];
    //     setCurrentSchedule(newSchedule.sort((class1, class2) => new Date(class1.date).getTime() - new Date(class2.date).getTime()));
    // };

    // const handleEditClass = (classIndex, newClass) => {
    //     const newSchedule = [...currentSchedule];
    //     newSchedule[classIndex] = newClass;
    //     setCurrentSchedule(newSchedule.sort((class1, class2) => new Date(class1.date).getTime() - new Date(class2.date).getTime()));
    // }

    const handleEditClass = (newClass) => {
        const filteredSchedules = schedules.filter((eachSchedule) => eachSchedule !== selectedClass)
        const updatedSchedules = [...filteredSchedules, newClass]
        setSchedules(updatedSchedules.sort((class1, class2) => class1.date - class2.date));
    }

    console.log('schedules', schedules)

    const handleDeleteClass = (deletedClass) => {
        const filteredSchedules = schedules.filter((eachSchedule) => eachSchedule !== deletedClass)
        setSchedules(filteredSchedules.sort((class1, class2) => class1.date - class2.date));
    }

    // const handleDeleteClass = (classIndex) => {
    //     const newSchedule = [...currentSchedule];
    //     newSchedule.splice(classIndex, 1);
    //     setCurrentSchedule(newSchedule.sort((class1, class2) => new Date(class1.date).getTime() - new Date(class2.date).getTime()));
    // }

    // const handleSaveChange = () => {
    //     const totalHour = calculateTotalHour(currentSchedule);
    //     if (totalHour !== parseInt(selectedCourse.totalHour, 10)) {
    //         return enqueueSnackbar(`Total hours is invalid. Must be ${selectedCourse.totalHour} hours`, { variant: 'error' });
    //     }
    //     console.log(currentSchedule);
    //     // If schedule is not changed once saved then we must reload the page
    //     // navigate(0);
    //     onClose();
    //     return enqueueSnackbar('Schedule saved', { variant: 'success' });

    // };

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

            <Grid container direction="row" sx={{ px: 3 }} spacing={2}>
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
                            {/* <Grid item xs={12} md={6}>
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
                            </Grid> */}
                        </Grid>
                    </Stack>

                    <Stack direction="row" sx={{ pb: 2 }}>
                        <Grid container direction="row" spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={selectedCourse.method}
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
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                            <Typography variant="h6">
                                Classes & Schedules
                            </Typography>

                            {/* <Button variant="text" color="primary" onClick={() => setOpenAddClassDialog(true)}>
                                <AddIcon sx={{ mr: 0.5 }} /> Add Class
                            </Button> */}

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
                                            <StyledTableCell align="center" />
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
                                                    <StyledTableCell align="center">{eachClass.method}</StyledTableCell>
                                                    <StyledTableCell sx={{ width: '15%' }} align="center">{eachClass.teacherPrivateClass.nickname}</StyledTableCell>
                                                    <StyledTableCell align="center">{displayAccumulatedHours.toString()}</StyledTableCell>
                                                    {role === 'Education Admin' ? (
                                                        <StyledTableCell align="center">
                                                            <IconButton onClick={() => handleOpenEditDialog(eachClass, index)}>
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                        </StyledTableCell>
                                                    ) : (
                                                        <StyledTableCell align="left" />
                                                    )}
                                                </StyledTableRow>
                                            )
                                        })}
                                        <StyledTableRow>
                                            <StyledTableCell colSpan={7} align="center">TOTAL</StyledTableCell>
                                            <StyledTableCell align="center">{accumulatedHours()}</StyledTableCell>
                                            <StyledTableCell />
                                        </StyledTableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Scrollbar>
                </Grid>
            </Grid>

            {role === 'Education Admin' ? (
                <DialogActions>
                    <Button variant="outlined" color="inherit" onClick={onClose}>Cancel</Button>
                    {/* <Button variant="contained" color="primary" onClick={handleSaveChange}>Save Changes</Button> */}
                </DialogActions>
            ) : (
                <DialogActions>
                    <Button variant="outlined" color="inherit" onClick={onClose}>Close</Button>
                </DialogActions>
            )}

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
                    onDelete={handleDeleteClass}
                />
            )}

        </Dialog>
    )
}