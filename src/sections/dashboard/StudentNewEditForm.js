import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { DatePicker } from '@mui/x-date-pickers';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Chip, Grid, Stack, Switch, Typography, FormControlLabel, Button, TextField, MenuItem } from '@mui/material';
// utils
import { fData } from '../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// assets
import { countries, levelOfStudy, nameTitle, studyProgram } from '../../assets/data';
// components
import Label from '../../components/label';
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFAutocomplete, RHFUpload, RHFRadioGroup, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../components/hook-form';

// ----------------------------------------------------------------------

UserNewEditForm.propTypes = {
    isEdit: PropTypes.bool,
    currentUser: PropTypes.object,
};

export default function UserNewEditForm({ isEdit = false, currentUser }) {
    const navigate = useNavigate();

    const { enqueueSnackbar } = useSnackbar();

    const NewStudentSchema = Yup.object().shape({
        studentTitle: Yup.string().required('Title is required'),
        studentFirstName: Yup.string().required('Firstname is required'),
        studentLastName: Yup.string().required('Lastname is required'),
        studentNickname: Yup.string().required('Nickname is required'),
        studentDateOfBirth: Yup.string().nullable().required('Date of birth is required'),
        studentPhoneNo: Yup.string().required('Phone number is required'),
        studentLineId: Yup.string().required('Line ID is required'),
        studentEmail: Yup.string().required('Email is required').email('Must be a valid email'),
        schoolName: Yup.string().required('School name is required'),
        schoolCountry: Yup.string().required('Country is required'),
        levelOfStudy: Yup.string().required('Level of study is required'),
        targetUniversity: Yup.string(),
        targetScore: Yup.string(),
        studyProgram: Yup.string().required('Study program is required'),
        address: Yup.string().required('Address is required'),
        subDistrict: Yup.string().required('Sub-District is required'),
        district: Yup.string().required('District is required'),
        province: Yup.string().required('Province is required'),
        zipCode: Yup.string().required('ZipCode is required'),
        parentTitle: Yup.string().required('Title is required'),
        parentFirstName: Yup.string().required('Firstname is required'),
        parentLastName: Yup.string().required('Lastname is required'),
        parentRelationships: Yup.string().required('Relationships is required'),
        parentPhoneNo: Yup.string().required('Phone number is required'),
        parentEmail: Yup.string().required('Email is required').email('Must be a valid email'),
        parentLine: Yup.string().required('Line ID is required'),
        studentHealthInfo: Yup.string(),
        studentSource: Yup.string(),
        studentImageUrl: Yup.mixed().test('required', 'Profile image is required', (value) => value !== ''),
    });

    const methods = useForm({
        resolver: yupResolver(NewStudentSchema),
        // defaultValues,
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

    const onSubmit = async () => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            reset();
            enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
            navigate(PATH_DASHBOARD.allStudents);
        } catch (error) {
            console.error(error);
        }
    };

    // Student Image ()
    const handleDropImage = useCallback(
        (acceptedFiles) => {
            const file = acceptedFiles[0];

            const newFile = Object.assign(file, {
                preview: URL.createObjectURL(file),
            });

            if (file) {
                setValue('avatarUrl', newFile);
            }
        },
        [setValue]
    );


    // Additional Files (Handle add & remove)
    const handleDropFiles = useCallback(
        (acceptedFiles) => {
            const files = values.images || [];

            const newFiles = acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
            );

            setValue('images', [...files, ...newFiles]);
        },
        [setValue, values.images]
    );

    const handleRemoveFile = (inputFile) => {
        const filtered = values.images && values.images?.filter((file) => file !== inputFile);
        setValue('images', filtered);
    };

    const handleRemoveAllFiles = () => {
        setValue('images', []);
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>

            {/* Student Image */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ pt: 3, pb: 1, px: 3 }}>
                        <Box sx={{ mb: 1 }}>
                            <Typography
                                variant="h5"
                                sx={{
                                    mb: 2,
                                    mx: 'auto',
                                    display: 'block',
                                    textAlign: 'center',
                                    color: 'text.primary',
                                }}> Student Image </Typography>
                            <RHFUploadAvatar
                                name="studentImageUrl"
                                maxSize={3145728}
                                onDrop={handleDropImage}
                                helperText={
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            mt: 2.2,
                                            mx: 'auto',
                                            display: 'block',
                                            textAlign: 'center',
                                            color: 'text.secondary',
                                        }}
                                    >
                                        Allowed *.jpeg, *.jpg, *.png, *.gif
                                        <br /> max size of {fData(3145728)}
                                    </Typography>
                                }
                            />
                        </Box>
                    </Card>
                </Grid>

                {/* Student Information */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ p: 3 }}>
                        <Typography variant="h5"
                            sx={{
                                mb: 2,
                                display: 'block',
                            }}>Student Information</Typography>
                        <Box
                            rowGap={3}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                sm: 'repeat(6, 1fr)',
                            }}
                            gridTemplateAreas={{
                                xs: `"studentTitle" "studentFirstName" "studentLastName" "studentNickname" "studentDateOfBirth" "studentPhoneNumber" "studentLineId" "studentEmail"`,
                                md: `"studentTitle studentFirstName studentFirstName studentLastName studentLastName studentNickname"
                                "studentDateOfBirth studentDateOfBirth studentDateOfBirth studentPhoneNumber studentPhoneNumber studentPhoneNumber" 
                                "studentLineId studentLineId studentLineId studentEmail studentEmail studentEmail"`
                            }}
                        >
                            <Box gridArea={"studentTitle"}>
                                <RHFSelect
                                    fullWidth
                                    name="studentTitle"
                                    label="Title"
                                    SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}>
                                    {nameTitle.map((option) => (
                                        <MenuItem
                                            key={option.value}
                                            value={option.label}
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
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </RHFSelect>
                            </Box>
                            <Box gridArea={"studentFirstName"}>
                                <RHFTextField name="studentFirstName" label="First Name" />
                            </Box>
                            <Box gridArea={"studentLastName"}>
                                <RHFTextField name="studentLastName" label="Last Name" />
                            </Box>
                            <Box gridArea={"studentNickname"}>
                                <RHFTextField name="studentNickname" label="Nickname" />
                            </Box>
                            <Box gridArea={"studentDateOfBirth"}>
                                <Controller
                                    name="studentDateOfBirth"
                                    control={control}
                                    defaultValue={''}
                                    render={({ field, fieldState: { error } }) => (
                                        <DatePicker
                                            label="Date of Birth"
                                            value={field.value}
                                            onChange={(newValue) => {
                                                field.onChange(newValue);
                                            }}
                                            renderInput={(params) => (
                                                <TextField {...params} fullWidth error={!!error} helperText={error?.message} />
                                            )}
                                        />
                                    )}
                                />
                                
                            </Box>
                            <Box gridArea={"studentPhoneNumber"}>
                                <RHFTextField name="studentPhoneNo" label="Phone Number" />
                            </Box>
                            <Box gridArea={"studentLineId"}>
                                <RHFTextField name="studentLineId" label="Line ID" />
                            </Box>
                            <Box gridArea={"studentEmail"}>
                                <RHFTextField name="studentEmail" label="Email Address" />
                            </Box>
                        </Box>
                    </Card>
                </Grid>

                {/* School Information */}
                <Grid item xs={12} md={12}>
                    <Card sx={{ p: 3 }}>
                        <Typography variant="h5"
                            sx={{
                                mb: 2,
                                display: 'block',
                            }}>School Information</Typography>
                        <Box
                            rowGap={3}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                sm: 'repeat(1, 1fr)',
                            }}
                        >
                            <RHFTextField name="schoolName" label="School Name" />
                            <RHFAutocomplete
                                name="schoolCountry"
                                onChange={(event, newValue) => setValue('tags', newValue)}
                                options={countries.map((option) => option)}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip {...getTagProps({ index })} key={option.code} value={option.label} size="small" label={option.label} />
                                    ))
                                }
                                renderInput={(params) => <RHFTextField name="schoolCountry" label="School Country" {...params} />}
                            />
                            <RHFSelect
                                name="levelOfStudy"
                                label="Level of Study"
                                SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}>
                                {levelOfStudy.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.label}
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
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </RHFSelect>
                            <RHFTextField name="targetUniversity" label="Target University" />
                            <RHFTextField name="targetScore" label="Target Score" />
                            <RHFRadioGroup name="studyProgram" options={studyProgram} label="Study Program" />
                        </Box>
                    </Card>
                </Grid>

                {/* Mailing Address */}
                <Grid item xs={12} md={12}>
                    <Card sx={{ p: 3 }}>
                        <Typography variant="h5"
                            sx={{
                                mb: 2,
                                display: 'block',
                            }}>Mailing Address</Typography>
                        <Box
                            rowGap={3}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                sm: 'repeat(4, 1fr)',
                            }}
                            gridTemplateAreas={{
                                xs: '"address" "subDistrict" "district" "province" "zipCode"',
                                md: '"address address address address" "subDistrict district province zipCode"'
                            }}
                        >
                            <Box gridArea={"address"}>
                                <RHFTextField name="address" label="Address" />
                            </Box>
                            <Box gridArea={"subDistrict"}>
                                <RHFTextField name="subDistrict" label="Sub-District" />
                            </Box>
                            <Box gridArea={"district"}>
                                <RHFTextField name="district" label="District" />
                            </Box>
                            <Box gridArea={"province"}>
                                <RHFTextField name="province" label="Province" />
                            </Box>
                            <Box gridArea={"zipCode"}>
                                <RHFTextField name="zipCode" label="Zip Code/Post Code" />
                            </Box>
                        </Box>
                    </Card>
                </Grid>

                {/* Parent Information */}
                <Grid item xs={12} md={12}>
                    <Card sx={{ p: 3 }}>
                        <Typography variant="h5"
                            sx={{
                                mb: 2,
                                display: 'block',
                            }}>Parent Information</Typography>
                        <Box
                            rowGap={3}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                sm: 'repeat(6, 1fr)',
                            }}
                            gridTemplateAreas={{
                                xs: `"parentTitle" "parentFirstName" "parentLastName" "parentRelationships" "parentPhone" "parentEmail" "parentLine"`,
                                md: `"parentTitle parentFirstName parentFirstName parentLastName parentLastName parentRelationships" 
                                "parentPhone parentPhone parentEmail parentEmail parentLine parentLine"`
                            }}
                        >
                            <Box gridArea={"parentTitle"}>
                                <RHFSelect
                                    fullWidth
                                    name="parentTitle"
                                    label="Title"
                                    SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}>
                                    {nameTitle.map((option) => (
                                        <MenuItem
                                            key={option.value}
                                            value={option.label}
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
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </RHFSelect>
                            </Box>
                            <Box gridArea={"parentFirstName"}>
                                <RHFTextField name="parentFirstName" label="First Name" />
                            </Box>
                            <Box gridArea={"parentLastName"}>
                                <RHFTextField name="parentLastName" label="Last Name" />
                            </Box>
                            <Box gridArea={"parentRelationships"}>
                                <RHFTextField name="parentRelationships" label="Relationships" />
                            </Box>
                            <Box gridArea={"parentPhone"}>
                                <RHFTextField name="parentPhoneNo" label="Phone Number" />
                            </Box>
                            <Box gridArea={"parentEmail"}>
                                <RHFTextField name="parentEmail" label="Email Address" />
                            </Box>
                            <Box gridArea={"parentLine"}>
                                <RHFTextField name="parentLine" label="Line ID" />
                            </Box>
                        </Box>
                    </Card>
                </Grid>

                {/* Additional Information */}
                <Grid item xs={12} md={12}>
                    <Card sx={{ p: 3 }}>
                        <Typography variant="h5"
                            sx={{
                                mb: 2,
                                display: 'block',
                            }}>Additional Information</Typography>
                        <Box
                            rowGap={3}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                sm: 'repeat(1, 1fr)',
                            }}
                        >
                            <RHFTextField name="studentHealthInfo" label="Student's health information that needs to be caution" />
                            <RHFTextField name="studentSource" label="How did student know about House of Griffin?" />
                        </Box>
                    </Card>
                </Grid>

                {/* Additional Files */}
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
                                name="studentAdditionalFiles"
                                maxSize={3145728}
                                onDrop={handleDropFiles}
                                onRemove={handleRemoveFile}
                                onRemoveAll={handleRemoveAllFiles}
                                onUpload={() => console.log('ON UPLOAD')}
                            />

                        </Box>

                    </Card>
                </Grid>

                <Grid item xs={12} md={12}>
                    <Stack direction="row" justifyContent="flex-end" alignItems="center">
                        <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ height: '3em' }}>
                            Create Student
                        </LoadingButton>
                    </Stack>
                </Grid>

            </Grid>
        </FormProvider>
    );
}
