import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
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
    Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
// components
import Scrollbar from '../../../components/scrollbar/Scrollbar';
import FormProvider, { RHFUpload } from '../../../components/hook-form';

// ----------------------------------------------------------------------

RegistrationRequestDetail.propTypes = {
    request: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function RegistrationRequestDetail({ request }) {
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
        <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
                <Typography variant="h5">Status: {status}</Typography>
            </Grid>
            <Grid item xs={12} md={12}>
                <StudentSection courseType={courseType} students={students} />
            </Grid>
            <Grid item xs={12} md={12}>
                <CourseSection courseType={courseType} courses={courses} />
            </Grid>

            {status !== 'Pending EA' && (
                <Grid item xs={12} md={12}>
                    <AttachedPayment
                        courseType={courseType}
                        payment={attachedPayment}
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
}

export function CourseSection({ courseType, courses }) {

    // Schedule Dialog for group
    const [open, setOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState({});

    const handleSchedule = (course) => {
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

            {courseType === 'Group' ?
                courses.map((course, index) => (
                    <Paper key={index} elevation={2} sx={{ mt: 2, p: 3 }}>
                        <Grid container
                            direction="column"
                            spacing={2}
                            justifyContent="space-between"
                            alignItems="flex-start">
                            <Grid container item xs={12} md={12}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{course.course} ({courseType.toUpperCase()})</Typography>
                            </Grid>
                        </Grid>

                        <Grid container direction="row" spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth disabled label="Section" value={course.section} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth disabled label="Learning Method" value={course.method} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth disabled label="Start Date" value={course.startDate} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth disabled label="End Date" value={course.endDate} />
                            </Grid>
                        </Grid>

                        <Grid container direction="row" spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12} md={12}>
                                <TextField fullWidth disabled label="Subject" value={course.subjects.map(subject => subject.toUpperCase()).join(' | ')} />
                            </Grid>
                        </Grid>

                        <Grid container direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 1 }}>
                            <Grid item>
                                <Button variant="contained" size='large' color="inherit" sx={{ mr: 1, mb: 1 }} onClick={() => handleSchedule(course)}>
                                    <InfoIcon fontSize="medium" sx={{ mr: 0.5 }} /> Schedules
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                ))
                : courses.map((course, index) => (
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

                        <Grid container direction="row" spacing={1} sx={{ mt: 1, mb: 2 }}>
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

                        <Typography variant="inherit" sx={{ color: 'text.disabled' }}>Available Days</Typography>
                        <Grid container direction="row" spacing={1} sx={{ mt: 1 }}>
                            {course.availableDays.map((eachDay, index) => (
                                <Grid item xs={6} md={1.71} key={index}>
                                    <TextField label={eachDay.day} value={`${eachDay.from} - ${eachDay.to} hrs`} disabled />
                                </Grid>
                            ))}
                        </Grid>

                    </Paper>
                ))
            }

            <ScheduleDialog open={open} close={() => setOpen(false)} course={selectedCourse} />
        </Card>
    )
}

// ----------------------------------------------------------------------

ScheduleDialog.propTypes = {
    open: PropTypes.bool,
    close: PropTypes.func,
    course: PropTypes.object
}

export function ScheduleDialog({ open, close, course }) {

    return (
        <Dialog fullWidth maxWidth="lg" open={open} onClose={close}
            PaperProps={{
                sx: {
                    '&::-webkit-scrollbar': { display: 'none' }
                }
            }}>
            <Grid container spacing={1}>
                <Grid item xs={12} md={12}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pt: 2.5, px: 3 }}>
                        <Typography variant="h6"> Join Group </Typography>
                        <IconButton variant="h6" onClick={close}> <CloseIcon /> </IconButton>
                    </Stack>
                </Grid>

                <Grid item xs={12} md={5}>
                    <Stack justifyContent="flex-start" sx={{ py: 1, pl: 3, pr: 1 }} spacing={2}>
                        <Typography variant="h6"> Course Information </Typography>
                        <TextField
                            variant="outlined"
                            value={course.name}
                            label="Course"
                            disabled
                        />
                        <TextField
                            variant="outlined"
                            id="sectionNo"
                            value={course.section}
                            label="Section"
                            disabled
                        />
                        <Stack direction="row" justifyContent="flex-start" spacing={2}>
                            <TextField
                                variant="outlined"
                                id="level"
                                value={course.level}
                                label="Level"
                                disabled
                            />
                            <TextField
                                variant="outlined"
                                value={course.method}
                                label="Learning Method"
                                disabled
                            />
                        </Stack>
                        <Stack direction="row" justifyContent="flex-start" spacing={2}>
                            <TextField
                                variant="outlined"
                                value={course.startDate}
                                label="Start Date"
                                disabled
                            />
                            <TextField
                                variant="outlined"
                                value={course.endDate}
                                label="End Date"
                                disabled
                            />
                        </Stack>

                        <Stack spacing={1} sx={{ pb: 1 }}>
                            <Typography variant="subtitle1"> Selected subjects </Typography>
                            <Stack direction="row" spacing={2}>
                                {!!course.subjects && course.subjects.map(eachSubject => (
                                    <FormControlLabel
                                        key={eachSubject}
                                        control={
                                            <Checkbox
                                                disabled
                                                defaultChecked
                                            />
                                        }
                                        label={eachSubject}
                                    />
                                ))}
                            </Stack>
                        </Stack>
                    </Stack>

                </Grid>
                <Grid item xs={12} md={7}>
                    <Scrollbar sx={{ maxHeight: 80 * 5 }}>
                        <Stack justifyContent="flex-start" sx={{ py: 1, px: 3 }} >
                            <Typography variant="h6" sx={{ mb: 2 }}> Classes & Schedules </Typography>
                            <Divider />
                            {!!course.subjects && course.subjects.map((subject, index) => (
                                <Accordion key={index}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                    >
                                        <Typography variant="body2">{course.course} {subject.toUpperCase()} - 20 Hours</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                            malesuada lacus ex, sit amet blandit leo lobortis eget.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                            malesuada lacus ex, sit amet blandit leo lobortis eget.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                            malesuada lacus ex, sit amet blandit leo lobortis eget.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                            malesuada lacus ex, sit amet blandit leo lobortis eget.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                            malesuada lacus ex, sit amet blandit leo lobortis eget.
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            ))
                            }
                        </Stack>
                    </Scrollbar>
                </Grid>
            </Grid>
        </Dialog>
    )
}

// ----------------------------------------------------------------------

AttachedPayment.propTypes = {
    courseType: PropTypes.string,
    payment: PropTypes.array,
    status: PropTypes.string,
}

export function AttachedPayment({ courseType, payment, status }) {

    // Form for payment
    const methods = useForm({
        paymentAttachmentFiles: payment || []
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
                    <Box
                        rowGap={3}
                        columnGap={2}
                        display="grid"
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(1, 1fr)',
                        }}
                    />
                    {courseType !== 'Group' && status === 'Pending Payment' && (
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
                    {status === 'Completed' || status === 'Rejected' && (
                        <RHFUpload
                            multiple
                            thumbnail
                            disabled
                            name="paymentAttachmentFiles"
                            maxSize={3145728}
                        />
                    )}
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