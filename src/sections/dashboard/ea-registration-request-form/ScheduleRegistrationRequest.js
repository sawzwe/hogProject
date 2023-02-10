import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import axios from 'axios';
// form
import { useForm, Controller } from 'react-hook-form';
// @mui
import { DatePicker } from '@mui/x-date-pickers';
import { LoadingButton } from '@mui/lab';
import {
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
    DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// utils
import { fDate } from '../../../utils/formatTime'
// components
import { useSnackbar } from '../../../components/snackbar';
import Scrollbar from '../../../components/scrollbar/Scrollbar';
import FormProvider, { RHFSelect } from '../../../components/hook-form';

ScheduleRegistrationRequest.propTypes = {
    request: PropTypes.object,
}

export default function ScheduleRegistrationRequest({ request }) {

    const { enqueueSnackbar } = useSnackbar();

    // Prevent user to submit the form unless all schedules are generated
    const [createdCourses, setCreatedCourses] = useState([]);

    const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

    const [rejectedReasonMessage, setRejectedReasonMessage] = useState('');

    if (!request) {
        return null;
    }

    const {
        regRequestId,
        courseType,
        students,
        courses,
        additionalComment,
        status
    } = request;

    const handleCreateCourse = (createdCourse) => {
        setCreatedCourses([...createdCourses, createdCourse]);
    }

    // submit
    const handleClickSubmitOpen = (event) => {
        event.preventDefault()
        setSubmitDialogOpen(true);
    };

    const handleSubmitClose = () => {
        setSubmitDialogOpen(false);
    };

    const onSubmit = async () => {
        try {
            const completedRequest = {
                regRequestId,
                courseType,
                students,
                courses: createdCourses,
                additionalComment,
                status: 'Pending Payment'
            }
            console.log(completedRequest);
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
        }
    };

    const onReject = async () => {
        try {
            if (rejectedReasonMessage === '') {
                enqueueSnackbar('Please enter a reason for rejection!', { variant: 'error' });
            } else {
                const rejectedRequest = {
                    regRequestId,
                    courseType,
                    students,
                    courses: [],
                    additionalComment,
                    rejectedReason: rejectedReasonMessage
                }
                console.log(rejectedRequest);
            }
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
        }
    };

    const handleClickRejectOpen = () => {
        setRejectDialogOpen(true);
    }

    const handleRejectClose = () => {
        setRejectDialogOpen(false);
        setRejectedReasonMessage('');
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
                <Typography variant="h5">{courseType} Request</Typography>
            </Grid>
            <Grid item xs={12} md={12}>
                <StudentSection courseType={courseType} students={students} />
            </Grid>
            <Grid item xs={12} md={12}>
                <CourseSection courseType={courseType} courses={courses} onCreate={handleCreateCourse} />
            </Grid>

            <Grid item xs={12} md={12}>
                <AdditionalCommentSection message={additionalComment} />
            </Grid>

            <Grid item xs={12} md={12}>
                <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                    <Button variant="contained" color="error" sx={{ height: '3em' }} onClick={handleClickRejectOpen}>
                        Reject
                    </Button>
                    <Button variant="contained" disabled={courses.length !== createdCourses.length} color="primary" sx={{ height: '3em' }} onClick={handleClickSubmitOpen}>
                        Submit
                    </Button>
                </Stack>
            </Grid>

            {/* Submit Dialog */}
            <Dialog
                open={submitDialogOpen}
                onClose={handleSubmitClose}
                maxWidth="sm"
            >
                <DialogTitle>
                    <Stack direction="row" alignItems="center" justifyContent="flex-start">
                        <CheckCircleOutlineIcon fontSize="large" sx={{ mr: 1 }} />
                        <Typography variant="h5">{"Submit the request?"}</Typography>
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Your response will be updated to the system and sent to the student and the teacher.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="inherit" variant="outlined" onClick={handleSubmitClose}>Cancel</Button>
                    <Button variant="contained" onClick={onSubmit} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog
                open={rejectDialogOpen}
                onClose={handleRejectClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Stack direction="row" alignItems="center" justifyContent="flex-start">
                        <CheckCircleOutlineIcon fontSize="large" sx={{ mr: 1 }} />
                        <Typography variant="h5">Reject the request?</Typography>
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <TextField fullWidth name="rejectedReason" label="Reason" multiline rows={3} sx={{ my: 1 }} onChange={(event) => setRejectedReasonMessage(event.target.value)} required />
                </DialogContent>
                <DialogActions>
                    <Button color="inherit" variant="outlined" onClick={handleRejectClose}>Cancel</Button>
                    <Button variant="contained" onClick={onReject} color="error">
                        Reject
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )
}

// ----------------------------------------------------------------------

StudentSection.propTypes = {
    courseType: PropTypes.string,
    students: PropTypes.array,
}

export function StudentSection({ courseType, students }) {

    const studentLimit = (courseType === 'Semi Private') ? 15 : 1;

    return (
        <Card sx={{ p: 3 }}>
            <Grid
                container
                direction="row"
                alignItems="center">
                <Grid item xs={6} md={6}>
                    <Typography variant="h6">{`Student(s) ${students.length} / ${studentLimit.toString()}`}</Typography>
                </Grid>
            </Grid>

            {students.map((student, index) => (
                <Stack key={index} flexDirection="row" alignItems="center" mt={2} >
                    <TextField
                        disabled
                        variant="standard"
                        sx={{ width: 320 }}
                        value={`${student.fName} ${student.lName} (${student.nickname})`}
                    />
                </Stack>
            ))}

        </Card>
    )
}

// ----------------------------------------------------------------------

CourseSection.propTypes = {
    courseType: PropTypes.string,
    courses: PropTypes.array,
    onCreate: PropTypes.func,
}

export function CourseSection({ courseType, courses, onCreate }) {

    // Schedule Dialog
    const [open, setOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState({});
    const [completeCourses, setCompleteCourses] = useState([]);
    const [isView, setIsView] = useState(false)

    const handleOpenDialog = (course) => {
        setSelectedCourse(course);
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setSelectedCourse({})
        setOpen(false);
        setIsView(false);
    }

    const handleCreate = (schedules, selectedTeacher) => {
        const createdCourse = { ...selectedCourse, schedules, selectedTeacher };
        setCompleteCourses([...completeCourses, createdCourse]);
        onCreate(createdCourse);
    };

    const checkAlreadyCreated = (completeCourses, course) =>
        completeCourses.some((eachCourse) => (eachCourse.course === course.course && eachCourse.subject === course.subject && eachCourse.level === course.level));


    useEffect(() => {
        if (!open) {
            setIsView(false);
        }
    }, [open]);

    return (
        <Card sx={{ p: 3 }}>
            <Grid container
                direction="row"
                alignItems="center">
                <Grid item xs={6} md={6}>
                    <Typography variant="h6">{`New Course(s)`}</Typography>
                </Grid>
            </Grid>

            {
                !!Object.keys(selectedCourse).length && (
                    <CreateScheduleDialog
                        open={open}
                        close={handleCloseDialog}
                        courseType={courseType}
                        selectedCourse={selectedCourse}
                        onCreate={handleCreate}
                        isView={isView}
                        completeCourses={completeCourses}
                    />
                )
            }

            {courses.map((course, index) => (
                <Paper key={index} elevation={2} sx={{ mt: 2, p: 3 }}>
                    <Grid container
                        direction="column"
                        spacing={2}
                        justifyContent="space-between"
                        alignItems="flex-start">
                        <Grid container item xs={12} md={12}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{course.course} {course.subject} {course.level} ({courseType.toUpperCase()})</Typography>
                        </Grid>
                    </Grid>

                    <Grid container direction="row" spacing={2} sx={{ mt: 1, mb: 2 }}>
                        <Grid item xs={6} md={3}>
                            <TextField fullWidth disabled label="Start Date" value={course.startDate} />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <TextField fullWidth disabled label="End Date" value={course.endDate} />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <TextField fullWidth disabled label="Total Hours" value={course.totalHours} />
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <TextField fullWidth disabled label="Learning Method" value={course.method} />
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <TextField fullWidth disabled label="Hours/Class" value={course.hoursPerClass} />
                        </Grid>
                    </Grid>
                    <Typography variant="inherit" sx={{ color: 'text.disabled', mt: 2, mb: 2, ml: 0.5 }}>Available Days</Typography>
                    <Grid container direction="row" spacing={2}>
                        {course.availableDays.map((eachDay, index) => (
                            <Grid item xs={6} md={2.4} key={index}>
                                <TextField fullWidth label={eachDay.day} value={`${eachDay.from} - ${eachDay.to}`} disabled />
                            </Grid>
                        ))}
                    </Grid>

                    <Grid container direction="row" sx={{ mt: 2 }} justifyContent="flex-end">
                        {checkAlreadyCreated(completeCourses, course) ? (
                            <Button variant="contained" color="inherit" sx={{ height: '3em' }} onClick={() => {
                                handleOpenDialog(course)
                                setIsView(true)
                            }}>
                                <InfoIcon sx={{ mr: 0.5 }} /> Successfully created
                            </Button>
                        ) : (
                            <Button variant="contained" disabled={checkAlreadyCreated(completeCourses, course)} color="primary" sx={{ height: '3em' }} onClick={() => handleOpenDialog(course)}>
                                Create Class
                            </Button>
                        )}
                    </Grid>

                </Paper>
            ))
            }

        </Card>
    )
}

// ----------------------------------------------------------------------

CreateScheduleDialog.propTypes = {
    courseType: PropTypes.string,
    open: PropTypes.bool,
    close: PropTypes.func,
    selectedCourse: PropTypes.object,
    onCreate: PropTypes.func,
    isView: PropTypes.bool,
    completeCourses: PropTypes.array,
}

export function CreateScheduleDialog({ open, close, courseType, selectedCourse, onCreate, isView, completeCourses }) {

    const TEACHER_OPTIONS = [
        { id: 1, fName: 'John', lName: 'Smith', nickname: 'Tar' },
        { id: 2, fName: 'John', lName: 'Smite', nickname: 'Keen' },
        { id: 3, fName: 'Jane', lName: 'Smoke', nickname: 'Kwan' }
    ]

    const { enqueueSnackbar } = useSnackbar();

    const methods = useForm({
        defaultValues: { selectedTeacher: 1 },
    });

    const {
        watch,
        setValue,
    } = methods;

    const values = watch();
    const { selectedTeacher } = values;

    // Tables ---------------------------------------------------------------------------------
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.divider,
            color: theme.palette.common.black,
            border: `1px solid ${theme.palette.divider}`,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
            border: `1px solid ${theme.palette.divider}`,

        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        // hide last border
        '&:last-child td, &:last-child th': {
            backgroundColor: theme.palette.divider,
            border: `1px solid ${theme.palette.divider}`,
        },
    }));

    function createData(date, time, hoursPerClass, teacher, method, room) {
        return { date, time, hoursPerClass, teacher, method, room };
    }

    const rows = [
        createData(new Date('1-Nov-2022'), '10:00-12:00', '2', { id: 2, fName: 'John', lName: 'Smite', nickname: 'Keen' }, 'Onsite', '-'),
        createData(new Date('3-Nov-2022'), '10:00-12:00', '2', { id: 2, fName: 'John', lName: 'Smite', nickname: 'Keen' }, 'Onsite', '-'),
        createData(new Date('8-Nov-2022'), '10:00-12:00', '2', { id: 2, fName: 'John', lName: 'Smite', nickname: 'Keen' }, 'Onsite', '-'),
        createData(new Date('10-Nov-2022'), '10:00-12:00', '2', { id: 2, fName: 'John', lName: 'Smite', nickname: 'Keen' }, 'Onsite', '-'),
        createData(new Date('15-Nov-2022'), '10:00-12:00', '2', { id: 2, fName: 'John', lName: 'Smite', nickname: 'Keen' }, 'Onsite', '-'),
        createData(new Date('17-Nov-2022'), '10:00-12:00', '2', { id: 2, fName: 'John', lName: 'Smite', nickname: 'Keen' }, 'Onsite', '-'),
        createData(new Date('19-Nov-2022'), '10:00-12:00', '2', { id: 2, fName: 'John', lName: 'Smite', nickname: 'Keen' }, 'Onsite', '-'),
        createData(new Date('21-Nov-2022'), '10:00-12:00', '2', { id: 2, fName: 'John', lName: 'Smite', nickname: 'Keen' }, 'Onsite', '-'),
        createData(new Date('22-Nov-2022'), '10:00-12:00', '2', { id: 2, fName: 'John', lName: 'Smite', nickname: 'Keen' }, 'Onsite', '-'),
        createData(new Date('24-Nov-2022'), '10:00-12:00', '2', { id: 2, fName: 'John', lName: 'Smite', nickname: 'Keen' }, 'Onsite', '-'),
    ];

    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Generate Schedules -------------------------------------------------------------------
    const [schedules, setSchedules] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isGenerated, setIsGenerated] = useState(false)

    // Fetch generated schedules
    const getGeneratedSchedules = async () => {
        try {
            setIsLoading(true); // Set loading before sending API request
            await axios.get('https://api.sampleapis.com/wines/reds')
                .then((res) => console.log(res.data)) // Response received
            setSchedules(rows)
            setIsGenerated(true)
            setIsLoading(false); // Stop loading
        } catch (error) {
            setIsLoading(false); // Stop loading in case of error
            console.error(error);
        }
    };

    const handleGenerate = () => {
        // async/await fetching data
        getGeneratedSchedules()
    }

    // Check if course is already in created Courses --------------------------------------------------
    const checkAlreadyCreated = (completeCourses, course) => (
        completeCourses.some((eachCourse) => (eachCourse.course === course.course && eachCourse.subject === course.subject && eachCourse.level === course.level))
    )

    // If already created, then show the generated schedule
    useEffect(() => {
        if (!!Object.keys(selectedCourse).length && checkAlreadyCreated(completeCourses, selectedCourse)) {
            const targetCourse = completeCourses.find((eachCourse) => (eachCourse.course === selectedCourse.course && eachCourse.subject === selectedCourse.subject && eachCourse.level === selectedCourse.level));
            setSchedules(targetCourse.schedules);
            setValue('selectedTeacher', targetCourse.selectedTeacher);
        }
    }, [selectedCourse])

    // Edit Schedule ---------------------------------------------------------------------------------
    const [selectedSchedule, setSelectedSchedule] = useState({})
    const [openEditSchedule, setOpenEditSchedule] = useState(false);

    const handleOpenEditDialog = (row) => {
        setSelectedSchedule(row);
        setOpenEditSchedule(true);
    }

    const handleCloseEditDialog = () => {
        setSelectedSchedule({});
        setOpenEditSchedule(false);
    }

    const handleEditSchedule = (schedule) => {
        const filteredSchedules = schedules.filter((eachSchedule) => eachSchedule !== selectedSchedule)
        const updatedSchedules = [...filteredSchedules, schedule]
        //  shallow copy the array
        setSchedules(updatedSchedules.sort((schedule1, schedule2) => schedule1.date - schedule2.date));
    }

    let displayAccumulatedHours = 0;

    function accumulatedHours() {
        let HoursCount = 0;
        schedules.forEach((eachSchedule) => {
            HoursCount += parseInt(eachSchedule.hoursPerClass, 10)
        })
        return HoursCount;
    }


    const handleCreate = () => {
        if (parseInt(selectedCourse.totalHours, 10) !== accumulatedHours()) {
            enqueueSnackbar('Total hours are not match!', { variant: 'error' })
        } else {
            onCreate(schedules, selectedTeacher);
            setSchedules([]);
            setIsGenerated(false);
            close();
        }
    }

    return (
        <Dialog fullWidth maxWidth="xl" open={open} onClose={close}
            PaperProps={{
                sx: {
                    '&::-webkit-scrollbar': { display: 'none' }
                }
            }}>

            <Grid container direction="row" sx={{ p: 3, pb: 1 }} spacing={2} >
                <Grid container item xs={12} md={12} justifyContent="space-between">
                    <Typography variant="h6"> Create Class </Typography>
                    <IconButton variant="h6" onClick={close}> <CloseIcon /> </IconButton>
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
                                    value={courseType.toUpperCase()}
                                    label="Course Type"
                                    disabled
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={selectedCourse.course.concat(' ', selectedCourse.subject, ' ', selectedCourse.level)}
                                    label="Course"
                                    disabled
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
                                    value={selectedCourse.method}
                                    label="Learning Method"
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={selectedCourse.totalHours}
                                    label="Total Hours"
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={selectedCourse.hoursPerClass}
                                    label="Hours/Class"
                                    disabled
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
                                    value={selectedCourse.startDate}
                                    label="Start Date"
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={selectedCourse.endDate}
                                    label="End Date"
                                    disabled
                                />
                            </Grid>
                        </Grid>
                    </Stack>

                    <Grid item xs={12} md={12} sx={{ mb: 1 }}>
                        <Typography variant="inherit" sx={{ color: 'text.disabled' }}>Available Days</Typography>
                    </Grid>

                    <Stack direction="row" sx={{ pb: 3 }}>
                        <Grid container direction="row" spacing={2}>
                            {selectedCourse.availableDays.map((eachDay, index) => (
                                <Grid item xs={6} md={3} key={index}>
                                    <TextField fullWidth label={eachDay.day} value={`${eachDay.from} - ${eachDay.to}`} disabled />
                                </Grid>
                            ))}
                        </Grid>
                    </Stack>

                    <Stack direction="row" sx={{ pb: 2 }}>
                        <Grid container direction="row" spacing={2}>
                            {isView ? (
                                <Grid item xs={12} md={12} sx={{ mb: 2 }}>
                                    <TextField
                                        fullWidth
                                        value={`${TEACHER_OPTIONS.find((eachTeacher) => eachTeacher.id === selectedTeacher).nickname} (${TEACHER_OPTIONS.find((eachTeacher) => eachTeacher.id === selectedTeacher).fName} ${TEACHER_OPTIONS.find((eachTeacher) => eachTeacher.id === selectedTeacher).lName})`}
                                        label="Primary Teacher"
                                        SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                                        disabled
                                        required />
                                </Grid>
                            ) : (
                                <>
                                    <Grid item xs={12} md={8}>
                                        <FormProvider methods={methods}>
                                            <RHFSelect
                                                fullWidth
                                                name="selectedTeacher"
                                                label="Primary Teacher"
                                                SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                                                disabled={isView}
                                                required>
                                                {TEACHER_OPTIONS.map((eachTeacher, index) => (
                                                    <MenuItem
                                                        key={index}
                                                        value={eachTeacher.id}
                                                        sx={{
                                                            mx: 1,
                                                            my: 0.5,
                                                            borderRadius: 0.75,
                                                            typography: 'body2',
                                                            textTransform: 'capitalize',
                                                            '&:first-of-type': { mt: 0 },
                                                            '&:last-of-type': { mb: 0 },
                                                        }}
                                                    >
                                                        {`${eachTeacher.nickname.toUpperCase()} (${eachTeacher.fName} ${eachTeacher.lName})`}
                                                    </MenuItem>
                                                ))}
                                            </RHFSelect>
                                        </FormProvider>
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <LoadingButton fullWidth variant="contained" size="large" loading={isLoading} sx={{ height: '56px' }} color="primary" onClick={handleGenerate}>
                                            <Typography variant="button">Generate Schedules</Typography>
                                        </LoadingButton>
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </Stack>
                </Grid>

                <Grid item xs={12} md={7}>
                    <Scrollbar sx={(selectedCourse.availableDays.length > 4 ? { maxHeight: 80 * 6.27 } : { maxHeight: 80 * 5.35 })}>
                        <Typography variant="h6" sx={{ mb: 2 }}> Classes & Schedules </Typography>
                        {!!schedules.length && (
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 700 }}>
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align="center">No.</StyledTableCell>
                                            <StyledTableCell align="center">Day</StyledTableCell>
                                            <StyledTableCell align="center">Date</StyledTableCell>
                                            <StyledTableCell colSpan={2} align="center">Time</StyledTableCell>
                                            <StyledTableCell align="center">Teacher</StyledTableCell>
                                            <StyledTableCell align="center">Method</StyledTableCell>
                                            <StyledTableCell align="center">Room</StyledTableCell>
                                            <StyledTableCell align="center">Hours</StyledTableCell>
                                            <StyledTableCell align="center" />
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {schedules.map((row, index) => {
                                            displayAccumulatedHours += parseInt(row.hoursPerClass, 10);
                                            return (
                                                <StyledTableRow key={index}>
                                                    <StyledTableCell component="th" scope="row" sx={{ width: '5%' }} align="center">
                                                        {(index + 1).toString()}
                                                    </StyledTableCell>
                                                    <StyledTableCell sx={{ width: '5%' }} align="center"> {weekdays[row.date.getDay()].slice(0, 3)} </StyledTableCell>
                                                    <StyledTableCell sx={{ width: '15%' }} align="center">{fDate(row.date)}</StyledTableCell>
                                                    <StyledTableCell sx={{ width: '15%' }} align="center">{row.time}</StyledTableCell>
                                                    <StyledTableCell sx={{ width: '7%' }} align="center">{row.hoursPerClass}</StyledTableCell>
                                                    <StyledTableCell sx={{ width: '12%' }} align="center">{row.teacher.nickname}</StyledTableCell>
                                                    <StyledTableCell sx={{ width: '10%' }} align="center">{row.method}</StyledTableCell>
                                                    <StyledTableCell sx={{ width: '10%' }} align="center">{row.room}</StyledTableCell>
                                                    <StyledTableCell sx={{ width: '10%' }} align="center">{displayAccumulatedHours.toString()}</StyledTableCell>
                                                    <StyledTableCell sx={{ width: '8%', p: 0 }} align="center" > {!isView && (
                                                        <IconButton onClick={() => handleOpenEditDialog(row)}>
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    )} </StyledTableCell>
                                                </StyledTableRow>
                                            )
                                        })}
                                        <StyledTableRow>
                                            <StyledTableCell colSpan={8} align="center">TOTAL</StyledTableCell>
                                            <StyledTableCell align="center">{accumulatedHours()}</StyledTableCell>
                                            <StyledTableCell />
                                        </StyledTableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Scrollbar>
                    <EditScheduleDialog
                        open={openEditSchedule}
                        close={handleCloseEditDialog}
                        schedule={selectedSchedule}
                        onEdit={handleEditSchedule}
                    />
                </Grid>
            </Grid>
            {!isView && (
                <Grid container justifyContent="flex-end" sx={{ p: 3, pt: 0 }}>
                    <Button variant="contained" size="large" disabled={!isGenerated} onClick={handleCreate}>
                        Create
                    </Button>
                </Grid>
            )}
        </Dialog>
    )
}

// ----------------------------------------------------------------------

EditScheduleDialog.propTypes = {
    open: PropTypes.bool,
    close: PropTypes.func,
    schedule: PropTypes.object,
    onEdit: PropTypes.func
}

export function EditScheduleDialog({ open, close, schedule, onEdit }) {

    // fetch all teachers
    const TEACHER_OPTIONS = [
        { id: 1, fName: 'John', lName: 'Smith', nickname: 'Tar' },
        { id: 2, fName: 'John', lName: 'Smite', nickname: 'Keen' },
        { id: 3, fName: 'Jane', lName: 'Smoke', nickname: 'Kwan' }
    ]

    // fetch available time of specific teacher
    const TEACHER_AVAILABLE_TIME_OPTIONS = [
        '10:00-12:00', '13:00-15:00', '16:00-18:00'
    ]

    // don't fetch
    const LEARNING_METHOD_OPTIONS = [
        'Onsite', 'Online'
    ]

    const {
        date,
        time,
        hoursPerClass,
        teacher,
        method,
    } = schedule

    const methods = useForm({
        defaultValues: {
            scheduleDate: date,
            scheduleTeacher: 1,
            teacherAvailableTime: '',
            scheduleMethod: 'Onsite'
        }
    });

    const {
        watch,
        control,
        setValue,
        reset,
    } = methods;

    const values = watch();
    const { scheduleDate, scheduleTeacher, teacherAvailableTime, scheduleMethod } = values;

    useEffect(() => {
        if (Object.keys(schedule).length) {
            setValue('scheduleDate', date);
            setValue('scheduleTeacher', teacher.id);
            setValue('teacherAvailableTime', time);
            setValue('scheduleMethod', method);
        }
    }, [schedule])

    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const handleSaveChange = () => {
        const newSchedule = { day: weekday[new Date(scheduleDate).getDay()].slice(0, 3), date: scheduleDate, hoursPerClass, teacher: TEACHER_OPTIONS.find((eachTeacher) => eachTeacher.id === scheduleTeacher), time: teacherAvailableTime, method: scheduleMethod, room: '-' };
        onEdit(newSchedule);
        handleClose();
    }

    const handleClose = () => {
        close();
        setTimeout(() => {
            reset();
        }, 200);

    }


    return (
        <Dialog fullWidth maxWidth="lg" open={open} onClose={close}>
            <FormProvider methods={methods}>
                <Grid container spacing={1} sx={{ p: 3 }}>
                    <Grid item xs={12} md={12} sx={{ pb: 2 }}>
                        <Stack direction="row">
                            <Typography variant="h6"> Edit Schedule </Typography>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Controller
                            name="scheduleDate"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                                <DatePicker
                                    label="Date"
                                    value={field.value}
                                    onChange={(newValue) => {
                                        field.onChange(newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} fullWidth error={!!error} helperText={error?.message} required />
                                    )}
                                    disableMaskedInput
                                    inputFormat="dd-MMM-yyyy"
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <RHFSelect
                            fullWidth
                            name="scheduleTeacher"
                            label="Teacher"
                            SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                            required>
                            {TEACHER_OPTIONS.map((eachTeacher, index) => (
                                <MenuItem
                                    key={index}
                                    value={eachTeacher.id}
                                    sx={{
                                        mx: 1,
                                        my: 0.5,
                                        borderRadius: 0.75,
                                        typography: 'body2',
                                        textTransform: 'capitalize',
                                        '&:first-of-type': { mt: 0 },
                                        '&:last-of-type': { mb: 0 },
                                    }}
                                >
                                    {`${eachTeacher.nickname.toUpperCase()} (${eachTeacher.fName} ${eachTeacher.lName})`}
                                </MenuItem>
                            ))}
                        </RHFSelect>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <RHFSelect
                            fullWidth
                            name="teacherAvailableTime"
                            label="Available Time"
                            SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                            required>
                            {TEACHER_AVAILABLE_TIME_OPTIONS.map((eachTime, index) => (
                                <MenuItem
                                    key={index}
                                    value={eachTime}
                                    sx={{
                                        mx: 1,
                                        my: 0.5,
                                        borderRadius: 0.75,
                                        typography: 'body2',
                                        textTransform: 'capitalize',
                                        '&:first-of-type': { mt: 0 },
                                        '&:last-of-type': { mb: 0 },
                                    }}
                                >
                                    {eachTime}
                                </MenuItem>
                            ))}
                        </RHFSelect>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <RHFSelect
                            fullWidth
                            name="scheduleMethod"
                            label="Learning Method"
                            SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                            required>
                            {LEARNING_METHOD_OPTIONS.map((eachMethod, index) => (
                                <MenuItem
                                    key={index}
                                    value={eachMethod}
                                    sx={{
                                        mx: 1,
                                        my: 0.5,
                                        borderRadius: 0.75,
                                        typography: 'body2',
                                        textTransform: 'capitalize',
                                        '&:first-of-type': { mt: 0 },
                                        '&:last-of-type': { mb: 0 },
                                    }}
                                >
                                    {eachMethod}
                                </MenuItem>
                            ))}
                        </RHFSelect>
                    </Grid>
                </Grid>

                <Grid container justifyContent="flex-end" sx={{ px: 3, pb: 3 }} spacing={1.5}>
                    <Grid item>
                        <Button variant="outlined" size="medium" color="inherit" onClick={handleClose}>
                            Close
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" size="medium" onClick={handleSaveChange}>
                            Save Change
                        </Button>
                    </Grid>
                </Grid>
            </FormProvider>
        </Dialog>
    )
}

// ----------------------------------------------------------------------

AdditionalCommentSection.propTypes = {
    message: PropTypes.string,
    status: PropTypes.string
}

export function AdditionalCommentSection({ message, status }) {
    return (
        <Card sx={{ p: 3 }}>
            <Typography variant="h5"
                sx={{
                    mb: 2,
                    display: 'block',
                }}>{status !== 'Rejected' ? 'Additional Comment' : 'Rejected Reason'}</Typography>
            <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(1, 1fr)',
                }}
            >
                <TextField disabled value={message} />
            </Box>
        </Card>
    )
}