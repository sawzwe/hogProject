import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import moment from 'moment';
// firebase
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll, getMetadata } from "firebase/storage"
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers';
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
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    FormGroup,
    DialogActions,
    DialogTitle,
    DialogContent
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
// components
import { useSnackbar } from '../../../components/snackbar';
import Scrollbar from '../../../components/scrollbar/Scrollbar';
import FormProvider, { RHFUploadPayment, RHFRadioGroup, RHFTextField } from '../../../components/hook-form';
import FileThumbnail from '../../../components/file-thumbnail';
import LoadingScreen from '../../../components/loading-screen/LoadingScreen';
//
import ViewCourseCard from '../ep-registration-request-form/ViewCourseCard';
//
import { fDate } from '../../../utils/formatTime';
import { HOG_API, FIREBASE_API } from '../../../config';
import { useAuthContext } from '../../../auth/useAuthContext';

// ----------------------------------------------------------------------

CompleteRegistrationRequest.propTypes = {
    currentRequest: PropTypes.object
};

// ----------------------------------------------------------------------

export default function CompleteRegistrationRequest({ currentRequest }) {
    const dataFetchedRef = useRef(false);
    const [selectedCourse, setSelectedCourse] = useState({});
    const [openCourseDialog, setOpenCourseDialog] = useState(false);
    const [schedules, setSchedules] = useState([]);

    const {
        request,
        information,
        students
    } = currentRequest;

    const handleOpenCourseDialog = async (courseIndex) => {
        await setSelectedCourse(information[courseIndex]);
        setOpenCourseDialog(true);
    }

    const handleCloseEditCourseDialog = async () => {
        await setSelectedCourse({});
        setOpenCourseDialog(false);
    }

    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;
        if (request.eaStatus === 'Complete' && request.status !== 'Reject') {
            axios.get(`${HOG_API}/api/Schedule/Get/${request.id}`)
                .then((res) => setSchedules(res.data.data))
                .catch((error) => console.error(error))
        }
    }, [])

    // Complete Registration (has schedules)
    if (request.eaStatus === 'Complete' && request.status !== 'Reject') {
        return <CompleteForm
            request={request}
            students={students}
            registeredCourses={information}
            schedules={schedules}
            hasSchedule={!!schedules.length}
        />
    }

    // Reject from other roles (has schedules)
    if (request.eaStatus === 'Complete' && request.status === 'Reject') {
        return <OtherRejectForm
            request={request}
            students={students}
            registeredCourses={information}
            schedules={schedules}
            hasSchedule={!!schedules.length}
        />
    }

    // Reject from EA himself
    if (request.status === 'Reject') {
        return <EARejectForm
            request={request}
            students={students}
            registeredCourses={information}
            hasSchedule={!!schedules.length}
        />
    }
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
                        value={`${student.fullName} (${student.nickname})`}
                    />
                </Stack>
            ))}

        </Card>
    )
}

// ----------------------------------------------------------------------

CourseSection.propTypes = {
    courses: PropTypes.array,
    onView: PropTypes.func,
    schedules: PropTypes.array,
    hasSchedule: PropTypes.bool,
}

export function CourseSection({ courses, onView, schedules, hasSchedule }) {

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
                <ViewCourseCard key={index} courseIndex={index} courseInfo={course} onView={onView} hasSchedule={hasSchedule} />
            ))}
        </Card>
    )
}

// ----------------------------------------------------------------------

ViewCourseDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    registeredCourse: PropTypes.object,
    courseType: PropTypes.string,
    schedules: PropTypes.object,
    hasSchedule: PropTypes.bool,
}

export function ViewCourseDialog({ open, onClose, registeredCourse, courseType, schedules, hasSchedule }) {
    return (

        !hasSchedule ? (
            <UnscheduledCourseDialog open={open} onClose={onClose} registeredCourse={registeredCourse} />
        ) : (
            <ScheduledCourseDialog open={open} onClose={onClose} registeredCourse={registeredCourse} schedules={schedules} courseType={courseType} />
        )
    )
}

// ----------------------------------------------------------------------

UnscheduledCourseDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    registeredCourse: PropTypes.object,
}

export function UnscheduledCourseDialog({ open, onClose, registeredCourse }) {

    const {
        course,
        subject,
        method,
        level,
        fromDate,
        toDate,
        hourPerClass,
        totalHour,
        preferredDays
    } = registeredCourse

    console.log("HI")
    return (
        <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}
            PaperProps={{
                sx: {
                    '&::-webkit-scrollbar': { display: 'none' }
                }
            }} >
            <Grid container direction="row" sx={{ p: 3, mb: 0 }} spacing={2} >
                <Grid container item xs={12} md={12} justifyContent="space-between" alignItems="center">
                    <Typography variant="h6"> Course Detail </Typography>
                    <IconButton variant="h6" onClick={onClose}> <CloseIcon /> </IconButton>
                </Grid>
            </Grid>

            <Grid container direction="row" sx={{ px: 1, mb: 1 }} spacing={2}>
                <Grid item xs={12} md={12}>
                    <Stack direction="row" sx={{ mb: 2, mx: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={6} md={6}>
                                <TextField fullWidth defaultValue={course} label="Course" disabled />
                            </Grid>
                            <Grid item xs={6} md={6}>
                                <TextField fullWidth defaultValue={subject} label="Subject" disabled />
                            </Grid>
                            <Grid item xs={6} md={6}>
                                <TextField fullWidth defaultValue={level} label="Level" disabled />
                            </Grid>

                            {/* Total Hours */}
                            <Grid item xs={6} md={2}>
                                <TextField fullWidth defaultValue={totalHour} label="Total Hours" type="number" disabled />
                            </Grid>

                            {/* Learning Method */}
                            <Grid item xs={6} md={2}>
                                <TextField
                                    fullWidth
                                    defaultValue={method}
                                    label="Method"
                                    inputProps={{
                                        style: { textTransform: "capitalize", fontSize: "0.9rem" }
                                    }}
                                    disabled
                                />
                            </Grid>

                            {/* Hours Per Class */}
                            <Grid item xs={6} md={2}>
                                <TextField fullWidth defaultValue={hourPerClass} label="Hours/Class" disabled />
                            </Grid>
                        </Grid>
                    </Stack>
                    <Stack direction="row" sx={{ mb: 2, mx: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField fullWidth defaultValue={fDate(fromDate, 'dd-MMM-yyyy')} label="Start Date" disabled />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField fullWidth defaultValue={fDate(toDate, 'dd-MMM-yyyy')} label="End Date" disabled />
                            </Grid>

                            <Grid item xs={12} md={12}>
                                <Typography variant="inherit" sx={{ color: 'text.disabled' }}>Preferred Days</Typography>
                            </Grid>

                            <Grid item xs={12} md={12}>
                                <Stack direction="row" sx={{ pb: 3 }}>
                                    <Grid container direction="row" spacing={2}>
                                        {preferredDays.map((eachDay, index) => (
                                            <Grid item xs={6} md={1.7} key={index}>
                                                <TextField
                                                    fullWidth
                                                    label={eachDay.day}
                                                    value={`${eachDay.fromTime} - ${eachDay.toTime}`}
                                                    InputProps={{
                                                        style: { fontSize: '0.8rem' }
                                                    }}
                                                    disabled
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Stack>
                </Grid>
            </Grid>
        </Dialog>
    )
}

// ----------------------------------------------------------------------

ScheduledCourseDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    registeredCourse: PropTypes.object,
    courses: PropTypes.string,
    schedules: PropTypes.object,
}

export function ScheduledCourseDialog({ open, onClose, registeredCourse, courseType, schedules }) {

    const {
        course,
        subject,
        level,
        fromDate,
        toDate,
        hourPerClass,
        totalHour,
        method,
        preferredDays
    } = registeredCourse

    const {
        classes
    } = schedules

    const customTextFieldStyle = {
        fontSize: '0.9rem'
    }

    let displayAccumulatedHours = 0;

    function accumulatedHours() {
        let HoursCount = 0;
        classes.forEach((eachClass) => {
            const timeA = moment([eachClass.fromTime.slice(0, 2), eachClass.fromTime.slice(3, 5)], "HH:mm")
            const timeB = moment([eachClass.toTime.slice(0, 2), eachClass.toTime.slice(3, 5)], "HH:mm")
            HoursCount += timeB.diff(timeA, 'hours');
        })
        return HoursCount;
    }

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
            padding: 16,
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

    return (
        <Dialog fullWidth maxWidth="xl" open={open} onClose={onClose}>


            <Grid container direction="row" sx={{ p: 3, pb: 1 }} spacing={2} >
                <Grid container item xs={12} md={12} justifyContent="space-between" alignItems="center">
                    <Typography variant="h6"> Course Detail </Typography>
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
                                    value={course.concat(' ', subject, ' ', level)}
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
                                    value={courseType}
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
                                    value={method}
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
                                    value={totalHour}
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
                                    value={hourPerClass}
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
                                    value={fDate(fromDate, 'dd-MMM-yyyy')}
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
                                    value={fDate(toDate, 'dd-MMM-yyyy')}
                                    label="End Date"
                                    disabled
                                    InputProps={{
                                        style: customTextFieldStyle
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Stack>

                    <Grid item xs={12} md={12} sx={{ mb: 1 }}>
                        <Typography variant="inherit" sx={{ color: 'text.disabled' }}>
                            Preferred Days
                        </Typography>
                    </Grid>

                    <Stack direction="row" sx={{ pb: 3 }}>
                        <Grid container direction="row" spacing={2}>
                            {preferredDays.map((eachDay, index) => (
                                <Grid item xs={6} md={3} key={index}>
                                    <TextField
                                        fullWidth
                                        label={eachDay.day}
                                        value={`${eachDay.fromTime} - ${eachDay.toTime}`}
                                        InputProps={{
                                            style: { fontSize: '0.8rem' }
                                        }}
                                        disabled
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Stack>
                </Grid>

                <Grid item xs={12} md={7}>
                    <Scrollbar sx={{ maxHeight: '28.1rem', pr: 1.5 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                            <Typography variant="h6">
                                Classes & Schedules
                            </Typography>
                        </Stack>


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
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {classes.map((eachClass, index) => {
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
                                                <StyledTableCell sx={{ width: '15%' }} align="center">{eachClass.teacherPrivateClass.teacherId}</StyledTableCell>
                                                <StyledTableCell align="center">{displayAccumulatedHours.toString()}</StyledTableCell>
                                            </StyledTableRow>
                                        )
                                    })}
                                    <StyledTableRow>
                                        <StyledTableCell colSpan={7} align="center">TOTAL</StyledTableCell>
                                        <StyledTableCell align="center">{accumulatedHours()}</StyledTableCell>
                                    </StyledTableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                    </Scrollbar>
                </Grid>
            </Grid>
        </Dialog>
    )
}


// ----------------------------------------------------------------------

// PreferredDay.propTypes = {
//     day: PropTypes.object,
// };

// export function PreferredDay({ day }) {

//     return (
//         <Stack direction="row" spacing={2} sx={{ mt: 1 }} justifyContent="flex-start" alignItems="center" >
//             <Box sx={{ width: 50 }}>
//                 <FormGroup>
//                     <FormControlLabel disabled control={<Checkbox checked={!!day.fromTime} />} label={day.day.charAt(0).toUpperCase() + day.day.slice(1, 3)} />
//                 </FormGroup>
//             </Box>
//             <TextField size="small" fullWidth defaultValue={day.fromTime} disabled />
//             <Typography variant="inherit" > - </Typography>
//             <TextField size="small" fullWidth defaultValue={day.toTime} disabled />
//         </Stack>
//     )
// }

// ----------------------------------------------------------------------

CompleteForm.propTypes = {
    request: PropTypes.object,
    students: PropTypes.array,
    registeredCourses: PropTypes.array,
    schedules: PropTypes.array,
    hasSchedule: PropTypes.bool,
}

export function CompleteForm({ request, students, registeredCourses, schedules, hasSchedule }) {

    const {
        id,
        eaStatus,
        paymentStatus,
        epRemark1,
        epRemark2
    } = request;

    const [selectedCourse, setSelectedCourse] = useState({});
    const [currentSchedule, setCurrentSchedule] = useState({});
    const [openCourseDialog, setOpenCourseDialog] = useState(false);

    const handleOpenCourseDialog = async (courseIndex) => {
        const _course = registeredCourses[courseIndex];
        await setSelectedCourse(_course);
        const _schedule = schedules.find(
            eachSchedule => eachSchedule.course.course === _course.course && eachSchedule.course.subject === _course.subject
                && eachSchedule.course.level === _course.level && eachSchedule.course.fromDate === _course.fromDate && eachSchedule.course.toDate === _course.toDate
        );
        await setCurrentSchedule(_schedule);
        setOpenCourseDialog(true);
    }

    const handleCloseEditCourseDialog = async () => {
        await setSelectedCourse({});
        await setCurrentSchedule({});
        setOpenCourseDialog(false);
    }

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                    <StudentSection courseType={request.courseType} students={students} />
                </Grid>
                <Grid item xs={12} md={12}>
                    <CourseSection
                        courses={registeredCourses}
                        onView={handleOpenCourseDialog}
                        hasSchedule
                    />
                </Grid>

                <Grid item xs={12} md={12}>
                    <Card sx={{ p: 3 }}>
                        <Typography variant="h5"
                            sx={{
                                mb: 2,
                                display: 'block',
                            }}
                        >
                            Additional Comment
                        </Typography>
                        <Box
                            rowGap={3}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                sm: 'repeat(1, 1fr)',
                            }}
                        >
                            <TextField fullWidth defaultValue={epRemark1} label="Comment from Education Planner" disabled />
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            {Object.keys(selectedCourse).length > 0 && Object.keys(currentSchedule).length > 0 && (
                <ViewCourseDialog
                    open={openCourseDialog}
                    onClose={handleCloseEditCourseDialog}
                    registeredCourse={selectedCourse}
                    courseType={request.courseType}
                    schedules={currentSchedule}
                    hasSchedule
                />
            )}
        </>
    )
}

// ----------------------------------------------------------------------

RejectForm.propTypes = {
    request: PropTypes.object,
    students: PropTypes.array,
    registeredCourses: PropTypes.array
}

export function RejectForm({ request, students, registeredCourses }) {

    const {
        id,
        eaStatus,
        paymentStatus,
        epRemark2,
        eaRemark
    } = request;

    const [selectedCourse, setSelectedCourse] = useState({});
    const [openCourseDialog, setOpenCourseDialog] = useState(false);

    const handleOpenCourseDialog = async (courseIndex) => {
        await setSelectedCourse(registeredCourses[courseIndex]);
        setOpenCourseDialog(true);
    }

    const handleCloseEditCourseDialog = async () => {
        await setSelectedCourse({});
        setOpenCourseDialog(false);
    }

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                    <StudentSection courseType={request.courseType} students={students} />
                </Grid>
                <Grid item xs={12} md={12}>
                    <CourseSection
                        courses={registeredCourses}
                        onView={handleOpenCourseDialog}
                        status="Reject"
                    />
                </Grid>

                {!!eaRemark && (
                    <Grid item xs={12} md={12}>
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h5"
                                sx={{
                                    mb: 2,
                                    display: 'block',
                                }}
                            >
                                Additional Comment
                            </Typography>
                            <Box
                                rowGap={3}
                                columnGap={2}
                                display="grid"
                                gridTemplateColumns={{
                                    xs: 'repeat(1, 1fr)',
                                    sm: 'repeat(1, 1fr)',
                                }}
                            >
                                <TextField fullWidth defaultValue={eaRemark} label="Comment for pending payment" disabled />
                            </Box>
                        </Card>
                    </Grid>
                )}

                {!!epRemark2 && (
                    <Grid item xs={12} md={12}>
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h5"
                                sx={{
                                    mb: 2,
                                    display: 'block',
                                }}
                            >
                                Additional Comment
                            </Typography>
                            <Box
                                rowGap={3}
                                columnGap={2}
                                display="grid"
                                gridTemplateColumns={{
                                    xs: 'repeat(1, 1fr)',
                                    sm: 'repeat(1, 1fr)',
                                }}
                            >
                                <TextField fullWidth defaultValue={epRemark2} label="Comment for pending payment" disabled />
                            </Box>
                        </Card>
                    </Grid>
                )}
            </Grid>

            {Object.keys(selectedCourse).length > 0 && (
                <ViewCourseDialog
                    open={openCourseDialog}
                    onClose={handleCloseEditCourseDialog}
                    registeredCourse={selectedCourse}
                />
            )}
        </>
    )
}

// ----------------------------------------------------------------------

EARejectForm.propTypes = {
    request: PropTypes.object,
    students: PropTypes.array,
    registeredCourses: PropTypes.array
}

export function EARejectForm({ request, students, registeredCourses }) {

    const {
        epRemark1,
        courseType,
        eaRemark
    } = request;

    const [selectedCourse, setSelectedCourse] = useState({});
    const [openCourseDialog, setOpenCourseDialog] = useState(false);

    const handleOpenCourseDialog = async (courseIndex) => {
        await setSelectedCourse(registeredCourses[courseIndex]);
        setOpenCourseDialog(true);
    }

    const handleCloseEditCourseDialog = async () => {
        await setSelectedCourse({});
        setOpenCourseDialog(false);
    }

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                    <StudentSection courseType={courseType} students={students} />
                </Grid>
                <Grid item xs={12} md={12}>
                    <CourseSection
                        courses={registeredCourses}
                        onView={handleOpenCourseDialog}
                    />
                </Grid>
                <Grid item xs={12} md={12}>
                    <Card sx={{ p: 3 }}>
                        <Typography variant="h5"
                            sx={{
                                mb: 2,
                                display: 'block',
                            }}
                        >
                            Additional Comment
                        </Typography>
                        <Box
                            rowGap={3}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                sm: 'repeat(1, 1fr)',
                            }}
                        >
                            <TextField fullWidth defaultValue={eaRemark} label="Comment from Education Admin" disabled />
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            {Object.keys(selectedCourse).length > 0 && (
                <ViewCourseDialog
                    open={openCourseDialog}
                    onClose={handleCloseEditCourseDialog}
                    registeredCourse={selectedCourse}
                />
            )}
        </>
    )
}

// ----------------------------------------------------------------------

OtherRejectForm.propTypes = {
    request: PropTypes.object,
    students: PropTypes.array,
    registeredCourses: PropTypes.array,
    schedules: PropTypes.array,
    hasSchedule: PropTypes.bool,
}

export function OtherRejectForm({ request, students, registeredCourses, schedules, hasSchedule }) {

    const {
        id,
        eaStatus,
        paymentStatus,
        epRemark1,
        epRemark2
    } = request;

    const [selectedCourse, setSelectedCourse] = useState({});
    const [currentSchedule, setCurrentSchedule] = useState({});
    const [openCourseDialog, setOpenCourseDialog] = useState(false);

    const handleOpenCourseDialog = async (courseIndex) => {
        const _course = registeredCourses[courseIndex];
        await setSelectedCourse(_course);
        // if (hasSchedule) {
        //     const _schedule = schedules.find(
        //         eachSchedule => eachSchedule.course.course === _course.course && eachSchedule.course.subject === _course.subject
        //             && eachSchedule.course.level === _course.level && eachSchedule.course.fromDate === _course.fromDate && eachSchedule.course.toDate === _course.toDate
        //     );
        //     await setCurrentSchedule(_schedule);
        // }
        setOpenCourseDialog(true);
    }

    const handleCloseEditCourseDialog = async () => {
        await setSelectedCourse({});
        await setCurrentSchedule({});
        setOpenCourseDialog(false);
    }

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                    <StudentSection courseType={request.courseType} students={students} />
                </Grid>
                <Grid item xs={12} md={12}>
                    <CourseSection
                        courses={registeredCourses}
                        onView={handleOpenCourseDialog}
                        hasSchedule={hasSchedule}
                    />
                </Grid>

                <Grid item xs={12} md={12}>
                    <Card sx={{ p: 3 }}>
                        <Typography variant="h5"
                            sx={{
                                mb: 2,
                                display: 'block',
                            }}
                        >
                            Additional Comment
                        </Typography>
                        <Box
                            rowGap={3}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                sm: 'repeat(1, 1fr)',
                            }}
                        >
                            <TextField fullWidth defaultValue={epRemark1} label="Comment from Education Planner" disabled />
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            {Object.keys(selectedCourse).length > 0 && (
                <ViewCourseDialog
                    open={openCourseDialog}
                    onClose={handleCloseEditCourseDialog}
                    registeredCourse={selectedCourse}
                    courseType={request.courseType}
                    schedules={currentSchedule}
                    hasSchedule={hasSchedule}
                />
            )}
        </>
    )
}