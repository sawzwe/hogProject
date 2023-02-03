import PropTypes from 'prop-types';
import { useEffect, useState, useCallback, useMemo } from 'react';
import dayjs from 'dayjs';
// form
import { useFormContext } from 'react-hook-form';
// @mui
import { DatePicker } from '@mui/x-date-pickers';
import { Stack, Dialog, Button, Grid, TextField, Typography, InputAdornment, List, Checkbox, ListItem, Divider, Box, IconButton, MenuItem } from '@mui/material';
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
import SelectAvailableDays from './SelectAvailableDays';
// assets
import { RHFSelect, RHFTextField, RHFRadioGroup, RHFMultiCheckbox, RHFCheckbox } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

const LEARNING_METHOD_OPTIONS = [
    'Onsite',
    'Online'
];

const COURSE_TYPE_OPTIONS = [
    { value: 'Existing Course', label: 'Existing Course' },
    { value: 'Custom Course', label: 'Custom Course' },
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
        newCourseType,
        newCourse,
        newSubject,
        newLevel,
        newHour,
        newLearningMethod,
        newStartDate,
        newEndDate,
        newAvailableDays,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday,
        mondayFromTime,
        mondayToTime,
        tuesdayFromTime,
        tuesdayToTime,
        wednesdayFromTime,
        wednesdayToTime,
        thursdayFromTime,
        thursdayToTime,
        fridayFromTime,
        fridayToTime,
        saturdayFromTime,
        saturdayToTime,
        sundayFromTime,
        sundayToTime,
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

    // PRIVATE --------------------------------------------------------------------------------------------

    // Track current Private/ Semi Private subjects based on selected course
    const [privateSubjects, setPrivateSubjects] = useState([]);
    const [privateLevels, setPrivateLevels] = useState([]);

    // 1. Reset selected subject once change the course or new course type
    // 2. Set new subjects for select options
    useEffect(() => {
        setValue('newCourse', '')
        setValue('newSubject', '')
        setValue('newLevel', '')
    }, [newCourseType])

    useEffect(() => {
        if (newCourseType === 'Existing Course' && newCourse) {
            setValue('newSubject', '')
            setValue('newLevel', '')
            const targetCourse = courseOptions.find((option) => option.course === newCourse)
            setPrivateSubjects(targetCourse.subjects)
            setPrivateLevels(targetCourse.level)
        }
    }, [newCourse]);

    const handleCreate = () => {
        console.log(newAvailableDays)
        const createdCourse = {
            name: newCourse,
            subject: newSubject,
            level: newLevel,
            totalHours: newHour,
            method: newLearningMethod,
            startDate: newStartDate,
            endDate: newEndDate,
            availableDays: newAvailableDays,
        }
        console.log(createdCourse)
        onSelect(createdCourse)
        onClose();
    };

    const today = dayjs();

    const [checked, setChecked] = useState(false);

    const handleCheckboxChange = (event) => {
        setChecked(event.target.checked);
    };

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

            {/* Private or Semi Private */}
            {courseType !== 'Group' && (
                <>
                    <Dialog fullWidth maxWidth="md" open={open} onClose={handleCloseDialog} >
                        <Scrollbar sx={{ p: 2, pt: 0, maxHeight: 80 * 8 }}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} md={12}>
                                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pt: 2.5, px: 3 }}>
                                        <Typography variant="h6"> {courseType === 'Group' ? 'Join Group' : 'New Course'} </Typography>
                                        <IconButton variant="h6" onClick={handleCloseDialog}> <CloseIcon /> </IconButton>
                                    </Stack>
                                </Grid>
                                <Grid container sx={{ px: 4, pb: 2, pt:0 }}>
                                    {/* Radio Group Button */}
                                    <Grid item xs={12} md={12}>
                                        <RHFRadioGroup
                                            name="newCourseType"
                                            options={COURSE_TYPE_OPTIONS}
                                            sx={{
                                                '& .MuiFormControlLabel-root': { mr: 4 },
                                            }}
                                        />
                                    </Grid>
                                </Grid>

                                <Grid container sx={{ px: 3 }} spacing={2}>
                                    {/* Existing Course or Custom Course */}
                                    {newCourseType === 'Existing Course' ? (
                                        <>
                                            {/* Select Course */}
                                            <Grid item xs={12} md={6}>
                                                <RHFSelect
                                                    name="newCourse"
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
                                                        name="newSubject"
                                                        defaultValue=""
                                                        label="Subject"
                                                        disabled={!!!newCourse}
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
                                                        name="newSubject"
                                                        label="Unavailable"
                                                        disabled
                                                        SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}>
                                                        <MenuItem
                                                            key={"None"}
                                                            value={"Unavailable"}
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
                                                        name="newLevel"
                                                        defaultValue=""
                                                        label="Level"
                                                        disabled={!!!newCourse}
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
                                                        name="newLevel"
                                                        label="Unavailable"
                                                        disabled
                                                        SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}>
                                                        <MenuItem
                                                            key={"None"}
                                                            value={"Unavailable"}
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
                                        </>
                                    ) :
                                        <>
                                            <Grid item xs={6} md={6}>
                                                <RHFTextField name="newCourse" label="Course" required />
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <RHFTextField name="newSubject" label="Subject" />
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <RHFTextField name="newLevel" label="Level" />
                                            </Grid>
                                        </>
                                    }

                                    {/* Hour */}
                                    <Grid item xs={6} md={3}>
                                        <RHFTextField name="newHour" label="Hours" type="number" required />
                                    </Grid>

                                    {/* Learning Method */}
                                    <Grid item xs={6} md={3}>
                                        <RHFSelect
                                            name="newLearningMethod"
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

                                <Grid container sx={{ px: 3, py: 2 }} spacing={2}>
                                    {/* Start Date */}
                                    <Grid item xs={12} md={6}>
                                        <DatePicker
                                            fullWidth
                                            label="Start Date"
                                            minDate={today}
                                            value={newStartDate}
                                            onChange={(newValue) => {
                                                setValue('newStartDate', newValue);
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    required
                                                    fullWidth
                                                />
                                            )}
                                            disableMaskedInput
                                            inputFormat="dd-MMM-yyyy"
                                        />
                                    </Grid>

                                    {/* End Date */}
                                    <Grid item xs={12} md={6}>
                                        <DatePicker
                                            fullWidth
                                            label="End Date"
                                            minDate={today}
                                            value={newEndDate}
                                            onChange={(newValue) => {
                                                setValue('newEndDate', newValue);
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    required
                                                    fullWidth
                                                />
                                            )}
                                            disableMaskedInput
                                            inputFormat="dd-MMM-yyyy"
                                        />
                                    </Grid>

                                    {/* Select Available Dates */}
                                    <SelectAvailableDays />
                                </Grid>

                                {/* Submit Button */}
                                <Grid item xs={12} md={12}>
                                    <Stack direction="row" justifyContent="flex-end" alignItems="center" sx={{ p: 3, pt:0 }}>
                                        <Button
                                            variant="contained"
                                            sx={{ height: '3em', width: '6em' }}
                                            onClick={handleCreate}>
                                            Create
                                        </Button>
                                    </Stack>
                                </Grid>


                            </Grid>
                        </Scrollbar>
                    </Dialog>
                </>
            )
            }
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