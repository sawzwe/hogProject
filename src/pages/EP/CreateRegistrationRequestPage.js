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
import { useSettingsContext } from '../../components/settings';
import FormProvider, { RHFSelect, RHFUpload } from '../../components/hook-form';
import { FormPrivate, FormGroup, FormSemiPrivate } from '../../sections/dashboard/ep-registration-request-form';

// ----------------------------------------------------------------------

const COURSE_TYPE_OPTIONS = [
    { id: 1, name: 'Group' },
    { id: 2, name: 'Private' },
    { id: 3, name: 'Semi Private' }
]

// ----------------------------------------------------------------------

export default function CreateRegistrationRequestPage() {
    const { themeStretch } = useSettingsContext();

    const RegisterRequestSchema = Yup.object().shape({
        selectedCourseType: Yup.string().required('Course type is required'),
    });

    const defaultValues = useMemo(
        () => ({
            selectedCourseType: 'Group',
            assignedStudents: [],
            PaymentAttachmentFiles: [],
        }),
        []
    );

    const methods = useForm({
        resolver: yupResolver(RegisterRequestSchema),
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

    const onSubmit = async (data) => {
        try {
            console.log('DATA', JSON.stringify(data, null, 2));
        } catch (error) {
            console.error(error);
        }
    };

    // Student Add/Remove
    const handleAddStudent = useCallback(
        (student) => {
            setValue('assignedStudents', [...values.assignedStudents, student]);
        }
    )

    const handleRemoveStudent = (studentId) => {
        const filtered = values.assignedStudents?.filter((student) => student.id !== studentId);
        setValue('assignedStudents', filtered);
    }

    // Payment Attachment for group
    const handleDropFiles = useCallback(
        (acceptedFiles) => {
            const files = values.PaymentAttachmentFiles || [];
            const newFiles = acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
            );
            setValue('PaymentAttachmentFiles', [...files, ...newFiles]);
        },
        [setValue, values.PaymentAttachmentFiles]
    );

    const handleRemoveFile = (inputFile) => {
        const filtered = values.PaymentAttachmentFiles && values.PaymentAttachmentFiles?.filter((file) => file !== inputFile);
        setValue('PaymentAttachmentFiles', filtered);
    };

    const handleRemoveAllFiles = () => {
        setValue('PaymentAttachmentFiles', []);
    };

    useEffect(() => {
        reset(defaultValues);
        setValue('selectedCourseType', values.selectedCourseType);
    }, [values.selectedCourseType])

    return (
        <>
            <Helmet>
                <title> EP | Create Registration Request </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Typography variant="h3" component="h1" paragraph>
                    Create Registration Request
                </Typography>

                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={5}>
                            <RHFSelect
                                name="selectedCourseType"
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

                        {/* Select Group */}
                        {values.selectedCourseType === 'Group' &&
                            <>

                                {/* Add Student and Course */}
                                <Grid item xs={12} md={12}>
                                    <FormGroup
                                        onAddStudent={handleAddStudent}
                                        onRemoveStudent={handleRemoveStudent}
                                    />
                                </Grid>
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
                                                name="PaymentAttachmentFiles"
                                                maxSize={3145728}
                                                onDrop={handleDropFiles}
                                                onRemove={handleRemoveFile}
                                                onRemoveAll={handleRemoveAllFiles}
                                                onUpload={() => console.log('ON UPLOAD')}
                                            />
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

                        {/* Select Private */}
                        {values.selectedCourseType === 'Private' &&
                            <>
                                <Grid item xs={12} md={12}>
                                    <FormPrivate 
                                        onAddStudent={handleAddStudent}
                                        onRemoveStudent={handleRemoveStudent}
                                    />
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

                        {/* Select Semi Private */}
                        {values.selectedCourseType === 'Semi Private' &&
                            <>
                                <Grid item xs={12} md={12}>
                                    <FormSemiPrivate 
                                        onAddStudent={handleAddStudent}
                                        onRemoveStudent={handleRemoveStudent}
                                    />
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

            </Container>
        </>
    );
}
