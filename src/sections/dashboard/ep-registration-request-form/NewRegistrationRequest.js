import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Typography, MenuItem, Grid, Stack, Card, Box, Dialog, Button, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// components
import FormProvider, { RHFSelect, RHFUpload, RHFTextField, RHFRadioGroup } from '../../../components/hook-form';
import { AddStudentForm, AddCourseForm } from '.';

// ----------------------------------------------------------------------

const COURSE_TYPE_OPTIONS = [
    { id: 1, name: 'Group' },
    { id: 2, name: 'Private' },
    { id: 3, name: 'Semi Private' }
];

const PAYMENT_TYPE_OPTIONS = [
    { value: 'Complete Payment', label: 'Complete Payment' },
    { value: 'Installments Payment', label: 'Installments Payment' }
];

const MAX_STUDENTS_PER_REQUEST = 1;

const MAX_STUDENTS_PER_REQUEST_SEMI_PRIVATE = 15;

// ----------------------------------------------------------------------

NewViewRegistrationRequest.propTypes = {
    isView: PropTypes.bool,
    currentRequest: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function NewViewRegistrationRequest({ isView = false, currentRequest }) {

    const NewRequestSchema = Yup.object().shape({
        courseType: Yup.string().required('Course type is required'),
        students: Yup.array().required('At least one student is required'),
        courses: Yup.array().required('At least one course is required'),
        paymentAttachmentFiles: Yup.array().required('At least one payment attachment file is required'),
        paymentType: Yup.string().required('Payment type is required'),
        additionalComment: Yup.string()
    });

    const defaultValues = useMemo(
        () => ({
            courseType: currentRequest?.courseType || 'Group',
            students: currentRequest?.students || [],
            courses: currentRequest?.courses || [],
            groupSelectedSubjects: [],
            paymentAttachmentFiles: currentRequest?.paymentAttachmentFiles || [],
            paymentType: '',
            additionalComment: currentRequest?.additionalComment || '',
            // Private or Semi Private
            newCourseType: 'Existing Course',
            section: '',
            newCourse: '',
            newSubject: '',
            newLevel: '',
            newHoursPerClass: '2',
            newHour: '',
            newLearningMethod: 'Onsite',
            newStartDate: new Date(),
            newEndDate: new Date(),
            newAvailableDays: [],
            monday: false,
            mondayFromTime: '',
            mondayToTime: '',
            tuesday: false,
            tuesdayFromTime: '',
            tuesdayToTime: '',
            wednesday: false,
            wednesdayFromTime: '',
            wednesdayToTime: '',
            thursday: false,
            thursdayFromTime: '',
            thursdayToTime: '',
            friday: false,
            fridayFromTime: '',
            fridayToTime: '',
            saturday: false,
            saturdayFromTime: '',
            saturdayToTime: '',
            sunday: false,
            sundayFromTime: '',
            sundayToTime: '',
        }),
        [currentRequest]
    );

    const methods = useForm({
        resolver: yupResolver(NewRequestSchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const values = watch();

    const { courseType, students, courses, paymentAttachmentFiles } = values

    useEffect(() => {
        if (isView && currentRequest) {
            reset(defaultValues);
        }
        if (!isView) {
            reset(defaultValues);
        }
    }, [isView, currentRequest]);

    const onSubmit = async (data) => {
        try {
            console.log('DATA', JSON.stringify(data, null, 2));
        } catch (error) {
            console.error(error);
        }
    };

    // Handle Change Course Type ---------------------------------------------------------

    const handleChangeCourseType = (event) => {
        reset(defaultValues);
        setValue('courseType', event.target.value);
    }

    // Student Add/Remove -----------------------------------------------------------------
    const handleAddStudent = useCallback(
        (student) => {
            setValue('students', [...students, student]);
        },
        [setValue, students]
    );

    const handleRemoveStudent = (studentId) => {
        const filtered = students?.filter((student) => student.id !== studentId);
        setValue('students', filtered);
    };

    // Course Add/Remove -----------------------------------------------------------------
    const handleAddCourse = useCallback(
        (addedCourse) => {
            setValue('courses', [...courses, addedCourse]);
        },
        [setValue, courses]
    );

    const handleRemoveCourse = (courseName) => {
        const filtered = courses?.filter((course) => course.name !== courseName);
        setValue('courses', filtered);
    }

    const handleRemovePrivateCourse = (course, subject, level) => {
        const filtered = courses?.filter((course) => (course.name !== course && course.subject !== subject && course.level !== level));
        setValue('courses', filtered);
    }

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

    // Submit Dialog Open/Close ----------------------------------------------------------
    const [submitDialogOpen, setSubmitDialogopen] = useState(false);

    const handleClickSubmitOpen = (event) => {
        event.preventDefault()
        setSubmitDialogopen(true);
    };

    const handleSubmitClose = () => {
        setSubmitDialogopen(false);
    };

    return (
        <FormProvider methods={methods} onSubmit={(event) => { handleClickSubmitOpen(event) }}>
            <Grid container spacing={3}>
                    <Grid container item xs={12} md={5}>
                        <RHFSelect
                            name="courseType"
                            label="Course Type"
                            SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                            onChange={handleChangeCourseType}>
                            {COURSE_TYPE_OPTIONS.map((option) => (
                                <MenuItem
                                    key={option.id}
                                    value={option.name}
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
                                    {option.name}
                                </MenuItem>
                            ))}
                        </RHFSelect>
                    </Grid>
                    <Grid container item xs={12} md={5}>
                        {courseType === 'Semi Private' && (
                            <RHFTextField
                                name="section"
                                label="Section"
                                required
                            />
                        )}
                    </Grid>

                {courseType &&
                    <>
                        {/* Add Student */}
                        <Grid item xs={12} md={12}>
                            <AddStudentForm
                                studentLimit={courseType === 'Semi Private' ? MAX_STUDENTS_PER_REQUEST_SEMI_PRIVATE : MAX_STUDENTS_PER_REQUEST}
                                onAddStudent={handleAddStudent}
                                onRemoveStudent={handleRemoveStudent}
                            />
                        </Grid>

                        {/* Add Course */}
                        <Grid item xs={12} md={12}>
                            <AddCourseForm
                                onAddCourse={handleAddCourse}
                                onRemoveCourse={handleRemoveCourse}
                                onRemovePrivateCourse={handleRemovePrivateCourse}
                            />
                        </Grid>

                        {courseType === "Group" &&
                            <>
                                {/* Payment Attachment */}
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
                                            <RHFUpload
                                                multiple
                                                thumbnail
                                                name="paymentAttachmentFiles"
                                                maxSize={3145728}
                                                onDrop={handleDropFiles}
                                                onRemove={handleRemoveFile}
                                                onRemoveAll={handleRemoveAllFiles}
                                                onUpload={() => console.log('ON UPLOAD')}
                                            />
                                        </Box>
                                    </Card>
                                </Grid>
                            </>
                        }

                        {/* Additional Comment */}
                        <Grid item xs={12} md={12}>
                            <Card sx={{ p: 3 }}>
                                <Typography variant="h5"
                                    sx={{
                                        mb: 2,
                                        display: 'block',
                                    }}>Additional Comment</Typography>
                                <Box
                                    rowGap={3}
                                    columnGap={2}
                                    display="grid"
                                    gridTemplateColumns={{
                                        xs: 'repeat(1, 1fr)',
                                        sm: 'repeat(1, 1fr)',
                                    }}
                                >
                                    <RHFTextField name="additionalComment" label="Add comment here" />
                                </Box>
                            </Card>
                        </Grid>

                        {/* Submit Button */}
                        <Grid item xs={12} md={12}>
                            <Stack direction="row" justifyContent="flex-end" alignItems="center">
                                <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ height: '3em' }}>
                                    Send request
                                </LoadingButton>
                            </Stack>
                        </Grid>
                    </>
                }

            </Grid>

            <Dialog
                open={submitDialogOpen}
                onClose={handleSubmitClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    <Stack direction="row" alignItems="center" justifyContent="flex-start">
                        <CheckCircleOutlineIcon fontSize="large" sx={{ mr: 1 }} />
                        <Typography variant="h5">{"Submit this request?"}</Typography>
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {courseType === 'Group' ?
                            'If you submit, this request will be sent to Office Admin for payment checking.' :
                            'If you submit, this request will be sent to Education Admin for scheduling.'
                        }
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="inherit" variant="outlined" onClick={handleSubmitClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit(onSubmit)} autoFocus>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </FormProvider>
    )

}