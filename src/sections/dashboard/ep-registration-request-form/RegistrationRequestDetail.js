import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import moment from 'moment';
// firebase
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll, getMetadata, deleteObject } from "firebase/storage"
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
    DialogContent,
    Radio,
    RadioGroup
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
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
import { ViewCourseDialog } from '../ViewCourseDialog';

// ----------------------------------------------------------------------

RegistrationRequestDetail.propTypes = {
    currentRequest: PropTypes.object,
    educationPlannerId: PropTypes.number
};

// ----------------------------------------------------------------------

export default function RegistrationRequestDetail({ currentRequest, educationPlannerId }) {

    const dataFetchedRef = useRef(false);

    const [selectedCourse, setSelectedCourse] = useState({});
    const [openCourseDialog, setOpenCourseDialog] = useState(false);
    const [schedules, setSchedules] = useState([]);
    const [createdByEA, setCreatedByEA] = useState({});

    const {
        request,
        information,
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

    const fetchEA = async (EAId) => {
        axios.get(`${HOG_API}/api/Staff/Get/${EAId}`)
            .then((res) => setCreatedByEA(res.data.data))
            .catch((error) => console.error(error))
    }

    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;
        axios.get(`${HOG_API}/api/Schedule/Get/${request.id}`)
            .then((res) => setSchedules(res.data.data))
            .catch((error) => console.error(error))

        if (currentRequest.request.takenByEAId !== 0) {
            fetchEA(currentRequest.request.takenByEAId)
        }
    }, [])

    if (status === 'Pending EA') {
        return <PendingEAForm
            request={request}
            students={students}
            registeredCourses={information}
            status={status}
        />
    }

    if (status === 'Pending Payment') {
        return <PendingEPForm
            request={request}
            students={students}
            registeredCourses={information}
            schedules={schedules}
            hasSchedule={!!schedules.length}
            educationPlannerId={educationPlannerId}
            isEdit={request.paymentStatus === 'Incomplete'}
            createdByEA={createdByEA}
        />
    }

    if (status === 'Pending OA' || status === 'Complete') {
        return <PendingOAForm
            request={request}
            students={students}
            registeredCourses={information}
            schedules={schedules}
            hasSchedule={!!schedules.length}
            createdByEA={createdByEA}
        />
    }

    if (status === 'Reject') {
        return <RejectForm
            request={request}
            students={students}
            registeredCourses={information}
            schedules={schedules}
            hasSchedule={!!schedules.length}
            createdByEA={createdByEA}
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
    createdByEA: PropTypes.object
}

export function CourseSection({ courses, onView, schedules, hasSchedule, createdByEA }) {

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
                {!!createdByEA && (
                    <Grid item xs={6} md={6}>
                        <Stack direction="row" justifyContent="end" sx={{ mr: 1 }}>
                            <Typography variant="subtitle2">{`Scheduled by: ${createdByEA.fName} (${createdByEA.nickname})`}</Typography>
                        </Stack>
                    </Grid>
                )}
            </Grid>
            {courses.map((course, index) => (
                <ViewCourseCard key={index} courseIndex={index} courseInfo={course} onView={onView} hasSchedule={hasSchedule} />
            ))}
        </Card>
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
    registeredCourses: PropTypes.array,
    schedules: PropTypes.array,
    hasSchedule: PropTypes.bool,
    educationPlannerId: PropTypes.number,
    isEdit: PropTypes.bool,
    createdByEA: PropTypes.object
}

export function PendingEPForm({ request, students, registeredCourses, schedules, hasSchedule, educationPlannerId, isEdit, createdByEA }) {
    const { user } = useAuthContext();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

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
    const [currentSchedule, setCurrentSchedule] = useState({});

    const [openCourseDialog, setOpenCourseDialog] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [openRejectDialog, setOpenRejectDialog] = useState(false);
    const [rejectedReasonMessage, setRejectedReasonMessage] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);

    const PendingPaymentSchema = Yup.object().shape({
        paymentAttachmentFiles: Yup.array()
            .min(1, 'At least on payment attachment is required'),
        paymentType: Yup.string().required('At least one payment Type is required'),
    });

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
        setOpenCourseDialog(false);
    }

    const [loadPayment, setLoadPayment] = useState([]);

    const defaultValues = {
        paymentAttachmentFiles: (isEdit ? loadPayment : []),
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
        handleSubmit,
        getValues
    } = methods;

    const values = watch();

    const { paymentAttachmentFiles, paymentType } = values

    const dataFetchedRef = useRef(false);

    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;

        if (isEdit) {
            axios.get(`${HOG_API}/api/Payment/GetPrivatePayment/${request.id}`)
                .then((res) => {
                    setValue('paymentType', res.data.data[0].paymentType)
                })
                .catch((error) => console.error(error))

            const listRef = ref(storage, `payments/${request.id}`);
            listAll(listRef)
                .then((res) => {
                    res.items.map((itemRef) => (
                        getMetadata(itemRef)
                            .then((metadata) => {
                                getDownloadURL(itemRef)
                                    .then((url) => {
                                        setValue('paymentAttachmentFiles', [...getValues().paymentAttachmentFiles, { name: metadata.name, type: metadata.contentType, ref: itemRef, preview: url }])
                                    })
                                    .catch((error) => console.error(error));
                            })
                            .catch((error) => console.error(error))
                    )
                    )
                })
        }
    }, [])

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
                epRemark1: request.epRemark1,
                epRemark2: data.additionalComment,
                eaRemark: request.eaRemark,
                oaRemark: request.oaRemark,
                takenByEPId: user.id,
                takenByEAId: request.takenByEAId,
                takenByOAId: request.takenByOAId,
            }
        }

        setIsSubmitting(true)
        try {

            if (isEdit) {
                const namePaymentFiles = data.paymentAttachmentFiles.map((file) => ({ file: file.name }))

                await axios.get(`${HOG_API}/api/Payment/GetPrivatePayment/${request.id}`)
                    .then((res) => {
                        const payments = res.data.data[0].payment

                        const currentPaymentFiles = data.paymentAttachmentFiles.filter((file) => file.ref !== undefined)
                        // console.log('currentPaymentFiles', currentPaymentFiles)

                        // Delete dropped files
                        const filesRef = ref(storage, `payments/${request.id}`);
                        if (currentPaymentFiles.length === 0) {
                            listAll(filesRef)
                                .then((res) => {
                                    res.items.forEach((itemRef) => {
                                        deleteObject(itemRef)
                                    });
                                })
                                .catch((error) => {
                                    throw error;
                                });
                        } else {
                            listAll(filesRef)
                                .then((res) => {
                                    res.items.forEach((itemRef) => {
                                        if (currentPaymentFiles.some((file) => file.ref._location.path_ === itemRef._location.path_)) {
                                            return null;
                                        }
                                        return deleteObject(itemRef)
                                    });
                                })
                                .catch((error) => {
                                    throw error;
                                });
                        }
                    })
                    .catch((error) => console.error(error))

                await Promise.all(data.paymentAttachmentFiles.map(async file => {
                    const fileRef = ref(storage, `payments/${request.id}/${file.name}`)
                    return uploadBytes(fileRef, file)
                        .catch((error) => {
                            throw error;
                        });
                }))

                // console.log('data attach name', namePaymentFiles)
                // console.log('data attach', data.paymentAttachmentFiles)

                await axios.put(`${HOG_API}/api/Payment/Put`, {
                    privateRegReqId: request.id,
                    payment: namePaymentFiles,
                    paymentType
                })
                    .catch((error) => {
                        throw error;
                    })

                await axios.put(`${HOG_API}/api/PrivateRegistrationRequest/Put`, updatedRequest)
                    .catch((error) => {
                        throw error;
                    })

            } else {
                await axios.put(`${HOG_API}/api/PrivateRegistrationRequest/Put`, updatedRequest)
                    .catch((error) => {
                        throw error;
                    })

                await Promise.all(data.paymentAttachmentFiles.map(async file => {
                    const fileRef = ref(storage, `payments/${request.id}/${file.name}`)
                    return uploadBytes(fileRef, file)
                        .catch((error) => {
                            throw error;
                        });
                }))

                const namePaymentFiles = data.paymentAttachmentFiles.map((file) => ({ file: file.name }))
                await axios.post(`${HOG_API}/api/Payment/Post`, {
                    privateRegReqId: request.id,
                    payment: namePaymentFiles,
                    paymentType
                })
            }
            setIsSubmitting(false);
            enqueueSnackbar('Successfully submitted the payment', { variant: 'success' });
            navigate('/course-registration/ep-request-status');
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
            setIsSubmitting(false);
        }
    }

    const onReject = async () => {
        if (rejectedReasonMessage === '') {
            enqueueSnackbar('Please enter a reason for rejection!', { variant: 'error' });
        } else {
            setIsSubmitting(true);
            try {
                const courseIds = schedules.map((eachSchedule) => eachSchedule.course.id)
                await courseIds.forEach((id) => {
                    axios.delete(`${HOG_API}/api/Schedule/SoftDelete/${id}`)
                        // .then((res) => console.log(res))
                        .catch((error) => {
                            throw error;
                        })
                })

                await axios.put(`${HOG_API}/api/PrivateRegistrationRequest/Put`, {
                    request: {
                        id: request.id,
                        status: "Reject",
                        eaStatus: "Complete",
                        paymentStatus: "None",
                        epRemark1: rejectedReasonMessage,
                        epRemark2: request.epRemark2,
                        eaRemark: request.eaRemark,
                        oaRemark: request.oaRemark,
                        takenByEPId: educationPlannerId,
                        takenByEAId: request.takenByEAId,
                        takenByOAId: request.takenByOAId,
                    }
                })
                    .catch((error) => {
                        throw error;
                    })

                setIsSubmitting(false);
                enqueueSnackbar('The request is successfully rejected', { variant: 'success' });
                navigate('/course-registration/ep-request-status');
            } catch (error) {
                console.error(error);
                enqueueSnackbar(error.message, { variant: 'error' });
                setIsSubmitting(false);
            }
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
                            createdByEA={createdByEA}
                            hasSchedule
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

                    {isEdit && (
                        <Grid item xs={12} md={12}>
                            <Card sx={{ p: 3 }}>
                                <Typography variant="h5"
                                    sx={{
                                        mb: 2,
                                        display: 'block',
                                    }}
                                >
                                    Remark from Office Admin
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
                                    <TextField fullWidth label="Comment from Office Admin" defaultValue={request.oaRemark} disabled />
                                </Box>
                            </Card>
                        </Grid>
                    )}

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
                                <RHFTextField name="additionalComment" label="Comment to Office Admin" />
                            </Box>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={12}>
                        <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                            <Button variant="contained" color="error" sx={{ height: '3em' }} onClick={() => setOpenRejectDialog(true)}>
                                Reject
                            </Button>
                            <Button type="submit" variant="contained" color="primary" sx={{ height: '3em' }}>
                                Submit
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>

                <Dialog fullWidth maxWidth="sm" open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
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

                <Dialog
                    open={openRejectDialog}
                    onClose={() => setOpenRejectDialog(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>
                        <Stack direction="row" alignItems="center" justifyContent="flex-start">
                            {/* <CheckCircleOutlineIcon fontSize="large" sx={{ mr: 1 }} /> */}
                            <Typography variant="h5">Reject the request?</Typography>
                        </Stack>
                    </DialogTitle>
                    <DialogContent>
                        <TextField fullWidth name="rejectedReason" label="Reason" multiline rows={3} sx={{ my: 1 }} onChange={(event) => setRejectedReasonMessage(event.target.value)} required />
                    </DialogContent>
                    <DialogActions>
                        <Button color="inherit" variant="outlined" onClick={() => setOpenRejectDialog(false)}>Cancel</Button>
                        <LoadingButton variant="contained" loading={isSubmitting} onClick={onReject} color="error">
                            Reject
                        </LoadingButton>
                    </DialogActions>
                </Dialog>
            </FormProvider>

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

PendingOAForm.propTypes = {
    request: PropTypes.object,
    students: PropTypes.array,
    registeredCourses: PropTypes.array,
    schedules: PropTypes.array,
    hasSchedule: PropTypes.bool,
    createdByEA: PropTypes.object
}

export function PendingOAForm({ request, students, registeredCourses, schedules, hasSchedule, createdByEA }) {

    const {
        id,
        eaStatus,
        paymentStatus,
        epRemark1,
        epRemark2
    } = request;

    const dataFetchedRef = useRef(false);

    const [paymentType, setPaymentType] = useState("");

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

            await axios.get(`${HOG_API}/api/Payment/GetPrivatePayment/${request.id}`)
                .then((res) => {
                    setPaymentType(res.data.data[0].paymentType)
                })
                .catch((error) => console.error(error))

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
                <Grid item xs={12} md={5}>
                    <Typography variant="h5">{`Status: Pending OA`}</Typography>
                </Grid>
                <Grid item xs={12} md={12}>
                    <StudentSection courseType={request.courseType} students={students} />
                </Grid>
                <Grid item xs={12} md={12}>
                    <CourseSection
                        courses={registeredCourses}
                        onView={handleOpenCourseDialog}
                        hasSchedule={hasSchedule}
                        createdByEA={createdByEA}
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
                            <TextField fullWidth defaultValue={epRemark2} label="Comment for Office Admin" disabled />
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            {Object.keys(selectedCourse).length > 0 && currentSchedule === undefined && (
                <ViewCourseDialog
                    open={openCourseDialog}
                    onClose={handleCloseEditCourseDialog}
                    registeredCourse={selectedCourse}
                    courseType={request.courseType}
                    hasSchedule={false}
                />
            )}

            {Object.keys(selectedCourse).length > 0 && currentSchedule !== undefined && Object.keys(currentSchedule).length > 0 && (
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
    registeredCourses: PropTypes.array,
    schedules: PropTypes.array,
    hasSchedule: PropTypes.bool,
    createdByEA: PropTypes.object,
}

export function RejectForm({ request, students, registeredCourses, schedules, hasSchedule, createdByEA }) {

    const {
        id,
        eaStatus,
        paymentStatus,
        epRemark1,
        epRemark2,
        eaRemark
    } = request;

    // console.log('sc',schedules);

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
                        hasSchedule={hasSchedule}
                        createdByEA={createdByEA}
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
                                <TextField fullWidth defaultValue={eaRemark} label="Comment by Education Admin" disabled />
                            </Box>
                        </Card>
                    </Grid>
                )}

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
                                <TextField fullWidth defaultValue={epRemark1} label="Comment by Education Planner" disabled />
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
                                <TextField fullWidth defaultValue={epRemark2} label="Comment By Education Planner" disabled />
                            </Box>
                        </Card>
                    </Grid>
                )}
            </Grid>

            {Object.keys(selectedCourse).length > 0 && schedules.length === 0 && (
                <ViewCourseDialog
                    open={openCourseDialog}
                    onClose={handleCloseEditCourseDialog}
                    registeredCourse={selectedCourse}
                    courseType={request.courseType}
                    schedules={currentSchedule}
                    hasSchedule={hasSchedule}
                />
            )}

            {Object.keys(selectedCourse).length > 0 && currentSchedule !== undefined && Object.keys(currentSchedule).length > 0 && (
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