import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
// firebase
import { getStorage, listAll, ref, deleteObject, uploadBytes } from "firebase/storage";
// form
import { useForm, Controller, useFormContext } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { DatePicker } from '@mui/x-date-pickers';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Chip, Grid, Stack, Typography, TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import axios from 'axios';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// utils
import { fData } from '../../utils/formatNumber';
import { fDate } from '../../utils/formatTime';
// assets
import { countries } from '../../assets/data';
// components
import { useSnackbar } from '../../components/snackbar';
// import { fileFormat } from '../../components/file-thumbnail';
import FormProvider, { RHFAutocomplete, RHFUpload, RHFRadioGroup, RHFSelect, RHFTextField, RHFUploadAvatar } from '../../components/hook-form';

// ----------------------------------------------------------------------

const TITLE_OPTIONS = [
    { id: 1, name: 'Mr.' },
    { id: 2, name: 'Ms.' },
    { id: 3, name: 'Mrs.' },
];

const STUDY_PROGRAM_OPTIONS = [
    { label: 'International Program', value: 'International Program' },
    { label: 'Bilingual/EP Program', value: 'Bilingual/EP Program' },
    { label: 'Thai Program', value: 'Thai Program' },
    { label: 'Gifted Program', value: 'Gifted Program' },
    { label: 'Homeschool', value: 'Homeschool' },
    { label: 'Other', value: 'Other' }
]

const STUDY_LEVEL_OPTIONS = [
    { value: 'Prathom 5' },
    { value: 'Prathom 6' },
    { value: 'Matthayom 1' },
    { value: 'Matthayom 2' },
    { value: 'Matthayom 3' },
    { value: 'Matthayom 4' },
    { value: 'Matthayom 5' },
    { value: 'Matthayom 6' },
    { value: 'Grade 5' },
    { value: 'Grade 6' },
    { value: 'Grade 7' },
    { value: 'Grade 8' },
    { value: 'Grade 9' },
    { value: 'Grade 10' },
    { value: 'Grade 11' },
    { value: 'Grade 12' },
    { value: 'Year 7' },
    { value: 'Year 8' },
    { value: 'Year 9' },
    { value: 'Year 10' },
    { value: 'Year 11' },
    { value: 'Year 12' },
    { value: 'Year 13' },
    { value: 'Others' }
]

const MAX_FILE_SIZE = 2 * 1000 * 1000; // 2 Mb

const FILE_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];

// ----------------------------------------------------------------------

StudentNewEditForm.propTypes = {
    isEdit: PropTypes.bool,
    currentStudent: PropTypes.object,
    currentAvatar: PropTypes.object,
    currentFiles: PropTypes.array,
};

export default function StudentNewEditForm({ isEdit = false, currentStudent, currentAvatar, currentFiles }) {
    const navigate = useNavigate();
    const { registerStudent, updateStudent, user } = useAuthContext();
    const { enqueueSnackbar } = useSnackbar();

    const config = { headers: { Authorization: `Bearer ${user.accessToken}` } }

    const NewStudentSchema = Yup.object().shape({
        studentTitle: Yup.string().nullable().required('Title is required'),
        studentFirstName: Yup.string().required('Firstname is required'),
        studentLastName: Yup.string().required('Lastname is required'),
        studentNickname: Yup.string().required('Nickname is required'),
        studentDateOfBirth: Yup.string().nullable().required('Date of birth is required'),
        studentPhoneNo: Yup.string().min(10, 'Phone number must contain 10 numbers').max(10, 'phone number must contain 10 numbers').required('Phone number is required'),
        studentLineId: Yup.string().required('Line ID is required'),
        studentEmail: Yup.string().required('Email is required').email('Must be a valid email'),
        schoolName: Yup.string().required('School name is required'),
        schoolCountry: Yup.string().nullable().required('Country is required'),
        levelOfStudy: Yup.string().required('Level of study is required'),
        targetUniversity: Yup.string(),
        targetScore: Yup.string(),
        studyProgram: Yup.string().required('Study program is required'),
        otherProgram: Yup.string()
            .when('studyProgram', {
                is: 'Other',
                then: Yup.string().required('Other program is required')
            }),
        address: Yup.string().required('Address is required'),
        subDistrict: Yup.string().required('Sub-District is required'),
        district: Yup.string().required('District is required'),
        province: Yup.string().required('Province is required'),
        zipCode: Yup.string().min(5, 'Zipcode must contain 5 numbers').max(5, 'Zipcode must contain 5 numbers').required('ZipCode is required'),
        parentFirstName: Yup.string().required('Firstname is required'),
        parentLastName: Yup.string().required('Lastname is required'),
        parentRelationships: Yup.string().required('Relationships is required'),
        parentPhoneNo: Yup.string().min(10, 'Phone number must contain 10 numbers').max(10, 'phone number must contain 10 numbers').required('Phone number is required'),
        parentEmail: Yup.string().email('Must be a valid email').required('Email is required'),
        parentLineId: Yup.string().required('Line ID is required'),
        studentHealthInfo: Yup.string(),
        studentSource: Yup.string(),
        studentImageURL: Yup.mixed()
            .test('required', "Student photo is required", (file) => file !== '')
            .test('fileSize', 'The file is too large', (file) => file && file.size <= MAX_FILE_SIZE)
            .test('fileFormat', 'Student Photo has unsupported format', (file) => file && (FILE_FORMATS.includes(file.type)))
    });

    const allStudyOptions = Object.values(STUDY_PROGRAM_OPTIONS);

    const defaultValues = useMemo(
        () => ({
            studentTitle: currentStudent?.title || '',
            studentFirstName: currentStudent?.fName || '',
            studentLastName: currentStudent?.lName || '',
            studentNickname: currentStudent?.nickname || '',
            studentDateOfBirth: currentStudent?.dob || '',
            studentPhoneNo: currentStudent?.phone || '',
            studentLineId: currentStudent?.line || '',
            studentEmail: currentStudent?.email || '',
            schoolName: currentStudent?.school || '',
            schoolCountry: currentStudent?.countryOfSchool || countries[216].label,
            levelOfStudy: currentStudent?.levelOfStudy || '',
            targetUniversity: currentStudent?.targetUni || '',
            targetScore: currentStudent?.targetScore || '',
            studyProgram: !!currentStudent?.program ? currentStudent.program !== "International Program" && currentStudent.program !== 'Bilingual/EP Program' && currentStudent.program !== 'Thai Program' && currentStudent.program !== 'Gifted Program' && currentStudent.program !== 'Homeschool' ? 'Other' : currentStudent?.program : '',
            otherProgram: currentStudent?.program || '',
            address: currentStudent?.address.address || '',
            subDistrict: currentStudent?.address.subdistrict || '',
            district: currentStudent?.address.district || '',
            province: currentStudent?.address.province || '',
            zipCode: currentStudent?.address.zipcode || '',
            parentFirstName: currentStudent?.parent.fName || '',
            parentLastName: currentStudent?.parent.lName || '',
            parentRelationships: currentStudent?.parent.relationship || '',
            parentPhoneNo: currentStudent?.parent.phone || '',
            parentEmail: currentStudent?.parent.email || '',
            parentLineId: currentStudent?.parent.line || '',
            studentHealthInfo: currentStudent?.healthInfo || '',
            studentSource: currentStudent?.hogInfo || '',
            studentImageURL: currentAvatar || '',
            studentAdditionalFiles: currentFiles || [],
        }),
        [currentStudent, currentAvatar, currentFiles]
    );

    const methods = useForm({
        resolver: yupResolver(NewStudentSchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        control,
        setValue,
        handleSubmit,
    } = methods;

    const values = watch();

    // Confirm Dialog
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmitConfirmDialog = async (data) => {
        setIsSubmitting(true);
        try {
            if (data.studyProgram === 'Other') {
                data.studyProgram = data.otherProgram;
            }

            if (isEdit) {
                await updateStudent(currentStudent, data, config)
                    .catch((error) => {
                        throw error;
                    })
                setIsSubmitting(false);
                setOpenConfirmDialog(false);
                // navigate(0);
                enqueueSnackbar('Updated student information successfully!');
                navigate(`/account/student-management/student/${currentStudent.id}`);
                // reset(defaultValues);
            } else {
                await registerStudent(data, config)
                    .catch((error) => {
                        throw error;
                    })
                setIsSubmitting(false);
                enqueueSnackbar('Successfully created!')
                setOpenConfirmDialog(false);
                navigate(`/account/student-management/student`);
                reset(defaultValues);
            }
        } catch (error) {
            enqueueSnackbar(`${error.message}`, { variant: 'error' });
            setIsSubmitting(false);
        }
    }

    const onConfirm = () => {
        try {
            setOpenConfirmDialog(true)
        } catch (error) {
            enqueueSnackbar(`${error.message}`, { variant: 'error' });
        }
    }

    // Other Study Program
    const [showOtherStudyProgram, setShowOtherStudyProgram] = useState(false);

    const handleChangeOther = (data) => {
        if (data.target.value === "Other") {
            setValue("otherProgram", '')
            setShowOtherStudyProgram(current => !current)
        } else {
            setValue("otherProgram", '');
            setShowOtherStudyProgram(false)
        };
    };

    // Student Image
    const handleDropStudentImage = useCallback(
        (acceptedFiles) => {
            const file = acceptedFiles[0];

            const newFile = Object.assign(file, {
                preview: URL.createObjectURL(file),
            });

            if (file) {
                setValue('studentImageURL', newFile);
            }
        },
        [setValue]
    );

    // Additional Files
    const handleDropFiles = useCallback(
        (acceptedFiles) => {
            const files = values.studentAdditionalFiles || [];
            const newFiles = acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
            );
            setValue('studentAdditionalFiles', [...files, ...newFiles]);
        },
        [setValue, values.studentAdditionalFiles]
    );

    const handleRemoveFile = (inputFile) => {
        const filtered = values.studentAdditionalFiles && values.studentAdditionalFiles?.filter((file) => file !== inputFile);
        setValue('studentAdditionalFiles', filtered);
    };

    const handleRemoveAllFiles = () => {
        setValue('studentAdditionalFiles', []);
    };

    useEffect(() => {
        if (isEdit && currentStudent) {
            if (currentStudent.program !== "International Program" && currentStudent.program !== 'Bilingual/EP Program' && currentStudent.program !== 'Thai Program' && currentStudent.program !== 'Gifted Program' && currentStudent.program !== 'Homeschool') {
                // reset(defaultValues);
                setShowOtherStudyProgram(true)
                setValue("studyProgram", "Other");
                setValue("otherProgram", currentStudent.program);
            } else {
                reset(defaultValues);
            }
            reset(defaultValues);
        }
        if (!isEdit) {
            reset(defaultValues);
        }
    }, [isEdit, currentStudent, currentAvatar, currentFiles]);

    const onError = (error) => {
        const errors = Object.values(error)
        enqueueSnackbar(errors[0].message, { variant: 'error' })
    }

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onConfirm, onError)}>
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
                                }}
                            >
                                Student Image
                                <Typography
                                    component="span"
                                    sx={{ color: '#db3131' }}
                                >
                                    *
                                </Typography>
                            </Typography>

                            <RHFUploadAvatar
                                name="studentImageURL"
                                maxSize={3145728}
                                onDrop={handleDropStudentImage}
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
                                required
                            />
                        </Box>
                    </Card>
                </Grid>

                {/* Student Information */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ p: 3, pb: 4.8 }}>
                        <Typography variant="h5"
                            sx={{
                                mb: 2,
                                display: 'block',
                            }}>
                            Student Information
                        </Typography>
                        <Grid direction="row" container spacing={2}>
                            <Grid item xs={12} md={2}>
                                <RHFSelect
                                    name="studentTitle"
                                    label="Title"
                                    SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                                    required>
                                    {TITLE_OPTIONS.map((option) => (
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
                            <Grid item xs={12} md={3.5}>
                                <RHFTextField name="studentFirstName" label="First Name" required />
                            </Grid>
                            <Grid item xs={12} md={3.5}>
                                <RHFTextField name="studentLastName" label="Last Name" required />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <RHFTextField name="studentNickname" label="Nickname" required />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="studentDateOfBirth"
                                    control={control}
                                    render={({ field, fieldState: { error } }) => (
                                        <DatePicker
                                            label="Date of Birth"
                                            value={field.value}
                                            onChange={(newValue) => {
                                                field.onChange(newValue);
                                            }}
                                            renderInput={(params) => (
                                                <TextField {...params} fullWidth error={!!error} helperText={error?.message} required />
                                            )}
                                            disableMaskedInput
                                            inputFormat="dd-MMM-yyyy"
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <RHFTextField
                                    isNumber
                                    name="studentPhoneNo"
                                    label="Phone Number"
                                    inputProps={{ maxLength: 10 }}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <RHFTextField name="studentLineId" label="Line ID" required />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <RHFTextField name="studentEmail" label="Email Address" required />
                            </Grid>
                        </Grid>
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
                            <RHFTextField name="schoolName" label="School Name" required />

                            <RHFAutocomplete
                                name="schoolCountry"
                                onChange={(event, newValue) => setValue('schoolCountry', newValue)}
                                options={countries.map((option) => option.label)}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip {...getTagProps({ index })} key={option} size="small" label={option} />
                                    ))
                                }
                                renderInput={(params) => <TextField label="School Country" {...params} required />}
                            />

                            <RHFSelect
                                name="levelOfStudy"
                                label="Level of Study"
                                SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                                required>
                                {STUDY_LEVEL_OPTIONS.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
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
                                        {option.value}
                                    </MenuItem>
                                ))}
                            </RHFSelect>
                            <RHFTextField name="targetUniversity" label="Target University" />
                            <RHFTextField name="targetScore" label="Target Score" />
                            <RHFRadioGroup name="studyProgram" options={STUDY_PROGRAM_OPTIONS} label="Study Program" onClick={handleChangeOther} />
                            {showOtherStudyProgram && <RHFTextField name="otherProgram" label="Study Program" required />}
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
                                sm: 'repeat(1, 1fr)',
                            }}
                            gridTemplateAreas={{
                                xs: '"address" "subDistrict" "district" "province" "zipCode"',
                                md: '"address address address address" "subDistrict district province zipCode"'
                            }}
                        >
                            <Box gridArea={"address"}>
                                <RHFTextField name="address" label="Address" required />
                            </Box>
                            <Box gridArea={"subDistrict"}>
                                <RHFTextField name="subDistrict" label="Sub-District" required />
                            </Box>
                            <Box gridArea={"district"}>
                                <RHFTextField name="district" label="District" required />
                            </Box>
                            <Box gridArea={"province"}>
                                <RHFTextField name="province" label="Province" required />
                            </Box>
                            <Box gridArea={"zipCode"}>
                                <RHFTextField isNumber name="zipCode" label="Zip Code/Post Code" inputProps={{ maxLength: 5 }} required />
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
                        <Grid container direction="row" spacing={2}>
                            <Grid item xs={12} md={5}>
                                <RHFTextField name="parentFirstName" label="First Name" required />
                            </Grid>
                            <Grid item xs={12} md={5}>
                                <RHFTextField name="parentLastName" label="Last Name" required />
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <RHFTextField name="parentRelationships" label="Relationships" required />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <RHFTextField isNumber name="parentPhoneNo" label="Phone Number" inputProps={{ maxLength: 10 }} required />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <RHFTextField name="parentEmail" label="Email Address" required />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <RHFTextField name="parentLineId" label="Line ID" required />
                            </Grid>
                        </Grid>
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
                                maxSize={4e+7}
                                onDrop={handleDropFiles}
                                onRemove={handleRemoveFile}
                                onRemoveAll={handleRemoveAllFiles}
                            />
                        </Box>
                    </Card>
                </Grid>

                <Grid item xs={12} md={12}>
                    <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={1}>
                        {isEdit && (
                            <Button variant="outlined" color="inherit" sx={{ height: '3em' }} onClick={() => navigate(`/account/student-management/student/${currentStudent.id}`)}>
                                Cancel
                            </Button>
                        )}
                        <Button type="submit" variant="contained" sx={{ height: '3em' }}>
                            {!isEdit ? 'Create Student' : 'Save Changes'}
                        </Button>
                    </Stack>
                </Grid>
            </Grid>

            <ConfirmDialog
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
                isEdit={isEdit}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit(handleSubmitConfirmDialog)}
            />

        </FormProvider>
    );
}

// ----------------------------------------------------------------

ConfirmDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    isEdit: PropTypes.bool,
    isSubmitting: PropTypes.bool,
}

export function ConfirmDialog({ open, onClose, onSubmit, isEdit, isSubmitting }) {

    return (
        <Dialog fullWidth maxWidth="sm" open={open} onClose={
            !isSubmitting ? onClose : null
        }>
            <DialogTitle>
                {isEdit ? 'Edit Student?' : 'Create Student?'}
            </DialogTitle>
            <DialogContent>
                {isEdit ? 'Once editted, student information will be saved.' : 'Once submitted, student account will be created to the system.'}
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="inherit" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                <LoadingButton variant="contained" onClick={onSubmit} loading={isSubmitting}>Submit</LoadingButton>
            </DialogActions>
        </Dialog>
    )
}