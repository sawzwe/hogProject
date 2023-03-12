import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
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
import ViewCourseCard from './ViewCourseCard';
import FileThumbnail from '../../../components/file-thumbnail';
import LoadingScreen from '../../../components/loading-screen/LoadingScreen';
//
import { fDate } from '../../../utils/formatTime';
import { HOG_API, FIREBASE_API } from '../../../config';
import { useAuthContext } from '../../../auth/useAuthContext';

// ----------------------------------------------------------------------

RegistrationRequestDetail.propTypes = {
    currentRequest: PropTypes.object
};

// ----------------------------------------------------------------------

export default function RegistrationRequestDetail({ currentRequest }) {

    const [selectedCourse, setSelectedCourse] = useState({});
    const [openCourseDialog, setOpenCourseDialog] = useState(false);

    if (!currentRequest) {
        return null;
    }

    const {
        request,
        information,
        schedules,
        students
    } = currentRequest;

    const status = (request.status === 'PendingEA' ? 'Pending EA' : request.status === 'PendingEP' ? 'Pending Payment' : request.status === 'PendingOA' ? 'Pending OA' : request.status === 'Complete' ? 'Complete' : 'Reject')

    const handleOpenCourseDialog = async (courseIndex) => {
        await setSelectedCourse(information[courseIndex]);
        setOpenCourseDialog(true);
    }

    const handleCloseEditCourseDialog = async () => {
        await setSelectedCourse({});
        setOpenCourseDialog(false);
    }

    if (status === 'Pending EA') {
        return <PendingEAForm request={request} students={students} registeredCourses={information} />
    }

    if (status === 'Pending Payment') {
        return <PendingEPForm request={request} students={students} registeredCourses={information} />
    }

    if (status === 'Pending OA' || status === 'Complete') {
        return <PendingOAForm request={request} students={students} registeredCourses={information} status={status} />
    }

    if (status === 'Reject') {
        return <RejectForm request={request} students={students} registeredCourses={information} />
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
    schedules: PropTypes.array
}

export function CourseSection({ courses, onView, schedules }) {

    // Schedule Dialog for group
    const [open, setOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState({});

    const handleSchedule = () => {
        const course = {
            id: 1,
            reqId: 1,
            course: "string",
            section: "",
            subject: "string",
            level: "string",
            method: "onsite",
            totalHour: 0,
            hourPerClass: 0,
            fromDate: "01-March-2023",
            toDate: "31-March-2023",
            privateClasses: [
                {
                    id: 1,
                    room: "string",
                    method: "onsite",
                    date: "02-March-2023 00:00:00",
                    fromTime: "09:00",
                    toTime: "12:00",
                    studentPrivateClasses: [
                        {
                            id: 1,
                            studentId: 2,
                            attendance: "None"
                        }
                    ],
                    teacherPrivateClass: {
                        id: 1,
                        teacherId: 2,
                        status: "Incomplete"
                    }
                }
            ]
        }
        // const selectedSchedule = schedules.find((schedule) => schedule.id === course.scheduleId);
        setSelectedCourse(course);
        setOpen(true);
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
                <ViewCourseCard key={index} courseIndex={index} courseInfo={course} onView={onView} />
            ))}
        </Card>
    )
}

// ----------------------------------------------------------------------

ViewCourseDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    registeredCourse: PropTypes.object,
    courseType: PropTypes.string
}

export function ViewCourseDialog({ open, onClose, registeredCourse, courseType }) {
    return (

        registeredCourse.schedules === undefined ? (
            <UnscheduledCourseDialog open={open} onClose={onClose} registeredCourse={registeredCourse} />
        ) : (
            <ScheduledCourseDialog open={open} onClose={onClose} registeredCourse={registeredCourse} courseType={courseType} />
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
    courses: PropTypes.string
}

export function ScheduledCourseDialog({ open, onClose, registeredCourse, courseType }) {

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

    const schedules = []

    const customTextFieldStyle = {
        fontSize: '0.9rem'
    }

    let displayAccumulatedHours = 0;

    function accumulatedHours() {
        let HoursCount = 0;
        schedules.forEach((eachSchedule) => {
            HoursCount += parseInt(eachSchedule.hourPerClass, 10)
        })
        return HoursCount;
    }

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
            padding: 5,
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

                        {!!schedules.length && (
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
                                        {schedules.map((eachClass, index) => {
                                            displayAccumulatedHours += parseInt(eachClass.hourPerClass, 10);
                                            return (
                                                <StyledTableRow key={index}>
                                                    <StyledTableCell component="th" scope="row" align="center">
                                                        {(index + 1).toString()}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center"> {eachClass.day.slice(0, 3)} </StyledTableCell>
                                                    <StyledTableCell align="center">{fDate(eachClass.date)}</StyledTableCell>
                                                    <StyledTableCell align="center">{eachClass.fromTime} - {eachClass.toTime}</StyledTableCell>
                                                    <StyledTableCell sx={{ width: '8%' }} align="center">{eachClass.hourPerClass}</StyledTableCell>
                                                    <StyledTableCell align="center">{eachClass.method}</StyledTableCell>
                                                    <StyledTableCell sx={{ width: '15%' }} align="center">{`${eachClass.teacher.toUpperCase()}`}</StyledTableCell>
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
                        )}
                    </Scrollbar>
                </Grid>
            </Grid>
        </Dialog>
    )
}


// ----------------------------------------------------------------------

PreferredDay.propTypes = {
    day: PropTypes.object,
};

export function PreferredDay({ day }) {

    return (
        <Stack direction="row" spacing={2} sx={{ mt: 1 }} justifyContent="flex-start" alignItems="center" >
            <Box sx={{ width: 50 }}>
                <FormGroup>
                    <FormControlLabel disabled control={<Checkbox checked={!!day.fromTime} />} label={day.day.charAt(0).toUpperCase() + day.day.slice(1, 3)} />
                </FormGroup>
            </Box>
            <TextField size="small" fullWidth defaultValue={day.fromTime} disabled />
            <Typography variant="inherit" > - </Typography>
            <TextField size="small" fullWidth defaultValue={day.toTime} disabled />
        </Stack>
    )
}

// ----------------------------------------------------------------------

PendingEPForm.propTypes = {
    request: PropTypes.object,
    students: PropTypes.array,
    registeredCourses: PropTypes.array
}

export function PendingEPForm({ request, students, registeredCourses }) {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { user } = useAuthContext();

    // Firebase
    const firebaseApp = initializeApp(FIREBASE_API);
    const storage = getStorage(firebaseApp);

    const MAX_FILE_SIZE = 2 * 1000 * 1000; // 2 Mb
    const FILE_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];

    const PAYMENT_TYPE_OPTIONS = [
        { value: 'Complete Payment', label: 'Complete Payment' },
        { value: 'Installments Payment', label: 'Installments Payment' }
    ];

    const [selectedCourse, setSelectedCourse] = useState({});
    const [openCourseDialog, setOpenCourseDialog] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const PendingPaymentSchema = Yup.object().shape({
        paymentAttachmentFiles: Yup.array()
            .min(1, 'At least on payment attachment is required'),
        paymentType: Yup.string().required('At least one payment Type is required'),
    });

    const handleOpenCourseDialog = async (courseIndex) => {
        await setSelectedCourse(registeredCourses[courseIndex]);
        setOpenCourseDialog(true);
    }

    const handleCloseEditCourseDialog = async () => {
        await setSelectedCourse({});
        setOpenCourseDialog(false);
    }

    const defaultValues = {
        paymentAttachmentFiles: [],
        paymentType: '',
        additionalComment: ''
    }

    // Form for payment
    const methods = useForm({
        resolver: yupResolver(PendingPaymentSchema),
        defaultValues,
    })

    const {
        watch,
        setValue,
        handleSubmit
    } = methods;

    const values = watch();

    const { paymentAttachmentFiles, paymentType } = values

    // Payment Attachment Files ------------------------------------------------------------
    const handleDropFiles = useCallback(
        (acceptedFiles) => {
            const files = paymentAttachmentFiles || [];
            const newFiles = acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
            );
            setValue('paymentAttachmentFiles', [...files, ...newFiles]);
        },
        [setValue, paymentAttachmentFiles]
    );

    const handleRemoveFile = (inputFile) => {
        const filtered = paymentAttachmentFiles && paymentAttachmentFiles?.filter((file) => file !== inputFile);
        setValue('paymentAttachmentFiles', filtered);
    };

    const handleRemoveAllFiles = () => {
        setValue('paymentAttachmentFiles', []);
    };

    const onSubmitPayment = async (data) => {

        const updatedRequest = {
            request: {
                id: request.id,
                status: "PendingOA",
                eaStatus: "Complete",
                paymentStatus: "Complete",
                epRemark1: data.additionalComment,
                epRemark2: request.epRemark2,
                eaRemark: request.eaRemark,
                oaRemark: request.oaRemark,
                takenByEPId: user.id,
                takenByEAId: request.takenByEAId,
                takenByOAId: request.takenByOAId,
            }
        }

        setIsSubmitting(true)
        try {
            await axios.put(`${HOG_API}/api/PrivateRegistrationRequest/Put`, updatedRequest)
                .then(() => {
                    data.paymentAttachmentFiles.map((file) => {
                        const storagePaymentFilesRef = ref(storage, `payments/${request.id}/${file.name}`);
                        return uploadBytes(storagePaymentFilesRef, file)
                            .catch((error) => {
                                throw error;
                            });
                    })
                })
                .catch((error) => {
                    throw error;
                })
            setIsSubmitting(false);
            enqueueSnackbar('Successfully submitted the payment', { variant: 'success' });
            navigate('/course-registration/ep-request-status');
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
            setIsSubmitting(false);
        }
    }

    const onSubmit = async (data) => {
        try {
            setOpenConfirmDialog(true);
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
        }
    }

    const onError = (error) => {
        const errors = Object.values(error);
        enqueueSnackbar(errors[0].message, { variant: 'error' });
    }

    return (
        <>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={5}>
                        <Typography variant="h5">Status: Pending Payment</Typography>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <StudentSection courseType={request.courseType} students={students} />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <CourseSection
                            courses={registeredCourses}
                            onView={handleOpenCourseDialog}
                        />
                    </Grid>

                    <Grid item xs={12} md={12}>
                        <Grid item xs={12} md={12}>
                            <Card sx={{ p: 3 }}>
                                <Typography variant="h5"
                                    sx={{
                                        mb: 2,
                                        display: 'block',
                                    }}>Additional Files</Typography>
                                <RHFRadioGroup
                                    name="paymentType"
                                    options={PAYMENT_TYPE_OPTIONS}
                                    sx={{
                                        '& .MuiFormControlLabel-root': { mr: 4 },
                                    }}
                                    required
                                />
                                <Box
                                    rowGap={3}
                                    columnGap={2}
                                    display="grid"
                                    gridTemplateColumns={{
                                        xs: 'repeat(1, 1fr)',
                                        sm: 'repeat(1, 1fr)',
                                    }}
                                    sx={{ mt: 2 }}
                                >
                                    <RHFUploadPayment
                                        multiple
                                        thumbnail
                                        name="paymentAttachmentFiles"
                                        maxSize={3145728}
                                        onDrop={handleDropFiles}
                                        onRemove={handleRemoveFile}
                                        onRemoveAll={handleRemoveAllFiles}
                                    />
                                </Box>
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
                                <RHFTextField name="additionalComment" label="Comment for pending payment" />
                            </Box>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={12}>
                        <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                            <Button variant="contained" color="error" sx={{ height: '3em' }}>
                                Reject
                            </Button>
                            <Button type="submit" variant="contained" color="primary" sx={{ height: '3em' }}>
                                Submit
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>

                <Dialog fullWidth maxWidth="md" open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
                    <DialogTitle>
                        Submit the request?
                    </DialogTitle>
                    <DialogContent>
                        Once submitted, the request with payment attachments will be sent to Office Admin.
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" color="inherit" onClick={() => setOpenConfirmDialog(false)}>Cancel</Button>
                        <LoadingButton loading={isSubmitting} type="submit" variant="contained" color="primary" onClick={handleSubmit(onSubmitPayment)}>Submit</LoadingButton>
                    </DialogActions>
                </Dialog>
            </FormProvider>

            {Object.keys(selectedCourse).length > 0 && (
                <ViewCourseDialog
                    open={openCourseDialog}
                    onClose={handleCloseEditCourseDialog}
                    registeredCourse={selectedCourse}
                    courseType={request.courseType}
                />
            )}
        </>
    )
}


// ----------------------------------------------------------------------

PendingOAForm.propTypes = {
    request: PropTypes.object,
    students: PropTypes.array,
    registeredCourses: PropTypes.array,
    status: PropTypes.string,
}

export function PendingOAForm({ request, students, registeredCourses, status }) {

    const {
        id,
        eaStatus,
        paymentStatus,
        epRemark1,
        epRemark2
    } = request;

    const dataFetchedRef = useRef(false);

    // Firebase
    const firebaseApp = initializeApp(FIREBASE_API);
    const storage = getStorage(firebaseApp);
    const [filesURL, setFilesURL] = useState([]);

    const fetchPayments = async () => {
        const listRef = ref(storage, `payments/${id}`);
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
    }

    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;

        fetchPayments();
    }, [])

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

    if (filesURL.length === 0) {
        return <LoadingScreen />
    }

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
                    <Typography variant="h5">{`Status: ${status}`}</Typography>
                </Grid>
                <Grid item xs={12} md={12}>
                    <StudentSection courseType={request.courseType} students={students} />
                </Grid>
                <Grid item xs={12} md={12}>
                    <CourseSection
                        courses={registeredCourses}
                        onView={handleOpenCourseDialog}
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
                            <TextField fullWidth defaultValue={epRemark1} label="Comment for pending payment" disabled />
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
                <Grid item xs={12} md={5}>
                    <Typography variant="h5">{`Status: Rejected`}</Typography>
                </Grid>
                <Grid item xs={12} md={12}>
                    <StudentSection courseType={request.courseType} students={students} />
                </Grid>
                <Grid item xs={12} md={12}>
                    <CourseSection
                        courses={registeredCourses}
                        onView={handleOpenCourseDialog}
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

PendingEAForm.propTypes = {
    request: PropTypes.object,
    students: PropTypes.array,
    registeredCourses: PropTypes.array
}

export function PendingEAForm({ request, students, registeredCourses }) {

    const {
        epRemark1,
        courseType
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
                <Grid item xs={12} md={5}>
                    <Typography variant="h5">Status: Pending EA</Typography>
                </Grid>
                <Grid item xs={12} md={12}>
                    <StudentSection courseType={courseType} students={students} />
                </Grid>
                <Grid item xs={12} md={12}>
                    <CourseSection
                        courses={registeredCourses}
                        onView={handleOpenCourseDialog}
                    />
                </Grid>
                {!!epRemark1 && (
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
                                <TextField fullWidth defaultValue={epRemark1} label="Comment to Education Admin" disabled />
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