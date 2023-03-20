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
import { ViewCourseDialog } from '../ViewCourseDialog';
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
        axios.get(`${HOG_API}/api/Schedule/Get/${request.id}`)
            .then((res) => setSchedules(res.data.data))
            .catch((error) => console.error(error))
        // if (request.eaStatus === 'Complete' && request.status !== 'Reject') {
        //     axios.get(`${HOG_API}/api/Schedule/Get/${request.id}`)
        //         .then((res) => setSchedules(res.data.data))
        //         .catch((error) => console.error(error))
        // }
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

            <Grid container direction="row" spacing={1} sx={{ mt: 1 }}>
                {students.map((student, index) => (
                    <Grid item xs={12} md={4} key={student.id}>
                        <TextField
                            disabled
                            variant="standard"
                            sx={{ width: 320 }}
                            value={`${student.fullName} (${student.nickname})`}
                        />
                    </Grid>
                ))}
            </Grid>

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

            {Object.keys(selectedCourse).length > 0 && schedules.length === 0 && (
                <ViewCourseDialog
                    open={openCourseDialog}
                    onClose={handleCloseEditCourseDialog}
                    registeredCourse={selectedCourse}
                    courseType={request.courseType}
                    hasSchedule={false}
                />
            )}

            {Object.keys(selectedCourse).length > 0 && currentSchedule !== undefined && Object.keys(currentSchedule).length !== 0 && (
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
        if (hasSchedule) {
            const _schedule = schedules.find(
                eachSchedule => eachSchedule.course.course === _course.course && eachSchedule.course.subject === _course.subject
                    && eachSchedule.course.level === _course.level && eachSchedule.course.fromDate === _course.fromDate && eachSchedule.course.toDate === _course.toDate
            );
            await setCurrentSchedule(_schedule);
        }
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

            {Object.keys(selectedCourse).length > 0 && Object.keys(currentSchedule).length > 0 && (
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