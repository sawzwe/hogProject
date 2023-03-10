import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
// form
import { useForm } from 'react-hook-form';
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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
// components
import Scrollbar from '../../../components/scrollbar/Scrollbar';
import FormProvider, { RHFUpload, RHFRadioGroup } from '../../../components/hook-form';
import ViewCourseCard from './ViewCourseCard';
//
import { fDate } from '../../../utils/formatTime';

// ----------------------------------------------------------------------

RegistrationRequestDetail.propTypes = {
    mockRequest: PropTypes.object,
    currentRequest: PropTypes.object
};

// ----------------------------------------------------------------------

export default function RegistrationRequestDetail({ mockRequest, currentRequest }) {

    const [selectedCourse, setSelectedCourse] = useState({});
    const [openCourseDialog, setOpenCourseDialog] = useState(false);

    if (!mockRequest) {
        return null;
    }

    const {
        regRequestId,
        courseType,
        courses,
        attachedPayment,
        paymentType,
        additionalComment,
        rejectedReason,
    } = mockRequest;

    const {
        request,
        information,
        schedules,
        students
    } = currentRequest;

    const status = (request.status === 'PendingEA' ? 'Pending EA' : request.status === 'PendingEP' ? 'Pending Payment' : request.status === 'PendingOA' && 'Pending OA')

    const handleOpenCourseDialog = async (courseIndex) => {
        await setSelectedCourse(information[courseIndex]);
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
                    <Typography variant="h5">Status: {status}</Typography>
                </Grid>
                <Grid item xs={12} md={12}>
                    <StudentSection courseType={courseType} students={students} />
                </Grid>
                <Grid item xs={12} md={12}>
                    <CourseSection
                        courseType={courseType}
                        courses={information}
                        schedules={schedules}
                        onView={handleOpenCourseDialog}
                    />
                </Grid>

                {status !== 'Pending EA' && (
                    <Grid item xs={12} md={12}>
                        <AttachedPayment
                            courseType={courseType}
                            payment={attachedPayment}
                            paymentType={paymentType}
                            status={status} />
                    </Grid>
                )}

                <Grid item xs={12} md={12}>
                    <AdditionalCommentSection message={additionalComment} />
                </Grid>

                {status === 'Rejected' && (
                    <Grid item xs={12} md={12}>
                        <AdditionalCommentSection message={rejectedReason} status={status} />
                    </Grid>
                )}

                <Grid item xs={12} md={12}>
                    <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                        {status === 'Pending Payment' && (
                            <>
                                <LoadingButton variant="contained" color="error" sx={{ height: '3em' }}>
                                    Reject
                                </LoadingButton>
                                <LoadingButton variant="contained" color="primary" sx={{ height: '3em' }}>
                                    Submit
                                </LoadingButton>
                            </>
                        )}
                    </Stack>
                </Grid>
            </Grid>

            {Object.keys(selectedCourse).length > 0 && (
                <ViewCourseDialog
                    open={openCourseDialog}
                    onClose={handleCloseEditCourseDialog}
                    status={status}
                    registeredCourse={selectedCourse}
                />
            )}
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
                        value={`${student.fullName} (${student.nickname})`}
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
    onView: PropTypes.func,
    schedules: PropTypes.array
}

export function CourseSection({ courseType, courses, onView, schedules }) {

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

AttachedPayment.propTypes = {
    courseType: PropTypes.string,
    payment: PropTypes.array,
    paymentType: PropTypes.string,
    status: PropTypes.string,
}

export function AttachedPayment({ courseType, payment, paymentType, status }) {

    const PAYMENT_TYPE_OPTIONS = [
        { value: 'Complete Payment', label: 'Complete Payment' },
        { value: 'Installments Payment', label: 'Installments Payment' }
    ];

    // Form for payment
    const methods = useForm({
        defaultValues: {
            paymentAttachmentFiles: payment || [],
            paymentType: paymentType || '',
        }
    })

    const {
        watch,
        setValue,
    } = methods;

    const values = watch();

    const { paymentAttachmentFiles } = values

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

    return (
        <FormProvider methods={methods}>
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
                        disabled={(status !== 'Pending Payment')}
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
                        {status === 'Pending Payment' && (
                            <RHFUpload
                                multiple
                                thumbnail
                                name="paymentAttachmentFiles"
                                maxSize={3145728}
                                onDrop={handleDropFiles}
                                onRemove={handleRemoveFile}
                                onRemoveAll={handleRemoveAllFiles}
                            />
                        )}
                        {status !== 'Pending EA' && status !== 'Pending Payment' && (
                            <RHFUpload
                                multiple
                                thumbnail
                                disabled
                                name="paymentAttachmentFiles"
                                maxSize={3145728}
                            />
                        )}
                    </Box>
                </Card>
            </Grid>
        </FormProvider>
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
                }}
            >
                {status !== 'Reject' ? 'Additional Comment' : 'Rejected Reason'}
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
                <TextField disabled value={message} />
            </Box>
        </Card>
    )
}

// ----------------------------------------------------------------------

ViewCourseDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    status: PropTypes.string,
    registeredCourse: PropTypes.object
}

export function ViewCourseDialog({ open, onClose, status, registeredCourse }) {
    return (

        registeredCourse.schedules === undefined ? (
            <UnscheduledCourseDialog open={open} onClose={onClose} registeredCourse={registeredCourse} />
        ) : (
            <ScheduledCourseDialog open={open} onClose={onClose} registeredCourse={registeredCourse} />
        )
        //     status === 'Pending EA' && (
        //     <UnscheduledCourseDialog open={open} onClose={onClose} registeredCourse={registeredCourse} />
        // )

        // status === 'Pending Payment' || status === 'PendingOA' || status === 'Complete' || status === 'Reject' 
    )
}

// ----------------------------------------------------------------------

UnscheduledCourseDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    registeredCourse: PropTypes.object
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
                                {/* {preferredDays.map((day, index) => (
                                    <Grid key={index} item xs={12} md={6}>
                                        <PreferredDay day={day} />
                                    </Grid>
                                ))} */}
                                {/* <Grid item xs={12} md={6}>
                                        <PreferredDay day='friday' />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <PreferredDay day='tuesday' />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <PreferredDay day='saturday' />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <PreferredDay day='wednesday' />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <PreferredDay day='sunday' />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <PreferredDay day='thursday' />
                                    </Grid> */}
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
    registeredCourse: PropTypes.object
}

export function ScheduledCourseDialog({ open, onClose, registeredCourse }) {

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
                                    value="Private"
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

    console.log(day)

    return (
        <Stack direction="row" spacing={2} sx={{ mt: 1 }} justifyContent="flex-start" alignItems="center" >
            <Box sx={{ width: 50 }}>
                <FormGroup>
                    <FormControlLabel disabled control={<Checkbox checked={!!day.fromTime} />} label={day.day.charAt(0).toUpperCase() + day.day.slice(1, 3)} />
                </FormGroup>
            </Box>
            <TextField size="small" fullWidth defaultValue={day.fromTime} disabled />
            {/* <RHFSelect
                name={`${day}.fromTime`}
                label="From"
                size="small"
                disabled
                SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
            >
                {TIME_OPTIONS.map((time) => (
                    <MenuItem
                        key={time}
                        value={time}
                        autoFocus
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
                        {time}
                    </MenuItem>
                ))}
            </RHFSelect> */}

            <Typography variant="inherit" > - </Typography>

            <TextField size="small" fullWidth defaultValue={day.toTime} disabled />

            {/* <RHFSelect
                name={`${day}.toTime`}
                label="To"
                size="small"
                disabled
                SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
            >
                {TIME_OPTIONS.map((time) => {
                    const toTime = moment(time, "HH:mm")
                    const fromTime = moment(values[day].fromTime, "HH:mm")
                    if (fromTime.isBefore(toTime)) {
                        return (
                            <MenuItem
                                key={time}
                                value={time}
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
                                {time}
                            </MenuItem>
                        )
                    }
                    return null;
                })}
            </RHFSelect> */}
        </Stack>
    )
}