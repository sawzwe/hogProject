import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { DatePicker } from '@mui/x-date-pickers';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Chip, Grid, Stack, Typography, TextField, MenuItem } from '@mui/material';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// utils
import { fData } from '../../utils/formatNumber';
// assets
import { countries } from '../../assets/data';
// components
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFAutocomplete, RHFUpload, RHFRadioGroup, RHFSelect, RHFTextField, RHFUploadAvatar } from '../../components/hook-form';

// ----------------------------------------------------------------------

// Get student data from table Student
// Get registered course from table StudyCourse joined with Student
// Get exam date from table Exam joined with Student

// Once created, store the data to Student table, Firebase Auth and Firestore
// Once saved, overwrite the data to Student and Exam tables

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
    isView: PropTypes.bool,
};

export default function StudentNewEditForm({ isEdit = false, currentStudent, isView }) {
    const navigate = useNavigate();


    const { registerStudent } = useAuthContext();

    const { enqueueSnackbar } = useSnackbar();

    const NewStudentSchema = Yup.object().shape({
        studentTitle: Yup.string().nullable().required('Title is required'),
        studentFirstName: Yup.string().required('Firstname is required'),
        studentLastName: Yup.string().required('Lastname is required'),
        studentNickname: Yup.string().required('Nickname is required'),
        studentDateOfBirth: Yup.string().nullable().required('Date of birth is required'),
        studentPhoneNo: Yup.string().required('Phone number is required'),
        studentLineId: Yup.string().required('Line ID is required'),
        studentEmail: Yup.string().required('Email is required').email('Must be a valid email'),
        schoolName: Yup.string().required('School name is required'),
        schoolCountry: Yup.string().nullable().required('Country is required'),
        levelOfStudy: Yup.string().required('Level of study is required'),
        targetUniversity: Yup.string(),
        targetScore: Yup.string(),
        studyProgram: Yup.string().required('Study program is required'),
        otherStudyProgram: Yup.string().when("showOtherStudyProgram", {
            is: true,
            then: Yup.string().required('Other study program is required')
        }),
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
        parentLineId: Yup.string().required('Line ID is required'),
        studentHealthInfo: Yup.string(),
        studentSource: Yup.string(),
        studentImageURL: Yup.mixed().required('Student photo is required')
            .test('fileSize', 'The file is too large', (file) => file && file.size <= MAX_FILE_SIZE)
            .test('fileFormat', 'Unsupported Format', (file) => file && FILE_FORMATS.includes(file.type)),
    });

    const defaultValues = useMemo(
        () => ({
            studentTitle: currentStudent?.studentTitle || 'Mr.',
            studentFirstName: currentStudent?.studentFirstName || 'Piyaphon',
            studentLastName: currentStudent?.studentLastName || 'Wu',
            studentNickname: currentStudent?.studentNickname || 'Hong',
            studentDateOfBirth: currentStudent?.studentDateOfBirth || '1-May-2002',
            studentPhoneNo: currentStudent?.studentPhoneNo || '098-xxx-xxxx',
            studentLineId: currentStudent?.studentLineId || 'pnw029',
            studentEmail: currentStudent?.studentEmail || 'hong@gmail.com',
            schoolName: currentStudent?.schoolName || 'Assumption College Rayong',
            schoolCountry: currentStudent?.schoolCountry || countries[216].label,
            levelOfStudy: currentStudent?.levelOfStudy || 'Matthayom 6',
            targetUniversity: currentStudent?.targetUniversity || 'Assumption University',
            targetScore: currentStudent?.targetScore || 'IELTS 9.0',
            studyProgram: currentStudent?.studyProgram || STUDY_PROGRAM_OPTIONS[2].value,
            otherStudyProgram: currentStudent?.otherStudyProgram || '',
            address: currentStudent?.address || '2/18 Moo 2 Rd.Sukhumwit',
            subDistrict: currentStudent?.subDistrict || 'Nernpra',
            district: currentStudent?.district || 'Mueng Rayong',
            province: currentStudent?.province || 'Rayong',
            zipCode: currentStudent?.zipCode || '21000',
            parentTitle: currentStudent?.parentTitle || 'Mr.',
            parentFirstName: currentStudent?.parentFirstName || 'dadFirstname',
            parentLastName: currentStudent?.parentLastName || 'dadLastname',
            parentRelationships: currentStudent?.parentRelationships || 'Father',
            parentPhoneNo: currentStudent?.parentPhoneNo || '097-xxx-xxxx',
            parentEmail: currentStudent?.parentEmail || 'dad@gmail.com',
            parentLineId: currentStudent?.parentLineId || 'dad@line',
            studentHealthInfo: currentStudent?.studentHealthInfo || 'Seafood allergy',
            studentSource: currentStudent?.studentSource || 'Know from friends',
            studentImageURL: currentStudent?.studentImageUrl || '',
            studentAdditionalFiles: currentStudent?.studentAdditionalFiles || [],
        }),
        [currentStudent]
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
        formState: { isSubmitting },
    } = methods;

    const values = watch();

    useEffect(() => {
        if (isEdit && currentStudent) {
            reset(defaultValues);
        }
        if (!isEdit) {
            reset(defaultValues);
        }
    }, [isEdit, currentStudent]);

    // Create student to Firebase Auth, Firestore, and Azure Database
    const createStudent = async (data) => {
        // Add Logic here
        await registerStudent(data)
            .catch((error) => enqueueSnackbar(error.message, { variant: 'error' }))
    }

    // Update student data to the database
    const updateStudent = () => {
        // Add Logic here

        enqueueSnackbar('Update success!')
    }

    const onSubmit = async (data) => {
        try {
            if (isEdit) {
                await updateStudent(data);
            } else {
                console.log(data);
                // await createStudent(data);
                await enqueueSnackbar('Successfully created!');
            }
            // console.log('DATA', JSON.stringify(data, null, 2));
        } catch (error) {
            enqueueSnackbar('Unknown Error!', { variant: 'error' });
        }
    };

    // Other Study Program
    const [showOtherStudyProgram, setShowOtherStudyProgram] = useState(false);

    const handleClickOther = (data) => {
        if (data.target.value === "Other") {
            setShowOtherStudyProgram(true)
        } else {
            setValue("otherStudyProgram", "");
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
                                sm: 'repeat(1, 1fr)',
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
                            </Box>
                            <Box gridArea={"studentFirstName"}>
                                <RHFTextField name="studentFirstName" label="First Name" required />
                            </Box>
                            <Box gridArea={"studentLastName"}>
                                <RHFTextField name="studentLastName" label="Last Name" required />
                            </Box>
                            <Box gridArea={"studentNickname"}>
                                <RHFTextField name="studentNickname" label="Nickname" required />
                            </Box>
                            <Box gridArea={"studentDateOfBirth"}>
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
                            </Box>
                            <Box gridArea={"studentPhoneNumber"}>
                                <RHFTextField name="studentPhoneNo" label="Phone Number" required />
                            </Box>
                            <Box gridArea={"studentLineId"}>
                                <RHFTextField name="studentLineId" label="Line ID" required />
                            </Box>
                            <Box gridArea={"studentEmail"}>
                                <RHFTextField name="studentEmail" label="Email Address" required />
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
                            <RHFRadioGroup name="studyProgram" options={STUDY_PROGRAM_OPTIONS} label="Study Program" onClick={handleClickOther} />
                            {showOtherStudyProgram ? <RHFTextField name="otherStudyProgram" label="Other" required /> : null}
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
                                <RHFTextField name="zipCode" label="Zip Code/Post Code" required />
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
                                xs: `"parentTitle" "parentFirstName" "parentLastName" "parentRelationships" "parentPhone" "parentEmail" "parentLineId"`,
                                md: `"parentTitle parentFirstName parentFirstName parentLastName parentLastName parentRelationships" 
                                "parentPhone parentPhone parentEmail parentEmail parentLineId parentLineId"`
                            }}
                        >
                            <Box gridArea={"parentTitle"}>
                                <RHFSelect
                                    fullWidth
                                    required
                                    name="parentTitle"
                                    label="Title"
                                    SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}>
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
                            </Box>
                            <Box gridArea={"parentFirstName"}>
                                <RHFTextField name="parentFirstName" label="First Name" required />
                            </Box>
                            <Box gridArea={"parentLastName"}>
                                <RHFTextField name="parentLastName" label="Last Name" required />
                            </Box>
                            <Box gridArea={"parentRelationships"}>
                                <RHFTextField name="parentRelationships" label="Relationships" required />
                            </Box>
                            <Box gridArea={"parentPhone"}>
                                <RHFTextField name="parentPhoneNo" label="Phone Number" required />
                            </Box>
                            <Box gridArea={"parentEmail"}>
                                <RHFTextField name="parentEmail" label="Email Address" />
                            </Box>
                            <Box gridArea={"parentLineId"}>
                                <RHFTextField name="parentLineId" label="Line ID" />
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

                {/* Registered Courses */}
                {isEdit && (
                    <Grid item xs={12} md={12}>
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h5"
                                sx={{
                                    mb: 2,
                                    display: 'block',
                                }}>{`Registered Course(s)`}</Typography>
                        </Card>
                    </Grid>
                )}

                {/* Exam Dates */}
                {isEdit && (
                    <Grid item xs={12} md={12}>
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h5"
                                sx={{
                                    mb: 2,
                                    display: 'block',
                                }}>{`Exam Date(s)`}</Typography>
                        </Card>
                    </Grid>
                )}

                <Grid item xs={12} md={12}>
                    <Stack direction="row" justifyContent="flex-end" alignItems="center">
                        <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ height: '3em' }}>
                            {!isEdit ? 'Create Student' : 'Save Changes'}
                        </LoadingButton>
                    </Stack>
                </Grid>
            </Grid>

        </FormProvider>
    );
}
