import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
    Grid,
    Typography,
    TextField,
    Button,
    Paper,
    Stack,
    Dialog,
    IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
// auth
import { useAuthContext } from '../../auth/useAuthContext';

// ----------------------------------------------------------------

ViewStudentCourse.propTypes = {
    student: PropTypes.object
}

export default function ViewStudentCourse({ student }) {

    const mockupCourse = {
        course: 'SAT',
        subject: 'VERBAL',
        level: 'REGULAR',
        type: 'Private',
        section: 'Hong'
    }

    const mockupCourse2 = {
        course: 'GED',
        subject: 'MATH',
        level: 'REGULAR',
        type: 'Private',
        section: 'Saw'
    }

    const [selectedCourse, setSelectedCourse] = useState({});
    const [openEditSchedule, setOpenEditSchedule] = useState(false);

    const handleSelect = async (course) => {
        await setSelectedCourse(course)
        setOpenEditSchedule(true);
    }


    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
                <Typography variant="h6">
                    Registered Course
                </Typography>
            </Grid>

            <Grid item xs={12} md={12}>
                <Stack direction="column" spacing={2}>
                    <ClassPaper _course={mockupCourse} onSelect={handleSelect} />
                    <ClassPaper _course={mockupCourse2} onSelect={handleSelect} />
                </Stack>
            </Grid>
            <EditScheduleDialog open={openEditSchedule} onClose={() => setOpenEditSchedule(false)} selectedCourse={selectedCourse} />
        </Grid>
    )
}

// ----------------------------------------------------------------

ClassPaper.propTypes = {
    _course: PropTypes.object,
    onSelect: PropTypes.func
}

export function ClassPaper({ _course, onSelect }) {

    const {
        course,
        subject,
        level,
        type,
        section
    } = _course;

    return (
        <Paper variant="elevation" elevation={3} sx={{ p: 3 }}>
            <Grid container direction="row" spacing={2}>
                <Grid item xs={12} md={3.5}>
                    <TextField
                        fullWidth
                        disabled
                        variant="outlined"
                        label="Course"
                        defaultValue={`${course} ${subject} ${level}`}
                    />
                </Grid>
                <Grid item xs={12} md={2.875}>
                    <TextField
                        fullWidth
                        disabled
                        variant="outlined"
                        label="Type"
                        defaultValue={type}
                    />
                </Grid>
                <Grid item xs={12} md={2.875}>
                    <TextField
                        fullWidth
                        disabled
                        variant="outlined"
                        label="Section"
                        defaultValue={section}
                    />
                </Grid>
                <Grid item xs={12} md>
                    <Button fullWidth variant="contained" color="inherit" sx={{ height: 56 }} onClick={() => onSelect(_course)}>
                        <EditIcon sx={{ mr: 1 }} />
                        Edit schedule
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    )
}

// ----------------------------------------------------------------

EditScheduleDialog.propTypes = {
    selectedCourse: PropTypes.object,
    open: PropTypes.bool,
    onClose: PropTypes.func
}

export function EditScheduleDialog({ selectedCourse, open, onClose }) {

    const {
        course,
        subject,
        level,
        type,
        section
    } = selectedCourse;

    return (
        <Dialog fullWidth maxWidth="xl" open={open} onClose={onClose}
            PaperProps={{
                sx: {
                    '&::-webkit-scrollbar': { display: 'none' }
                }
            }}
        >
            <Grid container direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 3, py: 1 }}>
                <Typography variant="h6"> Edit Schedule </Typography>
                <IconButton variant="h6" onClick={onClose}> <CloseIcon /> </IconButton>
            </Grid>
            <Grid container direction="row" sx={{ px: 3 }} spacing={2}>
                <CourseInfo selectedCourse={selectedCourse} />
            </Grid>
        </Dialog>
    )
}

// ----------------------------------------------------------------

CourseInfo.propTypes = {
    selectedCourse: PropTypes.object
}

export function CourseInfo({ selectedCourse }) {

    const {
        course,
        subject,
        level,
        type,
        section
    } = selectedCourse;

    return (
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
                            defaultValue={type}
                            label="Course Type"
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            defaultValue={`${course} ${subject} ${level}`}
                            label="Course"
                            disabled
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
                            defaultValue="Onsite"
                            label="Learning Method"
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            defaultValue="20"
                            label="Total Hours"
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            defaultValue="2"
                            label="Hours/Class"
                            disabled
                        />
                    </Grid>
                </Grid>
            </Stack>
        </Grid>
    )
}