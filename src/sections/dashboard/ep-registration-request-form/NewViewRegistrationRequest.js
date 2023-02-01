import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import * as Yup from 'yup';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Container, Typography, MenuItem, Grid, Stack, Card, Box } from '@mui/material';
// components
import { useSettingsContext } from '../../../components/settings';
import FormProvider, { RHFSelect, RHFUpload, RHFTextField } from '../../../components/hook-form';
import { AddStudentForm, AddCourseForm } from '.';

// ----------------------------------------------------------------------

const COURSE_TYPE_OPTIONS = [
    { id: 1, name: 'Group' },
    { id: 2, name: 'Private' },
    { id: 3, name: 'Semi Private' }
]

const MAX_STUDENTS_PER_REQUEST = 1

const MAX_STUDENTS_PER_REQUEST_SEMI_PRIVATE = 15

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
        additionalComment: Yup.string()
    });

    const defaultValues = useMemo(
        () => ({
            courseType: currentRequest?.courseType || 'Group',
            students: currentRequest?.students || [],
            courses: currentRequest?.courses || [],
            selectedSubjects: [], // Group
            paymentAttachmentFiles: currentRequest?.paymentAttachmentFiles || [],
            additionalComment: currentRequest?.additionalComment || '',
            // Private or Semi Private
            selectedPrivateCourse: currentRequest?.selectedPrivateCourse || '',
            selectedPrivateSubject: currentRequest?.selectedPrivateSubject || '', 
            selectedPrivateLevel: currentRequest?.selectedPrivateLevel || '', 
            selectedHour: currentRequest?.selectedHour || '',
            selectedLearningMethod: currentRequest?.selectedLearningMethod || ''

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
        control,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const values = watch();

    const { courseType, students, courses, paymentAttachmentFiles, comment } = values

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

    const handleRemoveCourse = (courseId) => {
        const filtered = courses?.filter((course) => course.id !== courseId);
        setValue('courses', filtered);
    }

    // Payment Attachment Files -----------------------------------------------------------------
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

    // Reset values when form type changed --------------------------------------------------------
    useEffect(() => {
        reset(defaultValues);
        setValue('courseType', courseType);
    }, [courseType])

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
                    <RHFSelect
                        name="courseType"
                        label="Course Type"
                        SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}>
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
                                        <Box
                                            rowGap={3}
                                            columnGap={2}
                                            display="grid"
                                            gridTemplateColumns={{
                                                xs: 'repeat(1, 1fr)',
                                                sm: 'repeat(1, 1fr)',
                                            }}
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
        </FormProvider>
    )

}