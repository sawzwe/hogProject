import PropTypes from 'prop-types';
import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
// form
import { useForm, Controller, useFormContext } from 'react-hook-form';
// @mui
import { DatePicker } from '@mui/x-date-pickers';
import { Stack, Dialog, Button, TextField, DialogTitle, DialogContent, DialogActions, Typography, InputAdornment, ListItem, Divider, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
// utils
import { fTimestamp, fDate } from '../../../../utils/formatTime';
// components
import { useSnackbar } from '../../../../components/snackbar';
import Iconify from '../../../../components/iconify';
import { Upload } from '../../../../components/upload';
import SearchNotFound from '../../../../components/search-not-found/SearchNotFound';
import Scrollbar from '../../../../components/scrollbar/Scrollbar';
import AddCourseGroupDetailDialog from './AddCourseGroupDetailDialog';

// ----------------------------------------------------------------------

AddCourseDialog.propTypes = {
    type: PropTypes.string,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onSelect: PropTypes.func,
    selected: PropTypes.array,
    courseOptions: PropTypes.array,
};

export default function AddCourseDialog({ type, open, onClose, onSelect, selected, courseOptions }) {
    const {
        watch,
        setValue,
        formState: { errors },
    } = useFormContext();

    const [selectedCourse, setSelectedCourse] = useState({});
    const [selectedCourseSubjects, setSelectedCourseSubjects] = useState([]);

    const [filterCourseName, setFilterCourseName] = useState('');
    const [filterStartDate, setFilterStartDate] = useState(null);
    const [filterEndDate, setFilterEndDate] = useState(null);

    const [openAddCourseDetailDialog, setOpenAddCourseDetailDialog] = useState(false);

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

    // Course Detail Dialog
    const handleOpenAddCourseDetailDialog = (course) => {
        setSelectedCourse(course)
        setOpenAddCourseDetailDialog(true);
    };

    const handleCloseAddCourseDetailDialog = () => {
        setSelectedCourse({});
        setValue('selectedCourseSubjects', [])
        setOpenAddCourseDetailDialog(false);
    };

    // TO DO NEXT
    // 1. Table for courses in dialog
    // 2. Course detail after dialog

    return (
        <>
            {type === 'Group' && (
                <>
                    <Dialog fullWidth maxWidth="md" open={open} onClose={handleCloseDialog} >
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pt: 2.5, px: 3 }}>
                            <Typography variant="h6"> {type === 'Group' ? 'Join Group' : 'New Course'} </Typography>
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
                                        !selected?.some((c) => c.id === course.id) &&
                                        <Box key={course.id}>
                                            <ListItem
                                                key={course.id}
                                                secondaryAction={
                                                    <IconButton variant="outlined" onClick={() => handleOpenAddCourseDetailDialog(course)}>
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
                        type={type}
                        open={openAddCourseDetailDialog}
                        close={handleCloseAddCourseDetailDialog}
                        course={selectedCourse}
                        onSelect={() => onSelect(selectedCourse)}
                    />
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