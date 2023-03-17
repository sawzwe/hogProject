import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useNavigate } from 'react-router';
// @mui
import { DatePicker } from '@mui/x-date-pickers';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Chip, Grid, Stack, Typography, TextField } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
// utils
import { fDate } from '../../utils/formatTime';
// components
import { AvatarPreview } from '../../components/upload';
import FileThumbnail from '../../components/file-thumbnail';

// ----------------------------------------------------------------------

ViewStudent.propTypes = {
    student: PropTypes.object,
    avatarURL: PropTypes.string,
    filesURL: PropTypes.array
};

export default function ViewStudent({ student, avatarURL, filesURL }) {
    // console.log(filesURL)

    return (
        <Grid container spacing={3}>

            <Grid item xs={12} md={4}>
                <StudentImage avatarURL={avatarURL} />
            </Grid>

            <Grid item xs={12} md={8}>
                <StudentInfo student={student} />
            </Grid>

            <Grid item xs={12} md={12}>
                <SchoolInfo student={student} />
            </Grid>

            <Grid item xs={12} md={12}>
                <AddressInfo student={student} />
            </Grid>

            <Grid item xs={12} md={12}>
                <ParentInfo student={student} />
            </Grid>

            <Grid item xs={12} md={12}>
                <AdditionalInfo student={student} />
            </Grid>

            {filesURL.length > 0 && (
                <Grid item xs={12} md={12}>
                    <AdditionalFiles student={student} filesURL={filesURL} />
                </Grid>
            )}


        </Grid>
    );
}

// ----------------------------------------------------------------------

StudentImage.propTypes = {
    avatarURL: PropTypes.string
};

// ----------------------------------------------------------------------

const StyledDropZone = styled('div')(({ theme }) => ({
    width: 208,
    height: 208,
    margin: 'auto',
    display: 'flex',
    cursor: 'pointer',
    overflow: 'hidden',
    borderRadius: '50%',
    alignItems: 'center',
    position: 'relative',
    justifyContent: 'center',
    border: `1px dashed ${alpha(theme.palette.grey[500], 0.32)}`,
}));

export function StudentImage({ avatarURL }) {
    return (
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
                </Typography>
                <StyledDropZone
                    sx={{
                        '&:hover': {
                            '& .placeholder': {
                                opacity: 1,
                            },
                        },
                        cursor: "auto"
                    }}
                >
                    <AvatarPreview file={avatarURL} />
                </StyledDropZone>
            </Box>
        </Card>
    )
}

// ----------------------------------------------------------------------

StudentInfo.propTypes = {
    student: PropTypes.object
};

// ----------------------------------------------------------------------

export function StudentInfo({ student }) {
    return (
        <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
                <Typography variant="h5"
                    sx={{
                        mb: 2,
                        display: 'block',
                    }}
                >
                    Student Information
                </Typography>
                <Grid container direction="row" spacing={2}>
                    <Grid item xs={12} md={2}>
                        <TextField fullWidth disabled label="Title" defaultValue={student.title} />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <TextField fullWidth disabled label="First name" defaultValue={student.fName} />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <TextField fullWidth disabled label="Last name" defaultValue={student.lName} />
                    </Grid>

                    <Grid item xs={12} md={2}>
                        <TextField fullWidth disabled label="Nickname" defaultValue={student.nickname} />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <TextField fullWidth disabled label="Birthdate" defaultValue={fDate(student.dob, 'dd MMMM yyyy')} />
                    </Grid>

                    <Grid item xs={12} md={2}>
                        <TextField fullWidth disabled label="Age" defaultValue={student.age} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField fullWidth disabled label="Phone number" defaultValue={student.phone} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField fullWidth disabled label="Line ID" defaultValue={student.line} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField fullWidth disabled label="Email address" defaultValue={student.email} />
                    </Grid>
                </Grid>
            </Card>
        </Grid>
    )
}

// ----------------------------------------------------------------------

SchoolInfo.propTypes = {
    student: PropTypes.object
};

// ----------------------------------------------------------------------

export function SchoolInfo({ student }) {
    return (
        <Card sx={{ p: 3 }}>
            <Typography variant="h5"
                sx={{
                    mb: 2,
                    display: 'block',
                }}
            >
                School Information
            </Typography>
            <Grid container direction="row" spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField fullWidth disabled label="School name" defaultValue={student.school} />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField fullWidth disabled label="School's country" defaultValue={student.countryOfSchool} />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField fullWidth disabled label="Level of study" defaultValue={student.levelOfStudy} />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField fullWidth disabled label="Target university" defaultValue={student.targetUni} />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField fullWidth disabled label="Target score" defaultValue={student.targetScore} />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField fullWidth disabled label="Study program" defaultValue={student.program} />
                </Grid>
            </Grid>
        </Card>
    )
}

// ----------------------------------------------------------------------

AddressInfo.propTypes = {
    student: PropTypes.object
};

// ----------------------------------------------------------------------

export function AddressInfo({ student }) {

    const { address } = student;

    return (
        <Card sx={{ p: 3 }}>
            <Typography variant="h5"
                sx={{
                    mb: 2,
                    display: 'block',
                }}
            >
                Address Information
            </Typography>
            <Grid container direction="row" spacing={2}>
                <Grid item xs={12} md={12}>
                    <TextField fullWidth disabled label="Address" defaultValue={address.address} />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField fullWidth disabled label="Sub district" defaultValue={address.subdistrict} />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField fullWidth disabled label="District" defaultValue={address.district} />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField fullWidth disabled label="Province" defaultValue={address.province} />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField fullWidth disabled label="Zip code" defaultValue={address.zipcode} />
                </Grid>
            </Grid>
        </Card>
    )
}

// ----------------------------------------------------------------------

ParentInfo.propTypes = {
    student: PropTypes.object
};

// ----------------------------------------------------------------------

export function ParentInfo({ student }) {

    const { parent } = student;

    return (
        <Card sx={{ p: 3 }}>
            <Typography variant="h5"
                sx={{
                    mb: 2,
                    display: 'block',
                }}
            >
                Parent Information
            </Typography>
            <Grid container direction="row" spacing={2}>
                <Grid item xs={12} md={5}>
                    <TextField fullWidth disabled label="First name" defaultValue={parent.fName} />
                </Grid>

                <Grid item xs={12} md={5}>
                    <TextField fullWidth disabled label="Last name" defaultValue={parent.lName} />
                </Grid>

                <Grid item xs={12} md={2}>
                    <TextField fullWidth disabled label="Relationship" defaultValue={parent.relationship} />
                </Grid>

                <Grid item xs={12} md={4}>
                    <TextField fullWidth disabled label="Phone number" defaultValue={parent.phone} />
                </Grid>

                <Grid item xs={12} md={4}>
                    <TextField fullWidth disabled label="Email address" defaultValue={parent.email} />
                </Grid>

                <Grid item xs={12} md={4}>
                    <TextField fullWidth disabled label="Line ID" defaultValue={parent.line} />
                </Grid>
            </Grid>
        </Card>
    )
}

// ----------------------------------------------------------------------

AdditionalInfo.propTypes = {
    student: PropTypes.object
};

// ----------------------------------------------------------------------

export function AdditionalInfo({ student }) {
    return (
        <Card sx={{ p: 3 }}>
            <Typography variant="h5"
                sx={{
                    mb: 2,
                    display: 'block',
                }}>
                Additional Information
            </Typography>
            <Grid container direction="row" spacing={2}>
                <Grid item xs={12} md={12}>
                    <TextField fullWidth disabled label="Health information that needs to be caution" defaultValue={student.healthInfo} />
                </Grid>
                <Grid item xs={12} md={12}>
                    <TextField fullWidth disabled label="How did student know about House of Griffin?" defaultValue={student.hogInfo} />
                </Grid>
            </Grid>
        </Card>
    )
}

// ----------------------------------------------------------------------

AdditionalFiles.propTypes = {
    student: PropTypes.object,
    filesURL: PropTypes.array
};

// ----------------------------------------------------------------------

export function AdditionalFiles({ student, filesURL }) {

    return (
        <Card sx={{ p: 3 }}>
            <Typography variant="h5"
                sx={{
                    mb: 2,
                    display: 'block',
                }}>
                Additional Files
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
    )
}