import PropTypes from 'prop-types';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import moment from 'moment';
import axios from 'axios';
// firebase
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll, getMetadata } from "firebase/storage"
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
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    RadioGroup,
    Radio
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// components
import { useSnackbar } from '../../../components/snackbar';
import Scrollbar from '../../../components/scrollbar/Scrollbar';
import { Upload } from '../../../components/upload';
import LoadingScreen from '../../../components/loading-screen/LoadingScreen';
import FormProvider, { RHFUpload, RHFRadioGroup } from '../../../components/hook-form';
import FileThumbnail from '../../../components/file-thumbnail';
//
import { fDate } from '../../../utils/formatTime';
import ViewCourseCard from '../ep-registration-request-form/ViewCourseCard';
import { HOG_API, FIREBASE_API } from '../../../config';
import { useAuthContext } from '../../../auth/useAuthContext';
import { ViewCourseDialog } from '../ViewCourseDialog';

// ----------------------------------------------------------------------

RegistrationRequestDetail.propTypes = {
    currentRequest: PropTypes.object,
    currentPayments: PropTypes.object,
    officeAdminId: PropTypes.number
};

// ----------------------------------------------------------------------

export default function RegistrationRequestDetail({ currentRequest, currentPayments, officeAdminId }) {
    const dataFetchedRef = useRef(false);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const {
        request,
        information,
        students
    } = currentRequest;

    const paymentType = currentPayments.paymentType

    const [openCourseDialog, setOpenCourseDialog] = useState(false);
    const [openAcceptDialog, setOpenAcceptDialog] = useState(false);
    const [openSendBackDialog, setOpenSendBackDialog] = useState(false);

    const [schedules, setSchedules] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState({});
    const [currentSchedule, setCurrentSchedule] = useState({});

    const [rejectedReason, setRejectedReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Firebase
    const firebaseApp = initializeApp(FIREBASE_API);
    const storage = getStorage(firebaseApp);
    const [filesURL, setFilesURL] = useState([]);

    const fetchPayments = async () => {
        const listRef = ref(storage, `payments/${request.id}`);
        try {
            await listAll(listRef)
                .then((res) => {
                    res.items.map((itemRef) => (
                        getMetadata(itemRef)
                            .then((metadata) => {
                                getDownloadURL(itemRef)
                                    .then((url) => setFilesURL(filesURL => [...filesURL, { name: metadata.name, preview: url }]))
                                    .catch((error) => {
                                        throw error;
                                    });
                            })
                            .catch((error) => {
                                throw error;
                            })
                    ))
                })
                .catch((error) => {
                    throw error;
                })
        } catch (error) {
            console.error(error);
        }
    };

    const fetchSchedules = async () => {
        if (request.eaStatus === 'Complete') {
            await axios.get(`${HOG_API}/api/Schedule/Get/${request.id}`)
                .then((res) => setSchedules(res.data.data))
                .catch((error) => console.error(error))
        }
    }

    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;

        fetchPayments();
        fetchSchedules();
    }, [])

    const handleOpenCourseDialog = async (courseIndex) => {
        const _course = information[courseIndex];
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

    // if (filesURL.length === 0) {
    //     return <LoadingScreen />
    // }

    const handleAccept = async () => {
        setIsSubmitting(true);
        try {
            await axios.put(`${HOG_API}/api/PrivateRegistrationRequest/Put`, {
                request: {
                    id: request.id,
                    status: 'Complete',
                    eaStatus: 'Complete',
                    paymentStatus: 'Complete',
                    epRemark1: request.epRemark1,
                    epRemark2: request.epRemark2,
                    eaRemark: request.eaRemark,
                    oaRemark: request.oaRemark,
                    takenByEPId: request.takenByEPId,
                    takenByEAId: request.takenByEAId,
                    takenByOAId: officeAdminId
                }
            })
                .catch((error) => {
                    throw error;
                })

            enqueueSnackbar('Registration request accepted successfully', { variant: 'success' });
            setIsSubmitting(false);
            navigate('/course-registration/oa-request-status')

        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
            setIsSubmitting(false);
        }
    }

    const handleSendBack = async (reason) => {
        setIsSubmitting(true);
        if (reason === '') {
            enqueueSnackbar('Please enter rejected reason before proceeding', { variant: 'error' });
            setIsSubmitting(false);
        } else {
            try {
                await axios.put(`${HOG_API}/api/PrivateRegistrationRequest/Put`, {
                    request: {
                        id: request.id,
                        status: 'PendingEP',
                        eaStatus: 'Complete',
                        paymentStatus: 'Incomplete',
                        epRemark1: request.epRemark1,
                        epRemark2: request.epRemark2,
                        eaRemark: request.eaRemark,
                        oaRemark: reason,
                        takenByEPId: request.takenByEPId,
                        takenByEAId: request.takenByEAId,
                        takenByOAId: officeAdminId
                    }
                })
                    .catch((error) => {
                        throw error;
                    })

                enqueueSnackbar('The request is successfully sent back', { variant: 'success' });
                setIsSubmitting(false);
                navigate('/course-registration/oa-request-status')
            } catch (error) {
                enqueueSnackbar(error.message, { variant: 'error' });
                setIsSubmitting(false);
            }
        }
    }

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                    <StudentSection courseType={request.courseType} students={students} />
                </Grid>
                <Grid item xs={12} md={12}>
                    <CourseSection
                        courses={information}
                        onView={handleOpenCourseDialog}
                        hasSchedule={!!schedules.length}
                    />
                </Grid>

                <Grid item xs={12} md={12}>
                    <Grid item xs={12} md={12}>
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h5"
                                sx={{
                                    mb: 2,
                                    display: 'block',
                                }}>
                                Payment Attachments
                            </Typography>
                            <RadioGroup
                                value={paymentType}
                                sx={{ my: 2, mx: 1 }}
                            >
                                <Stack direction="row" spacing={1}>
                                    <FormControlLabel value="Complete Payment" disabled control={<Radio />} label="Complete Payment" />
                                    <FormControlLabel value="Installments Payment" disabled control={<Radio />} label="Installment Payment" />
                                </Stack>
                            </RadioGroup>
                            <Stack direction="row">
                                {filesURL.map((file) => {
                                    return (
                                        <Stack
                                            key={file.name}
                                            component={'div'}
                                            alignItems="center"
                                            display="inline-flex"
                                            justifyContent="center"
                                            sx={{
                                                m: 0.5,
                                                width: 80,
                                                height: 80,
                                                borderRadius: 1.25,
                                                overflow: 'hidden',
                                                position: 'relative',
                                                border: (theme) => `solid 1px ${theme.palette.divider}`,
                                            }}
                                        >
                                            <FileThumbnail
                                                tooltip
                                                imageView
                                                file={file}
                                                onDownload={() => window.open(`${file.preview}`)}
                                            />
                                        </Stack>
                                    )
                                })}
                            </Stack>
                        </Card>
                    </Grid>
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
                            <TextField fullWidth defaultValue={request.epRemark2} label="Comment from Education Planner" disabled />
                        </Box>
                    </Card>
                </Grid>

                {!!request.oaRemark && (
                    <Grid item xs={12} md={12}>
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h5"
                                sx={{
                                    mb: 2,
                                    display: 'block',
                                }}
                            >
                                OA Remark
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
                                <TextField fullWidth defaultValue={request.oaRemark} label="Comment by Office Admin" disabled />
                            </Box>
                        </Card>
                    </Grid>
                )}

                {request.status !== 'Complete' && request.status !== 'Reject' && request.paymentStatus !== 'Incomplete' &&
                    <Grid item xs={12} md={12}>
                        <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                            <Button variant="outlined" color="inherit" sx={{ height: '3em' }} onClick={() => setOpenSendBackDialog(true)}>
                                Send back to EP
                            </Button>
                            <Button variant="contained" color="primary" sx={{ height: '3em' }} onClick={() => setOpenAcceptDialog(true)}>
                                Accept
                            </Button>
                        </Stack>
                        <AcceptDialog
                            open={openAcceptDialog}
                            close={() => setOpenAcceptDialog(false)}
                            onAccept={handleAccept}
                            isSubmitting={isSubmitting}
                        />
                        <SendBackDialog
                            open={openSendBackDialog}
                            close={() => setOpenSendBackDialog(false)}
                            onSendBack={handleSendBack}
                            isSubmitting={isSubmitting}
                        />
                    </Grid>
                }

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

AcceptDialog.propTypes = {
    open: PropTypes.bool,
    close: PropTypes.func,
    onAccept: PropTypes.func,
    isSubmitting: PropTypes.bool,
}

export function AcceptDialog({ open, close, onAccept, isSubmitting }) {

    return (
        <Dialog
            open={open}
            onClose={close}
            maxWidth="sm"
        >
            <DialogTitle>
                <Stack direction="row" alignItems="center" justifyContent="flex-start">
                    <CheckCircleOutlineIcon fontSize="large" sx={{ mr: 1 }} />
                    <Typography variant="h5">Accept the request?</Typography>
                </Stack>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    If you accept, the class schedule will be updated on both teacher and student mobile applications.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button color="inherit" variant="outlined" onClick={close}>Cancel</Button>
                <LoadingButton loading={isSubmitting} variant="contained" onClick={onAccept} color="primary">
                    Accept
                </LoadingButton>
            </DialogActions>
        </Dialog>
    )
}

// ----------------------------------------------------------------------

SendBackDialog.propTypes = {
    open: PropTypes.bool,
    close: PropTypes.func,
    onSendBack: PropTypes.func,
    isSubmitting: PropTypes.bool,
}

export function SendBackDialog({ open, close, onSendBack, isSubmitting }) {

    const [sendBackReason, setSendBackReason] = useState('');

    return (
        <Dialog
            open={open}
            onClose={close}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                <Stack direction="row" alignItems="center" justifyContent="flex-start">
                    <CheckCircleOutlineIcon fontSize="large" sx={{ mr: 1 }} />
                    <Typography variant="h5">Reason of sending back to EP</Typography>
                </Stack>
            </DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    name="sendBackReason"
                    label="Reason..."
                    multiline
                    rows={3}
                    sx={{ my: 1 }}
                    onChange={(event) => setSendBackReason(event.target.value)}
                    required />
            </DialogContent>
            <DialogActions>
                <Button color="inherit" variant="outlined" onClick={close}>Cancel</Button>
                <LoadingButton loading={isSubmitting} variant="contained" onClick={() => onSendBack(sendBackReason)} color="error">
                    Confirm
                </LoadingButton>
            </DialogActions>
        </Dialog>
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
    hasSchedule: PropTypes.bool,
}

export function CourseSection({ courses, onView, hasSchedule }) {

    // Schedule Dialog for group
    const [open, setOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState({});

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


// // ----------------------------------------------------------------------

// ViewCourseDialog.propTypes = {
//     open: PropTypes.bool,
//     onClose: PropTypes.func,
//     registeredCourse: PropTypes.object,
//     courseType: PropTypes.string,
//     schedules: PropTypes.object,
//     hasSchedule: PropTypes.bool,
// }

// export function ViewCourseDialog({ open, onClose, registeredCourse, courseType, schedules, hasSchedule }) {

//     return (

//         !hasSchedule ? (
//             <UnscheduledCourseDialog open={open} onClose={onClose} registeredCourse={registeredCourse} />
//         ) : (
//             <ScheduledCourseDialog open={open} onClose={onClose} registeredCourse={registeredCourse} schedules={schedules} courseType={courseType} />
//         )
//     )
// }

// // ----------------------------------------------------------------------

// UnscheduledCourseDialog.propTypes = {
//     open: PropTypes.bool,
//     onClose: PropTypes.func,
//     registeredCourse: PropTypes.object,
// }

// export function UnscheduledCourseDialog({ open, onClose, registeredCourse }) {

//     const {
//         course,
//         subject,
//         method,
//         level,
//         fromDate,
//         toDate,
//         hourPerClass,
//         totalHour,
//         preferredDays
//     } = registeredCourse

//     return (
//         <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}
//             PaperProps={{
//                 sx: {
//                     '&::-webkit-scrollbar': { display: 'none' }
//                 }
//             }} >
//             <Grid container direction="row" sx={{ p: 3, mb: 0 }} spacing={2} >
//                 <Grid container item xs={12} md={12} justifyContent="space-between" alignItems="center">
//                     <Typography variant="h6"> Course Detail </Typography>
//                     <IconButton variant="h6" onClick={onClose}> <CloseIcon /> </IconButton>
//                 </Grid>
//             </Grid>

//             <Grid container direction="row" sx={{ px: 1, mb: 1 }} spacing={2}>
//                 <Grid item xs={12} md={12}>
//                     <Stack direction="row" sx={{ mb: 2, mx: 3 }}>
//                         <Grid container spacing={2}>
//                             <Grid item xs={6} md={6}>
//                                 <TextField fullWidth defaultValue={course} label="Course" disabled />
//                             </Grid>
//                             <Grid item xs={6} md={6}>
//                                 <TextField fullWidth defaultValue={subject} label="Subject" disabled />
//                             </Grid>
//                             <Grid item xs={6} md={6}>
//                                 <TextField fullWidth defaultValue={level} label="Level" disabled />
//                             </Grid>

//                             {/* Total Hours */}
//                             <Grid item xs={6} md={2}>
//                                 <TextField fullWidth defaultValue={totalHour} label="Total Hours" type="number" disabled />
//                             </Grid>

//                             {/* Learning Method */}
//                             <Grid item xs={6} md={2}>
//                                 <TextField
//                                     fullWidth
//                                     defaultValue={method}
//                                     label="Method"
//                                     inputProps={{
//                                         style: { textTransform: "capitalize", fontSize: "0.9rem" }
//                                     }}
//                                     disabled
//                                 />
//                             </Grid>

//                             {/* Hours Per Class */}
//                             <Grid item xs={6} md={2}>
//                                 <TextField fullWidth defaultValue={hourPerClass} label="Hours/Class" disabled />
//                             </Grid>
//                         </Grid>
//                     </Stack>
//                     <Stack direction="row" sx={{ mb: 2, mx: 3 }}>
//                         <Grid container spacing={2}>
//                             <Grid item xs={12} md={6}>
//                                 <TextField fullWidth defaultValue={fDate(fromDate, 'dd-MMM-yyyy')} label="Start Date" disabled />
//                             </Grid>

//                             <Grid item xs={12} md={6}>
//                                 <TextField fullWidth defaultValue={fDate(toDate, 'dd-MMM-yyyy')} label="End Date" disabled />
//                             </Grid>

//                             <Grid item xs={12} md={12}>
//                                 <Typography variant="inherit" sx={{ color: 'text.disabled' }}>Preferred Days</Typography>
//                             </Grid>

//                             <Grid item xs={12} md={12}>
//                                 <Stack direction="row" sx={{ pb: 3 }}>
//                                     <Grid container direction="row" spacing={2}>
//                                         {preferredDays.map((eachDay, index) => (
//                                             <Grid item xs={6} md={1.7} key={index}>
//                                                 <TextField
//                                                     fullWidth
//                                                     label={eachDay.day}
//                                                     value={`${eachDay.fromTime} - ${eachDay.toTime}`}
//                                                     InputProps={{
//                                                         style: { fontSize: '0.8rem' }
//                                                     }}
//                                                     disabled
//                                                 />
//                                             </Grid>
//                                         ))}
//                                     </Grid>
//                                 </Stack>
//                             </Grid>
//                         </Grid>
//                     </Stack>
//                 </Grid>
//             </Grid>
//         </Dialog>
//     )
// }

// // ----------------------------------------------------------------------

// ScheduledCourseDialog.propTypes = {
//     open: PropTypes.bool,
//     onClose: PropTypes.func,
//     registeredCourse: PropTypes.object,
//     courses: PropTypes.string,
//     schedules: PropTypes.object,
// }

// export function ScheduledCourseDialog({ open, onClose, registeredCourse, courseType, schedules }) {

//     const {
//         course,
//         subject,
//         level,
//         fromDate,
//         toDate,
//         hourPerClass,
//         totalHour,
//         method,
//         preferredDays
//     } = registeredCourse

//     const {
//         classes
//     } = schedules

//     const customTextFieldStyle = {
//         fontSize: '0.9rem'
//     }

//     let displayAccumulatedHours = 0;

//     function accumulatedHours() {
//         let HoursCount = 0;
//         classes.forEach((eachClass) => {
//             const timeA = moment([eachClass.fromTime.slice(0, 2), eachClass.fromTime.slice(3, 5)], "HH:mm")
//             const timeB = moment([eachClass.toTime.slice(0, 2), eachClass.toTime.slice(3, 5)], "HH:mm")
//             HoursCount += timeB.diff(timeA, 'hours');
//         })
//         return HoursCount;
//     }

//     const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

//     // Tables ---------------------------------------------------------------------------------
//     const StyledTableCell = styled(TableCell)(({ theme }) => ({
//         [`&.${tableCellClasses.head}`]: {
//             backgroundColor: theme.palette.divider,
//             color: theme.palette.common.black,
//             fontSize: '0.7rem',
//             border: `1px solid ${theme.palette.divider}`,
//         },
//         [`&.${tableCellClasses.body}`]: {
//             fontSize: '0.7rem',
//             padding: 16,
//             border: `1px solid ${theme.palette.divider}`,

//         },
//     }));

//     const StyledTableRow = styled(TableRow)(({ theme }) => ({
//         '&:last-child td, &:last-child th': {
//             backgroundColor: theme.palette.divider,
//             padding: 16,
//             fontWeight: 600,
//             border: `1px solid ${theme.palette.divider}`,
//         },
//     }));

//     return (
//         <Dialog fullWidth maxWidth="xl" open={open} onClose={onClose}>


//             <Grid container direction="row" sx={{ p: 3, pb: 1 }} spacing={2} >
//                 <Grid container item xs={12} md={12} justifyContent="space-between" alignItems="center">
//                     <Typography variant="h6"> Course Detail </Typography>
//                     <IconButton variant="h6" onClick={onClose}> <CloseIcon /> </IconButton>
//                 </Grid>
//             </Grid>

//             <Grid container direction="row" sx={{ px: 3 }} spacing={2}>
//                 <Grid item xs={12} md={5}>
//                     <Grid item xs={12} md={12} sx={{ pb: 2 }}>
//                         <Typography variant="h6"> Course Information </Typography>
//                     </Grid>

//                     <Stack direction="row" sx={{ pb: 2 }}>
//                         <Grid container direction="row" spacing={2}>
//                             <Grid item xs={12} md={6}>
//                                 <TextField
//                                     fullWidth
//                                     variant="outlined"
//                                     value={course.concat(' ', subject, ' ', level)}
//                                     label="Course"
//                                     disabled
//                                     InputProps={{
//                                         style: customTextFieldStyle
//                                     }}
//                                 />
//                             </Grid>
//                             <Grid item xs={12} md={6}>
//                                 <TextField
//                                     fullWidth
//                                     variant="outlined"
//                                     value={courseType}
//                                     label="Course Type"
//                                     disabled
//                                     InputProps={{
//                                         style: customTextFieldStyle
//                                     }}
//                                 />
//                             </Grid>
//                         </Grid>
//                     </Stack>

//                     <Stack direction="row" sx={{ pb: 2 }}>
//                         <Grid container direction="row" spacing={2}>
//                             <Grid item xs={12} md={6}>
//                                 <TextField
//                                     fullWidth
//                                     variant="outlined"
//                                     value={method}
//                                     label="Learning Method"
//                                     disabled
//                                     inputProps={{
//                                         style: { textTransform: "capitalize", fontSize: "0.9rem" }
//                                     }}
//                                 />
//                             </Grid>
//                             <Grid item xs={12} md={3}>
//                                 <TextField
//                                     fullWidth
//                                     variant="outlined"
//                                     value={totalHour}
//                                     label="Total Hours"
//                                     disabled
//                                     InputProps={{
//                                         style: customTextFieldStyle
//                                     }}
//                                 />
//                             </Grid>
//                             <Grid item xs={12} md={3}>
//                                 <TextField
//                                     fullWidth
//                                     variant="outlined"
//                                     value={hourPerClass}
//                                     label="Hours/Class"
//                                     disabled
//                                     InputProps={{
//                                         style: customTextFieldStyle
//                                     }}
//                                 />
//                             </Grid>
//                         </Grid>
//                     </Stack>

//                     <Stack direction="row" sx={{ pb: 2 }} spacing={2}>
//                         <Grid container direction="row" spacing={2}>
//                             <Grid item xs={12} md={6}>
//                                 <TextField
//                                     fullWidth
//                                     variant="outlined"
//                                     value={fDate(fromDate, 'dd-MMM-yyyy')}
//                                     label="Start Date"
//                                     disabled
//                                     InputProps={{
//                                         style: customTextFieldStyle
//                                     }}
//                                 />
//                             </Grid>
//                             <Grid item xs={12} md={6}>
//                                 <TextField
//                                     fullWidth
//                                     variant="outlined"
//                                     value={fDate(toDate, 'dd-MMM-yyyy')}
//                                     label="End Date"
//                                     disabled
//                                     InputProps={{
//                                         style: customTextFieldStyle
//                                     }}
//                                 />
//                             </Grid>
//                         </Grid>
//                     </Stack>

//                     <Grid item xs={12} md={12} sx={{ mb: 1 }}>
//                         <Typography variant="inherit" sx={{ color: 'text.disabled' }}>
//                             Preferred Days
//                         </Typography>
//                     </Grid>

//                     <Stack direction="row" sx={{ pb: 3 }}>
//                         <Grid container direction="row" spacing={2}>
//                             {preferredDays.map((eachDay, index) => (
//                                 <Grid item xs={6} md={3} key={index}>
//                                     <TextField
//                                         fullWidth
//                                         label={eachDay.day}
//                                         value={`${eachDay.fromTime} - ${eachDay.toTime}`}
//                                         InputProps={{
//                                             style: { fontSize: '0.8rem' }
//                                         }}
//                                         disabled
//                                     />
//                                 </Grid>
//                             ))}
//                         </Grid>
//                     </Stack>
//                 </Grid>

//                 <Grid item xs={12} md={7}>
//                     <Scrollbar sx={{ maxHeight: '28.1rem', pr: 1.5 }}>
//                         <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
//                             <Typography variant="h6">
//                                 Classes & Schedules
//                             </Typography>
//                         </Stack>


//                         <TableContainer component={Paper} >
//                             <Table sx={{ width: '100%' }}>
//                                 <TableHead>
//                                     <TableRow>
//                                         <StyledTableCell align="center">No.</StyledTableCell>
//                                         <StyledTableCell align="center">Day</StyledTableCell>
//                                         <StyledTableCell align="center">Date</StyledTableCell>
//                                         <StyledTableCell colSpan={2} align="center">Time</StyledTableCell>
//                                         <StyledTableCell align="center">Method</StyledTableCell>
//                                         <StyledTableCell align="center">Teacher</StyledTableCell>
//                                         <StyledTableCell align="center">Hours</StyledTableCell>
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {classes.map((eachClass, index) => {
//                                         const timeA = moment([eachClass.fromTime.slice(0, 2), eachClass.fromTime.slice(3, 5)], "HH:mm")
//                                         const timeB = moment([eachClass.toTime.slice(0, 2), eachClass.toTime.slice(3, 5)], "HH:mm")
//                                         const hourPerClass = timeB.diff(timeA, 'hours')
//                                         displayAccumulatedHours += hourPerClass;
//                                         const classDate = new Date(eachClass.date);
//                                         return (
//                                             <StyledTableRow key={index}>
//                                                 <StyledTableCell component="th" scope="row" align="center">
//                                                     {(index + 1).toString()}
//                                                 </StyledTableCell>
//                                                 <StyledTableCell align="center"> {weekday[classDate.getDay()].slice(0, 3)} </StyledTableCell>
//                                                 <StyledTableCell align="center">{fDate(classDate, 'dd-MMM-yyyy')}</StyledTableCell>
//                                                 <StyledTableCell align="center">{eachClass.fromTime} - {eachClass.toTime}</StyledTableCell>
//                                                 <StyledTableCell sx={{ width: '8%' }} align="center">{hourPerClass.toString()}</StyledTableCell>
//                                                 <StyledTableCell align="center">{eachClass.method}</StyledTableCell>
//                                                 <StyledTableCell sx={{ width: '15%' }} align="center">{eachClass.teacherPrivateClass.nickname}</StyledTableCell>
//                                                 <StyledTableCell align="center">{displayAccumulatedHours.toString()}</StyledTableCell>
//                                             </StyledTableRow>
//                                         )
//                                     })}
//                                     <StyledTableRow>
//                                         <StyledTableCell colSpan={7} align="center">TOTAL</StyledTableCell>
//                                         <StyledTableCell align="center">{accumulatedHours()}</StyledTableCell>
//                                     </StyledTableRow>
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>

//                     </Scrollbar>
//                 </Grid>
//             </Grid>
//         </Dialog>
//     )
// }