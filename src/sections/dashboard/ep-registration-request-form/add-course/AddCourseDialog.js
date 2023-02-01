import PropTypes from 'prop-types';
import { useEffect, useState, useCallback, useMemo } from 'react';
// form
import { useFormContext } from 'react-hook-form';
// @mui
import { DatePicker } from '@mui/x-date-pickers';
import { Stack, Dialog, Button, Grid, TextField, Typography, InputAdornment, ListItem, Divider, Box, IconButton, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
// utils
import { fTimestamp } from '../../../../utils/formatTime';
// components
import { useSnackbar } from '../../../../components/snackbar';
import Iconify from '../../../../components/iconify';
import SearchNotFound from '../../../../components/search-not-found/SearchNotFound';
import Scrollbar from '../../../../components/scrollbar/Scrollbar';
import AddCourseGroupDetailDialog from './AddCourseGroupDetailDialog';
// assets
import { RHFSelect, RHFTextField } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

const LEARNING_METHOD_OPTIONS = [
    'Onsite',
    'Online'
]

AddCourseDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onSelect: PropTypes.func,
    courseOptions: PropTypes.array,
};

export default function AddCourseDialog({ open, onClose, onSelect, courseOptions }) {
    const {
        watch,
        setValue,
        formState: { errors },
    } = useFormContext();

    const values = watch();

    const {
        courseType,
        courses,
        selectedPrivateCourse,
        selectedPrivateSubject,
        selectedPrivateLevel,
        selectedHour,
        selectedLearningMethod
    } = values;

    // Filter courses
    const [filterCourseName, setFilterCourseName] = useState('');
    const [filterStartDate, setFilterStartDate] = useState(null);
    const [filterEndDate, setFilterEndDate] = useState(null);

    const dataFiltered = applyFilter({
        courseOptions,
        filterCourseName,
        filterStartDate,
        filterEndDate,
    });

    const isNotFound =
        (!dataFiltered.length && !!filterCourseName) ||
        (!dataFiltered.length && !!filterStartDate) ||
        (!dataFiltered.length && !!filterEndDate);

    const handleSearchCourse = (event) => {
        setFilterCourseName(event.target.value);
    };

    const handleCloseDialog = () => {
        setFilterCourseName('');
        setFilterStartDate(null);
        setFilterEndDate(null);
        onClose();
    }

    // Watch selected course and subjects
    const [selectedCourse, setSelectedCourse] = useState({});

    // Course Detail Dialog
    const [openCourseDetailDialog, setOpenCourseDetailDialog] = useState(false);

    const handleOpenCourseDetailDialog = (course) => {
        setSelectedCourse(course)
        setOpenCourseDetailDialog(true);
    };

    const handleCloseCourseDetailDialog = () => {
        setSelectedCourse({});
        setOpenCourseDetailDialog(false);
    };

    // Track current Private/ Semi Private subjects based on selected course
    const [privateSubjects, setPrivateSubjects] = useState([]);
    const [privateLevels, setPrivateLevels] = useState([]);

    // 1. Reset selected subject once change the course
    // 2. Set new subjects for select options
    useEffect(() => {
        setValue('selectedPrivateSubject', '')
        setValue('selectedPrivateLevel', '')
        if (selectedPrivateCourse) {
            const targetCourse = courseOptions.find((option) => option.course === selectedPrivateCourse)
            setPrivateSubjects(targetCourse.subjects)
            setPrivateLevels(targetCourse.level)

        }
    }, [selectedPrivateCourse]);

    // console.log(selectedPrivateCourse);
    // console.log(privateLevels)
    // console.log(!!privateSubjects.length);
    // console.log(selectedPrivateSubject)

    return (
        <>
            {courseType === 'Group' && (
                <>
                    <Dialog fullWidth maxWidth="md" open={open} onClose={handleCloseDialog} >
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pt: 2.5, px: 3 }}>
                            <Typography variant="h6"> {courseType === 'Group' ? 'Join Group' : 'New Course'} </Typography>
                            <IconButton variant="h6" onClick={handleCloseDialog}> <CloseIcon /> </IconButton>
                        </Stack>

                        <Stack spacing={2} sx={{ p: 2.5 }}>
                            <TextField
                                value={filterCourseName}
                                onChange={handleSearchCourse}
                                placeholder="Search..."
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled ' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Stack spacing={2} direction="row" >
                                {/* From */}
                                <DatePicker
                                    label="Start Date"
                                    value={filterStartDate}
                                    onChange={(newValue) => {
                                        setFilterStartDate(newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                        />
                                    )}
                                    disableMaskedInput
                                    inputFormat="dd-MMM-yyyy"
                                />

                                {/* To */}
                                <DatePicker
                                    label="End Date"
                                    value={filterEndDate}
                                    onChange={(newValue) => {
                                        setFilterEndDate(newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                        />
                                    )}
                                    disableMaskedInput
                                    inputFormat="dd-MMM-yyyy"
                                />

                            </Stack>
                        </Stack>

                        {isNotFound ? (
                            <SearchNotFound sx={{ px: 3, pt: 5, pb: 10 }} />
                        ) : (
                            <>
                                <Scrollbar sx={{ p: 2.5, pt: 0, pb: 4, maxHeight: 80 * 8 }}>
                                    {dataFiltered.map((course) => (
                                        !courses?.some((c) => c.id === course.id) &&
                                        <Box key={course.id}>
                                            <ListItem
                                                key={course.id}
                                                secondaryAction={
                                                    <IconButton variant="outlined" onClick={() => handleOpenCourseDetailDialog(course)}>
                                                        <NavigateNextIcon />
                                                    </IconButton>
                                                }
                                                alignItems="flex-start"
                                                sx={{
                                                    p: 1,
                                                    mb: 1,
                                                    mt: 1,
                                                    borderRadius: 1,
                                                    flexDirection: 'column',
                                                    alignItems: 'flex-start',
                                                    '&.Mui-selected': {
                                                        bgcolor: 'action.selected',
                                                        '&:hover': {
                                                            bgcolor: 'action.selected',
                                                        },
                                                    },
                                                }}
                                            >
                                                <Typography
                                                    sx={{ display: 'inline' }}
                                                    component="span"
                                                    variant="subtitle2">
                                                    {course.id} {course.name} {course.subject} {course.level} {course.startDate} {course.endDate}
                                                </Typography>
                                            </ListItem>
                                            <Divider />
                                        </Box>
                                    ))}
                                </Scrollbar>
                            </>
                        )}
                    </Dialog>
                    <AddCourseGroupDetailDialog
                        open={openCourseDetailDialog}
                        close={handleCloseCourseDetailDialog}
                        course={selectedCourse}
                        onSelect={(addedCourse) => onSelect(addedCourse)}
                        onJoin={() => { onClose() }}
                    />
                </>
            )}


            {courseType !== 'Group' && (
                <>
                    <Dialog fullWidth maxWidth="md" open={open} onClose={handleCloseDialog} >
                        <Grid container spacing={1}>
                            <Grid item xs={12} md={12}>
                                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pt: 2.5, px: 3 }}>
                                    <Typography variant="h6"> {courseType === 'Group' ? 'Join Group' : 'New Course'} </Typography>
                                    <IconButton variant="h6" onClick={handleCloseDialog}> <CloseIcon /> </IconButton>
                                </Stack>
                            </Grid>
                            <Grid container sx={{ px: 3, py: 2 }} spacing={2}>
                                {/* Select Course */}
                                <Grid item xs={12} md={6}>
                                    <RHFSelect
                                        name="selectedPrivateCourse"
                                        label="Course"
                                        SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                                        required>
                                        {courseOptions.map((option) => (
                                            <MenuItem
                                                key={option.id}
                                                value={option.course}
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
                                                {option.course}
                                            </MenuItem>
                                        ))}
                                    </RHFSelect>
                                </Grid>

                                {/* Select Subject */}
                                <Grid item xs={12} md={6}>
                                    {!!privateSubjects.length ?
                                        <RHFSelect
                                            name="selectedPrivateSubject"
                                            label="Subject"
                                            disabled={!!!selectedPrivateCourse}
                                            SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                                            required>
                                            {privateSubjects.map((option) => (
                                                <MenuItem
                                                    key={option}
                                                    value={option}
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
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </RHFSelect> :
                                        <RHFSelect
                                            name="selectedPrivateSubject"
                                            label="None"
                                            disabled
                                            SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}>
                                            <MenuItem
                                                key={"None"}
                                                value={"None"}
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
                                                None
                                            </MenuItem>
                                        </RHFSelect>
                                    }
                                </Grid>

                                {/* Select Level */}
                                <Grid item xs={12} md={6}>
                                    {!!privateLevels.length ?
                                        <RHFSelect
                                            name="selectedPrivateLevel"
                                            label="Level"
                                            disabled={!!!selectedPrivateCourse}
                                            SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                                            required>
                                            {privateLevels.map((option) => (
                                                <MenuItem
                                                    key={option}
                                                    value={option}
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
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </RHFSelect> :
                                        <RHFSelect
                                            name="selectedPrivateLevel"
                                            label="None"
                                            disabled
                                            SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}>
                                            <MenuItem
                                                key={"None"}
                                                value={"None"}
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
                                                None
                                            </MenuItem>
                                        </RHFSelect>
                                    }
                                </Grid>

                                {/* Hour */}
                                <Grid item xs={6} md={3}>
                                    <RHFTextField name="selectedHour" label="Hours" type="number" required />
                                </Grid>

                                {/* Learning Method */}
                                <Grid item xs={6} md={3}>
                                    <RHFSelect
                                        name="selectedLearningMethod"
                                        label="Learning Method"
                                        SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                                        required>
                                        {LEARNING_METHOD_OPTIONS.map((option) => (
                                            <MenuItem
                                                key={option}
                                                value={option}
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
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </RHFSelect>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Dialog>
                </>
            )}
        </>
    )
}

// ----------------------------------------------------------------------

function applyFilter({ courseOptions, filterCourseName, filterStartDate, filterEndDate }) {
    if (filterCourseName) {
        courseOptions = courseOptions.filter(
            (course) =>
                course.id.indexOf(filterCourseName) !== -1 ||
                course.name.toLowerCase().indexOf(filterCourseName.toLowerCase()) !== -1
        )
    }

    if (filterStartDate && filterEndDate) {
        courseOptions = courseOptions.filter(
            (course) =>
                fTimestamp(course.startDate) >= fTimestamp(filterStartDate) &&
                fTimestamp(course.startDate) <= fTimestamp(filterEndDate) &&
                fTimestamp(course.endDate) <= fTimestamp(filterEndDate)
        );
    }

    return courseOptions;
}