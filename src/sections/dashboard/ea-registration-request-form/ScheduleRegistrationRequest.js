import PropTypes from 'prop-types';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import axios from 'axios';
// form
import { useForm } from 'react-hook-form';
// @mui
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
    Checkbox,
    FormControlLabel,
    Divider,
    MenuItem,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
// components
import Scrollbar from '../../../components/scrollbar/Scrollbar';
// import {LoadingSection} from '../../../components/loading-screen';
import FormProvider, { RHFSelect } from '../../../components/hook-form';

ScheduleRegistrationRequest.propTypes = {
    request: PropTypes.object,
}

export default function ScheduleRegistrationRequest({ request }) {

    // Prevent user to submit the form unless all schedules are generated
    const [registeredCourse, setRegisteredCourse] = useState(0);

    if (!request) {
        return null;
    }

    const {
        regRequestId,
        courseType,
        students,
        courses,
        attachedPayment,
        additionalComment,
        rejectedReason,
        status
    } = request;

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
                    <Typography variant="h5">{courseType} Request</Typography>
                </Grid>
                <Grid item xs={12} md={12}>
                    <StudentSection courseType={courseType} students={students} />
                </Grid>
                <Grid item xs={12} md={12}>
                    <CourseSection courseType={courseType} courses={courses} studentCount={students.length} />
                </Grid>

                <Grid item xs={12} md={12}>
                    <AdditionalCommentSection message={additionalComment} />
                </Grid>

                <Grid item xs={12} md={12}>
                    <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                        <LoadingButton variant="contained" color="error" sx={{ height: '3em' }}>
                            Reject
                        </LoadingButton>
                        <LoadingButton variant="contained" disabled={courses.length !== registeredCourse} color="primary" sx={{ height: '3em' }}>
                            Submit
                        </LoadingButton>
                    </Stack>
                </Grid>
            </Grid>
        </>
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
    studentCount: PropTypes.number,
}

export function CourseSection({ courseType, courses, studentCount }) {

    // Schedule Dialog for group
    const [open, setOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState({});

    const handleOpenDialog = (course) => {
        setSelectedCourse(course);
        setOpen(true);
    };

    const handleCreate = (schedule) => {
        console.log(schedule);
        console.log('schedule is added');
    };

    return (
        <Card sx={{ p: 3 }}>
            <Grid container
                direction="row"
                alignItems="center">
                <Grid item xs={6} md={6}>
                    <Typography variant="h6">{`New Course(s)`}</Typography>
                </Grid>
            </Grid>

            {courses.map((course, index) => (
                <Paper key={index} elevation={2} sx={{ mt: 2, p: 3 }}>
                    <Grid container
                        direction="column"
                        spacing={2}
                        justifyContent="space-between"
                        alignItems="flex-start">
                        <Grid container item xs={12} md={12}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{course.course} {course.subjects} {course.level} ({courseType.toUpperCase()})</Typography>
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
                                <TextField fullWidth label={eachDay.day} value={`${eachDay.from} - ${eachDay.to} Hrs.`} disabled />
                            </Grid>
                        ))}
                    </Grid>


                    <Grid container direction="row" sx={{ mt: 2 }} justifyContent="flex-end">
                        <LoadingButton variant="contained" color="primary" sx={{ height: '3em' }} onClick={() => handleOpenDialog(course)}>
                            Create Class
                        </LoadingButton>
                    </Grid>

                </Paper>
            ))}
            {!!Object.keys(selectedCourse).length && (
                <CreateScheduleDialog 
                open={open} 
                close={() => setOpen(false)} 
                courseType={courseType} 
                course={selectedCourse} 
                studentCount={studentCount} 
                onCreate={handleCreate}
                />
            )}
        </Card>
    )
}

// ----------------------------------------------------------------------

CreateScheduleDialog.propTypes = {
    courseType: PropTypes.string,
    studentCount: PropTypes.number,
    open: PropTypes.bool,
    close: PropTypes.func,
    course: PropTypes.object,
    onCreate: PropTypes.func
}

export function CreateScheduleDialog({ open, close, courseType, course, studentCount , onCreate }) {

    const TEACHER_OPTIONS = [
        { id: 1, fName: 'John', lName: 'Smith', nickname: 'Tar' },
        { id: 2, fName: 'John', lName: 'Smite', nickname: 'Keen' },
        { id: 3, fName: 'Jane', lName: 'Smoke', nickname: 'Kwan' }
    ]

    const methods = useForm({
        defaultValues: { selectedTeacher: 'Tar', schedules: [] },
    });

    const {
        watch,
        setValue,
    } = methods;

    const values = watch();
    const { selectedTeacher } = values;
    const handleChangeTeacher = (event) => {
        setValue('selectedTeacher', event.target.value);
    }

    // Tables ----------------------------------------------------------
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

    function createData(day, date, time, teacher, method, room, hours) {
        return { day, date, time, teacher, method, room, hours };
    }

    const rows = [
        createData('Tue', '1-Nov-2022', '10:00-12:00', 'KEEN', 'Onsite', '-', '2'),
        createData('Thu', '3-Nov-2022', '10:00-12:00', 'KEEN', 'Onsite', '-', '4'),
        createData('Tue', '8-Nov-2022', '10:00-12:00', 'KEEN', 'Onsite', '-', '6'),
        createData('Thu', '10-Nov-2022', '10:00-12:00', 'KEEN', 'Onsite', '-', '8'),
        createData('Tue', '15-Nov-2022', '10:00-12:00', 'KEEN', 'Onsite', '-', '10'),
    ];

    // Generate Schedules -----------------------------------------------
    const [schedule, setSchedule] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isGenerated, setIsGenerated] = useState(false)

    // Fetch generated schedules
    const getGeneratedSchedules = async () => {
        try {
            setIsLoading(true); // Set loading before sending API request
            await axios.get('https://api.sampleapis.com/wines/reds')
                .then((res) => console.log(res.data)) // Response received
            setSchedule(rows)
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

    const handleCreate = () => {
        onCreate(schedule);
        close();
    }

    return (
        <Dialog fullWidth maxWidth="xl" open={open} onClose={close}
            PaperProps={{
                sx: {
                    '&::-webkit-scrollbar': { display: 'none' }
                }
            }}>
            <Grid container spacing={3} sx={{ py: 3, px: 4 }}>
                <Grid item xs={12} md={12}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6"> Create Class </Typography>
                        <IconButton variant="h6" onClick={close}> <CloseIcon /> </IconButton>
                    </Stack>
                </Grid>

                <Grid container item xs={12} md={5} spacing={2}>
                    <Grid item xs={12} md={12}>
                        <Typography variant="h6"> Course Information </Typography>
                    </Grid>
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
                            value={course.course}
                            label="Course"
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={course.subjects}
                            label="Subject"
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={course.level}
                            label="Level"
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={course.section}
                            label="Section"
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={course.method}
                            label="Learning Method"
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={course.totalHours}
                            label="Total Hours"
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={course.hoursPerClass}
                            label="Hours/Class"
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={course.startDate}
                            label="Start Date"
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={course.endDate}
                            label="End Date"
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Typography variant="inherit" sx={{ color: 'text.disabled' }}>Available Days</Typography>
                    </Grid>
                    {course.availableDays.map((eachDay, index) => (
                        <Grid item xs={6} md={4} key={index}>
                            <TextField fullWidth label={eachDay.day} value={`${eachDay.from} - ${eachDay.to} Hrs.`} disabled />
                        </Grid>
                    ))}

                    <Grid item xs={12} md={12}>
                        <FormProvider methods={methods}>
                            <RHFSelect
                                fullWidth
                                name="selectedTeacher"
                                label="Primary Teacher"
                                SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                                required>
                                {TEACHER_OPTIONS.map((eachTeacher, index) => (
                                    <MenuItem
                                        key={index}
                                        value={eachTeacher.nickname}
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

                    <Grid item xs={12} md={12}>
                        <LoadingButton fullWidth variant="contained" size="large" loading={isLoading} color="primary" sx={{ height: '3em' }} onClick={handleGenerate}>
                            Generate schedules
                        </LoadingButton>
                    </Grid>

                </Grid>

                <Grid item xs={12} md={7}>
                    <Scrollbar sx={{ maxHeight: 80 * 6 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}> Classes & Schedules </Typography>
                        {isGenerated && (
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 700 }}>
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell>Day</StyledTableCell>
                                            <StyledTableCell  align="center">Date</StyledTableCell>
                                            <StyledTableCell colSpan={2}  align="center">Time</StyledTableCell>
                                            <StyledTableCell  align="center">Teacher</StyledTableCell>
                                            <StyledTableCell  align="center">Method</StyledTableCell>
                                            <StyledTableCell  align="center">Room</StyledTableCell>
                                            <StyledTableCell  align="center">Hours</StyledTableCell>
                                            <StyledTableCell  align="center" />
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row) => (
                                            <StyledTableRow key={row.date}>
                                                <StyledTableCell component="th" scope="row" sx={{ width: '5%' }}>
                                                    {row.day}
                                                </StyledTableCell>
                                                <StyledTableCell sx={{ width: '15%' }} align="center">{row.date}</StyledTableCell>
                                                <StyledTableCell sx={{ width: '15%' }} align="center">{row.time}</StyledTableCell>
                                                <StyledTableCell sx={{ width: '10%' }} align="center">{row.hours}</StyledTableCell>
                                                <StyledTableCell sx={{ width: '15%' }} align="center">{row.teacher}</StyledTableCell>
                                                <StyledTableCell sx={{ width: '10%' }} align="center">{row.method}</StyledTableCell>
                                                <StyledTableCell sx={{ width: '10%' }} align="center">{row.room}</StyledTableCell>
                                                <StyledTableCell sx={{ width: '10%' }} align="center">{row.hours}</StyledTableCell>
                                                <StyledTableCell sx={{p: 0, pt: 0.5}} align="center" > <EditIcon fontSize="medium" /> </StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                        <StyledTableRow>
                                            <StyledTableCell colSpan={7} align="center">TOTAL</StyledTableCell>
                                            <StyledTableCell align="center">{course.totalHours}</StyledTableCell>
                                            <StyledTableCell />
                                        </StyledTableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Scrollbar>
                </Grid>
            </Grid>
            <Grid container justifyContent="flex-end" sx={{p: 3}}>
                    <Button variant="contained" size="large" disabled={!isGenerated} onClick={handleCreate}>
                        Create
                    </Button>
                </Grid>
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